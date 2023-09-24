import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

// รับ params id 
// ใช้เพือดึงข้อมูลcoversation  user ที่มีการสนทนากัน ที่ตรงกับ id === params
const getConversationById = async (conversationId: string) => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) {
            return null;
        }

        // ฐานข้อมูล conversation ที่ id ตรง id paramas
        // รวมข้อมูลของ user id นั้น
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        return conversation;

    } catch (error: any) {
        return null;
    }
};

export default getConversationById;