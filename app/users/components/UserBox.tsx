'use client'

import { useState, useCallback } from 'react';
import { User } from "@prisma/client"
import { useRouter } from "next/navigation";
import axios from 'axios';
import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/LoadingModal';

interface UserBoxProps {
    data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // useCallback ส่งข้อมูลไปแล้วรับข้อมูลกลับมา
    const handleClick = useCallback(() => {
        setIsLoading(true);

        //ส่งข้อมูลไปที่ api  เมือกมีการคลิก userId ก็คือค่า data.id ก็คือ id ของ user
        axios.post('/api/conversations', {
            userId: data.id // data.id คือค่าที่ได้จาก getuser => props เข้ามาใช้ในcomponenes
        })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`) //เปลี่ยนเส้นทางตามdata.idที่ได้รับ 
            })
            .finally(() => setIsLoading(false)); // set false คือทำเสร็จแล้ว
    }, [data, router]); //เก็บค่าไว้จนกว่าจะมีการเปลี่ยนแปลงอีกครั้ง

    return (
        <>
            {isLoading && (
                <LoadingModal />
            )}
            <div onClick={handleClick}
                className='w-full relative flex items-center  space-x-3 bg-white
            p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer'
            >
                <Avatar user={data} />
                <div className='min-w-0 flex-1'>
                    <div className='focus:outline-none'>
                        <div className='flex  justify-between items-center mb-1'>
                            <p className='text-sm font-medium text-gray-900'>
                                {data.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserBox