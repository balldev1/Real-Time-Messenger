import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2'
import { signOut } from 'next-auth/react';

import useConversation from "./useConversation"; // hook

//กำหนดเส้นทาง
const useRoutes = () => {
    const pathname = usePathname();

    const { conversationId } = useConversation(); //hook params

    // จัดการเส้นทางเมือค่า pathname,conversationId เปลี่ยนแปลง
    const routes = useMemo(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            active: pathname === '/conversations' || !!conversationId // ถ้าจริง === ให้ไปหน้า conversations
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            active: pathname === '/users'
        },
        {
            label: 'Logout',
            href: '#',
            onClick: () => signOut(),
            icon: HiArrowLeftOnRectangle
        }
    ], [pathname, conversationId]);

    return routes;
}

export default useRoutes;