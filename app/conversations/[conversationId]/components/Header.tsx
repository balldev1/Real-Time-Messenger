'use client'
import React, { useMemo, useState } from 'react'
import { Conversation, User } from '@prisma/client';
import useOtherUser from '@/app/้hooks/useOtherUser';
import Link from 'next/link';
import { HiChevronLeft } from 'react-icons/hi';
import Avatar from '@/app/components/Avatar';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '@/app/components/AvatarGroup';
import useActiveList from '@/app/้hooks/useActiveList';

//ต้องมี type Conversation และมี type User
interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {

    // hook ข้อมูลอื่นมาใช้ โดยไม่เอา user ปัจจุบัน conversation params.id
    const otherUser = useOtherUser(conversation);
    // model เปิดปิด
    const [drawerOpen, setDrawerOpen] = useState(false);

    //Active
    //  array member มาใช้
    const { members } = useActiveList();
    // !== -1 ตรวจว่า ไม่ใช่ค่า -1 แปลว่าพบค่าอยู่ใน members
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    // ถ้าสนทนาเป็นกลุ่ม คืนจำนวน users ในกลุ่มนั้น เช่น3คนคืนค่า user 3 members
    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }

        return isActive ? 'Active' : 'Offline'; // active
    }, [conversation]);

    return (
        <>
            {/* drawerOpen true false */}
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div className='bg-white  w-full flex border-b-[1px] sm:px-4 py-3 px-4
        lg:px-6 justify-between items-center shadow-sm '>
                <div className='flex gap-3 items-center'>
                    <Link href='/conversations'
                        className='lg:hidden block text-sky-500 hover:text-sky-600
                    transition cursor-pointer'>
                        <HiChevronLeft size={32} />
                    </Link>
                    {conversation.isGroup ?
                        (<AvatarGroup users={conversation.users} />)
                        : (<Avatar user={otherUser} />)}
                    <div className='flex flex-col'>
                        <div>
                            {conversation.name || otherUser.name}
                        </div>
                        <div className='text-sm font-light text-neutral-500'>
                            {statusText}
                        </div>
                    </div>
                </div>
                {/* {set true} */}
                <HiEllipsisHorizontal onClick={() => setDrawerOpen(true)}
                    className='text-sky-500 cursor-pointer
                     hover:text-sky-600 transition'
                    size={32} />
            </div>
        </>
    )
}

export default Header