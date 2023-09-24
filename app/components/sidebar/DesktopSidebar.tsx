'use client'

import useRoutes from '@/app/้hooks/useRoutes' // hook
import React, { useState } from 'react'
import { User } from '@prisma/client'; // ฐานข้อมูล

import Avatar from '../Avatar';
import DesktopItem from './DesktopItem';
import SettingsModal from './SettingsModal';


// currentUser type User ฐานข้อมูล
interface DesktopSidebarProps {
    currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {

    const routes = useRoutes(); // hook
    const [isOpen, setIsOpen] = useState(false);

    console.log(currentUser);

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className='hidden lg:fixed lg:inset-y-0  lg:left-0  lg:z-40
        lg:w-20  lg:overflow-y-auto xl:px-6  lg:bg-white  lg:border-r-[1px]
        lg:pb-4 lg:flex lg:flex-col justify-between'>
                <nav className='mt-4 flex flex-col justify-between'>
                    <ul className='flex flex-col items-center  space-y-1'
                        role='list'>
                        {routes.map((item) => (
                            <DesktopItem
                                key={item.label}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                active={item.active}
                                onClick={item.onClick}
                            />
                        ))}
                    </ul>
                </nav>
                <nav className='mt-4 flex flex-col justify-between items-center'>
                    <div onClick={() => setIsOpen(true)}
                        className='cursor-pointer hover:opacity-75 transition'>
                        {/* ส่งค่า currentUser ไปใช้งาน */}
                        <Avatar user={currentUser} />
                    </div>
                </nav>
            </div>
        </>
    )
}

export default DesktopSidebar