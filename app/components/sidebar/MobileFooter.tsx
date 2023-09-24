'use client'

import useConversation from "@/app/้hooks/useConversation";
import useRoutes from "@/app/้hooks/useRoutes";
import MoblieItem from "./MoblieItem";

const MobileFooter = () => {

    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) {
        return null;
    }

    return (
        <div className="lg:hidden fixed justify-between w-full bottom-0
        z-40 flex items-center bg-white border-t-[1px]">
            {routes.map((route) => (
                <MoblieItem
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    active={route.active}
                    onClick={route.onClick}
                />
            ))}
        </div>
    )
}

export default MobileFooter