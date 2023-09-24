
'use client'

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { MdOutlineGroupAdd } from 'react-icons/md';

import useConversation from "@/app/้hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find, update } from "lodash";



interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users }) => {
    //ดึงข้อมูล session
    const session = useSession();
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const { conversationId, isOpen } = useConversation(); // params 

    // เก็บค่า session.email
    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    // ถ้า pusherKey มีค่า ให้ subscibe pusher client
    // การ subscribe  ช่วยให้ event ในเวลาเป็น real-time 
    // เช่น แชท, การแจ้งเตือน, และการทำงาน real-time
    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        // เชื่อม session.email
        pusherClient.subscribe(pusherKey);

        // ค้นหาข้อมูลใน array 
        // ถ้า id ตรงกับปัจจุบัน ไม่ต้องทำอะไร คืนค่า
        // ถ้า id ไม่ตรงให้เอา id ไปใช้ อยู่หน้า idปัจจุบัน คืนอัพเดท id ล่าสุด
        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }

                return [conversation, ...current];
            });
        }

        // อัพเดทข้อความ 
        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    }
                }

                return currentConversation;
            }));
        }

        //ลบข้อมูล รับ id ที่ส่งเข้า มาแล้วกรองออก โดย เอาข้อมูลที่ !== id ที่รับเข้ามา
        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((convo) => convo.id !== conversation.id)]
            });

            // ถ้าข้อความ params.id === ข้อมูลที่เรารับเข้า id 
            // คือลบข้อมูล แล้วส่งไปหน้า conversation ถ้า params.id === id ที่รับเข้ามา
            if (conversationId === conversation.id) {
                router.push('/conversations')
            }
        }

        //real time
        pusherClient.bind('conversation:new', newHandler);
        pusherClient.bind('conversation:update', updateHandler);
        pusherClient.bind('conversation:remove', removeHandler);

        // ยกเลิกการเชื่อม pusherClient
        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newHandler);
            pusherClient.unbind('conversation:update', updateHandler);
            pusherClient.unbind('conversation:remove', removeHandler);
        }

    }, [pusherKey, conversationId, router]);

    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className={clsx(`fixed inset-y-0 pb-20  lg:pb-0 lg:left-20
        lg:w-80 lg:block overflow-y-auto border-r border-gray-200`
                , isOpen ? 'hidden' : 'block w-full left-0')}>
                <div className='px-5'>
                    <div className="flex justify-between mb-4  pt-4">
                        <div className="text-wxl font-bold text-neutral-800">
                            Messages
                        </div>
                        <div onClick={() => setIsModalOpen(true)}
                            className="rounded-full p-2 bg-gray-100 text-gray-600 
                    cursor-pointer hover:opacity-75 transition">
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {/* selected ค่าจาก  id ที่ได้จาก params === getConversation.id ที่ได้จากการสนทนา  */}
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>

    )
}

export default ConversationList