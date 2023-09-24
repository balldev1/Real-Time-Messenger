import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
    try {
        // ผู้ใช้ปัจจุบัน
        const currentUser = await getCurrentUser();

        // รับข้อมูลจาก body
        const body = await request.json();

        const { message, image, conversationId } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // สร้าง message ฐานข้อมูล 
        const newMessage = await prisma.message.create({
            data: {
                body: message, // ข้อความ
                image: image, // รูป
                conversation: {
                    connect: {
                        id: conversationId //คู่สนทนา
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id //  id user ปัจจุบัน
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id //  id user ปัจจุบัน
                    }
                }
            },
            include: {
                seen: true,
                sender: true,
            }
        });

        // อัพเดท คู่สนทนา ฐานข้อมูล conversation ที่ id conversationid ตรงกัน
        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id // id ของฐานข้อมูลข้อความใหม่
                    }
                }
            }, // รวมข้อมูล user ข้อมูล, messages[] ในconversation ทีเห็นแล้ว
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        });

        //  pusherServer.trigger ใช้เพื่อส่งข้อมูลไปยัง channel ใน Pusher.
        // 'messages:new' เป็นชื่อของ event ที่จะถูกเรียกใช้ใน client.
        // newMessage คือข้อมูลที่ถูกส่งไปยัง client ผ่าน event 'messages:new'.
        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        //ข้อความล่าสุด
        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]; //length - 1 คือข้อความล่าสุด ใน array

        // update ข้อความล่าสุด ตาม coversation.id
        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        });

        return NextResponse.json(newMessage);
    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES');
        return new NextResponse('InternalError', { status: 500 });
    }
}