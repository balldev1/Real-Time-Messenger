import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { update } from 'lodash';

interface IParams {
    conversationId?: string;
}

// function updated message ข้อความล่าสุด จัดการข้อมูลการเห็นของข้อความล่าสุดในการสนทนา
export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        // currentUser
        const currentUser = await getCurrentUser();

        // params.id
        const { conversationId } = params;

        // !== currentUser
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // เอาข้อมูล ฐานข้อมูล
        const conversation = await prisma.conversation.findUnique({
            //id ที่ตรงกับ params
            where: {
                id: conversationId
            },
            // ข้อมูล message seen ที่เห็น 
            // ข้อมูล user 
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        });

        // !==
        if (!conversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        //ข้อความล่าสุดของ message เอา messages -1 คือข้อความล่าสุด 
        const lastMessage = conversation.messages[conversation.messages.length - 1]

        //!== lastmessage return.json
        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // update message โดยใช้ id ที่ได้จาก lastMessage.id === id message 
        // update ข้อความล่าสุด seen last message current.id
        // data seen id message === currentUser.id
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        });

        //triger ใช้ในการส่ง ข้อมูล event ไป pusherSErver 
        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        });


        //ตรวจสอบว่า currentUser.id ไม่อยู่ที่ index 1 ใน array lastMessage.seenIds
        if (lastMessage.seenIds.indexOf(currentUser.id) !== 1) {
            return NextResponse.json(conversation);
        }

        //ส่งข้อมูล id , 'message:update' ชื่อ event , => updatedMessage
        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

        return NextResponse.json(updatedMessage);

    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGE_SEEN')
        return new NextResponse('Internal Error', { status: 500 });
    }
}