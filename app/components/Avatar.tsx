'use client';

import React from 'react'
import { User } from '@prisma/client'
import Image from 'next/image';
import useActiveList from '../้hooks/useActiveList';

interface AvatarProps {
    user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {

    //  array member มาใช้
    const { members } = useActiveList();
    // online active  ค้นหา index user.email 
    // !== -1 ตรวจว่า ไม่ใช่ค่า -1 แปลว่าพบค่าอยู่ใน members
    const isActive = members.indexOf(user?.email!) !== -1;

    return (
        <div className='relative'>
            <div className='relative inline-block rounded-full overflow-hidden  h-9 w-9
            md:h-11 md:w-11'>
                <Image alt='Avatar' src={user?.image || '/images/placeholder.jpg'} fill />
            </div>
            {/* {online active } */}
            {isActive &&
                (
                    <span className='absolute block rounded-full bg-green-500 ring-2 ring-white
            top-0 right-0 h-2 w-2 md:h-3 md:w-3' />
                )}
        </div>
    )
}

export default Avatar