'use client'

import axios from 'axios';
import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types"
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import { useState } from 'react';
import ImageModal from './ImageModal';


interface MessagesBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const MessagesBox: React.FC<MessagesBoxProps> = ({ data, isLast }) => {

    // ผู้ใช้ปัจจุบัน
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    //ตรวจสอบว่าข้อความนี้เป็นของผู้ใช้ปัจจุบันหรือไม่ 
    const isOwn = session?.data?.user?.email === data?.sender?.email;

    // list user ที่เห็น 
    // กรองออกเฉพาะผู้ใช้ที่ไม่ใช่ผู้ส่งข้อความ
    // กรองเอาเฉพาะชื่อของผู้ใช้
    // รวมสมาชิกของ array ด้วย ,
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(', ');

    // ถ้า ข้อความนี้เป็น ข้อความของ ผู้ใช้ให้อยุ่ทางขวาสุด
    const container = clsx(
        'flex gap-3 p-4',
        isOwn && 'justify-end'
    );

    // order 2 คือแสดงหลัง จาก order 1 แสดง
    const avatar = clsx(isOwn && 'order-2');

    const body = clsx(
        'flex flex-col gap-2',
        isOwn && 'items-end'
    );

    const message = clsx(
        'text-sm w-fit overflow-hidden',
        isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
        data.image ? 'rounded-md p-0 ' : 'rounded-full py-2 px-3'
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {/* p คือรูปแบบเวลาใน format */}
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt='Image'
                            height='288'
                            width='288'
                            src={data.image}
                            className="object-cover cursor-pointer hover:scale-110
                            transition translate"
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {/* { true ข้อความล่าสุด , ผู้ใช้ปัจจุบัน , ข้อความมากกว่า 0} */}
                {isLast && isOwn && seenList.length > 0 && (
                    <div className='text-xs font-light text-gray-500'>
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessagesBox