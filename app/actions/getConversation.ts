import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

// การสนทนา
const getConversations = async () => {
    //รับข้อมูลผู้ใช้ปัจจุบัน
    const currentUser = await getCurrentUser();

    // false return []
    if (!currentUser?.id) {
        return [];
    }

    // หาข้อมูลจากฐานข้อมูล => Many ทุกอัน => conversation => lastMessageAt => ล่าสุดไปเก่า desc
    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            // หา userIds จาก ฐานข้อมูล มีค่า === currentuset.id
            // has currentUser.id อยู่ในคอลัมน์ userIds หรือไม่ ถ้าอยู่จะคืนค่ามา
            // จะคืนค่าทั้งหมดใน {}
            // เช่น userid 1,2,3 ใน current มี 1 จะคืนค่า 1,2,3ทั้งหมด
            // แต่ถ้า current 4 จะไม่คืนค่าอะไรเลย
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true, // รวมข้อมูล user 
                messages: {
                    include: {
                        sender: true, // รวมข้อมูล messages   sender , seen
                        seen: true
                    }
                }
            }
        })

        return conversations;

    } catch (error: any) {
        return [];
    }
}

export default getConversations;