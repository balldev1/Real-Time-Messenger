'use client'

import { useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { Conversation, Message, User } from "@prisma/client";
import { format } from 'date-fns'; // รูปแบบ วันเวลา
import { useSession } from "next-auth/react";
import clsx from 'clsx';
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/้hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {

    //hook ส่งdata เอาข้อมูล data ที่ไม่ใช่ ผู้ใช้ปัจจุบันส่งกลับมา
    const otherUser = useOtherUser(data);

    const session = useSession();
    const router = useRouter();

    //ส่งไป data.id
    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router]);

    // เอาข้อมูลข้อความล่าสุดใน ฐานข้อมูลMessages
    //useMemo เก็บค่า messages messages.length - 1 คือเข้าถึงข้อความล่าสุด
    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1]
    }, [data.messages]);


    // email user ปัจจุบัน
    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    // ข้อความล่าสุดของผู้ใช้ที่ email ตรงกับปัจจุบัน
    const hasSeen = useMemo(() => {
        // ถ้าไม่มีข้อความล่าสุด (lastMessage) ส่งค่า false
        if (!lastMessage) {
            return false;
        }

        // lastMessage []
        const seenArray = lastMessage.seen || [];

        // ! user ปัจจุบัน false
        if (!userEmail) {
            return false;
        }

        // ข้อความล่าสุดของผู้ใช้ที่ email ตรงกับปัจจุบัน
        // lastMessage email ตรงกับ usermailปัจจุบัน // user ไม่เท่ากับ 0
        return seenArray
            .filter((user) => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage]);

    // return image / body ถ้าไม่มี ค่าให้ return Started
    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }

        if (lastMessage?.body) {
            return lastMessage.body;
        }

        return 'Started a conversation'
    }, [lastMessage]);

    return (
        <div onClick={handleClick}
            className={clsx(`w-full relative flex  items-center space-x-3 p-3
            hover:bg-neutral-100 rounded-lg  transition cursor-pointer `
                , selected ? 'bg-neutral-100' : 'bg-white')} >
            {/* {Avatar box} */}
            {data.isGroup ?
                (<AvatarGroup users={data.users} />)
                : (<Avatar user={otherUser} />)}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {data.name || otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx(`truncate text-sm`
                        , hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div >
    )
}

export default ConversationBox