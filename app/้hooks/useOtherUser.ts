import { useSession } from "next-auth/react";
import { useMemo } from 'react';
import { FullConversationType } from "../types";
import { User } from '@prisma/client';

// กรองข้อมูล user อื่นที่ไม่ใช่ user ปัจจุบัน
const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {

    // session ผู้ใช้
    const session = useSession();


    const otherUser = useMemo(() => {
        // email ผู้ใช้ปัจจุบัน
        const currentUserEmail = session?.data?.user?.email;

        // กรองข้อมูล email ที่ไม่ใช่ ผู้ใช้ปัจจุบัน
        const otherUser = conversation.users.filter((user) =>
            user.email !== currentUserEmail);

        return otherUser[0];
    }, [session?.data?.user?.email, conversation.users]);

    return otherUser;
};

export default useOtherUser;