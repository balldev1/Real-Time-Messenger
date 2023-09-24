import prisma from '@/app/libs/prismadb'; // ฐานข้อมูล

import getSession from './getSession';

// รับข้อมูลผู้ใช่อื่นที่ไม่ใช่ตัว user
const getUsers = async () => {
    //รับ session
    const session = await getSession();

    // ถ้าไม่มี session return
    if (!session?.user?.email) {
        return [];
    }

    // หาข้อมูลจากฐานข้อมูล findmany user
    // desc หาข้อมูลใหม่สุด ไปเก่าสุดจาก createdad
    // หาข้อมูล ผู้ใช่ที่ email != session.email
    try {
        const user = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session.user.email
                }
            }
        });

        return user;
    } catch (error: any) {
        return [];
    }
}

export default getUsers;