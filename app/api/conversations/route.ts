import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

// การสนทนา ระหว่าง user
export async function POST(request: Request) {
    try {
        // รับ ผู้ใช้ปัจจุบัน กับ body จาก component  UserBox
        const currentUser = await getCurrentUser();
        const body = await request.json(); // อ่าน req เป็นแบบ json
        // ดึงค่า body ที่ตรงกับตัวแปร ไปใส่ตัวแปรใน {...}
        const { userId, isGroup, members, name } = body;

        // ถ้าไม่ใช่ผู้ใช้ปัจจุบัน id,email error
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }


        // ถ้า !member หรือ น้อยกว่า 2 หรือ !name  จะไม่ใช่ Group
        // isGroup true และ ในวงเว็บตัวใดตัวหนึ่งเป็น true คำสั่งนี้จะทำงาน
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        // สร้างฐานข้อมูล conversation Group
        // การใช้ users: { connect: [...] } นี้จะสร้างและเชื่อมต่อ (connect) 
        // ข้อมูลผู้ใช้ที่เข้าร่วม conversation ใหม่ลงในฐานข้อมูล 
        // โดยสร้างรายการของผู้ใช้ที่เข้าร่วม conversation โดยใช้ข้อมูลจาก members 
        // และเพิ่มผู้ใช้ปัจจุบัน (currentUser) ในรายการด้วยแบบการสร้าง object 
        // และการเชื่อมต่อข้อมูลในฐานข้อมูล.
        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) =>
                                ({ id: member.value })), //เอาค่าid ผู้ใช้อื่นมาลูปแล้วเก็บไว้ใน {...member}
                            {
                                id: currentUser.id //ผู้ใช้ปัจจุบัน
                            }
                        ]
                    }
                },
                include: {
                    users: true //รวมข้อมูลผู้ใช้ user เข้ามาใน coversation
                }
            });

            // ข้อมูล users วนลูป เอาข้อมูล user.email
            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, 'conversation:new', newConversation)
                }
            })

            return NextResponse.json(newConversation);
        }



        //ค้นหาข้อมูล ฐานข้อมูลcoversation
        const exisitingConversations = await prisma.conversation.findMany({
            where: {
                //or คือตรงอย่างน้อย1รายการ id มี [currentUser.id , userId] 
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        });

        // เข้าถึง exisiting อันแรก
        const singleConversation = exisitingConversations[0];

        // ถ้ามีค่าให้ resonse.json (singleConversation) ค่าแรก
        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }



        // สร้างฐานข้อมูล conversation
        // connect ข้อมูลเข้า users => conversation
        // id จากฐานข้อมูล === currenUser.id / userid เชื่อมกัน
        // โค้ดนี้จะเชื่อมต่อผู้ใช้ทั้งสองคน (ผู้ใช้ปัจจุบันและผู้ใช้คู่สนทนา)
        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }

                    ]
                }
            },
            include: {
                users: true //รวมข้อมูล users เข้ากับผลลัพธ์ ทำให้ได้ข้อมูล users กับ conversation
            }
        });

        newConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation)
            }
        })

        return NextResponse.json(newConversation);


    } catch (error: any) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}