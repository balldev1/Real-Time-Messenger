import prisma from '@/app/libs/prismadb';

// รับ params id
//ใช้เพือดึงข้อมูล ข้อความรูปภาพการคุย จาก params.id
const getMessage = async (conversationId: string) => {
    try {
        //ฐานข้อมูล messagee convertion idที่ตรงกับ conversationId params ฝั่ง client
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: 'asc' // asc จากน้อยไปมาก
            }
        });

        return messages;

    } catch (error: any) {
        return [];
    }
}

export default getMessage;