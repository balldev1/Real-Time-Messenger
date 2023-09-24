import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

interface IParams {
    conversationId?: string;
}

// ลบข้อมูลการสนทนา ระหว่าง ผู้ใช้ปัจจุบัน กับ คู่สนทนา 
// ลบข้อมูล Modal conversation.id params
export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        // params ที่รับเข้า
        const { conversationId } = params;
        //ผู้ใช้ปัจจุบัน
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // หาข้อมูล conversation => id => รวมข้อมูล user[]
        // ข้อมูลการสนทนาที่มีอยู่
        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            // เอาข้อมูล users[] มาด้วย
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 })
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            // id = conversationid
            // ลบแถว userid ที่มีผู้ใช้ปัจจุบัน currentUser.id
            // คือลบข้อมูลคู่สนทนา ระหว่าง ผู้ใช้ปัจจุบัน กับ convertionid ที่กำลังสนทนาด้วยกัน
            // hasSome  เป็นเงื่อนไขที่ใช้ตรวจสอบว่าค่าที่เราต้องการอยู่ใน array หรือไม่ใน Prisma.
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })


        return NextResponse.json(deletedConversation);

    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE');
        return new NextResponse('Internal Error', { status: 500 })
    }
}