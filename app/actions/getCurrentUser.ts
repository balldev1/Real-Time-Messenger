import prisma from '@/app/libs/prismadb';

import getSession from './getSession';

const getCurrentUser = async () => {
    try {
        // รับ session ผู้ใช้
        const session = await getSession();

        //ถ้าไม่ใช่ session => null
        if (!session?.user?.email) {
            return null;
        }

        // findUnique หาค่า unique prisma email === session
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        // false null
        if (!currentUser) {
            return null;
        }

        // true คืนค่า 
        return currentUser;

    } catch (error: any) {
        return null;
    }
}

export default getCurrentUser;