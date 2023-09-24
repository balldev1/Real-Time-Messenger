'use client'

import { FullMessageType } from "@/app/types"
import useConversation from "@/app/้hooks/useConversation";
import { useRef, useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {

    // ข้อมูล message
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(initialMessages);

    //hook
    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    // message Real-time
    // pusherClient subscribe ให้ความสามารถฝั่ง service ในฝั่งของ client
    useEffect(() => {
        pusherClient.subscribe(conversationId); //เชื่อมต่อpusher ที่มี idตรงกับ conversationId
        bottomRef?.current?.scrollIntoView();

        //ถ้าข้อความที่เข้ามา (message) มี id ที่ไม่ซ้ำกับข้อความที่มีอยู่ใน messages (ใช้ lodash's find)
        //, จะทำการอัพเดท messages โดยเพิ่มข้อความใหม่ (message) เข้าไป.
        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) { //ถ้า id ซ้ำกับข้อความที่มีอยู่แล้วใน messages, จะไม่ทำการเพิ่มข้อความเข้าไป.
                    return current;
                }

                return [...current, message];
            })

            bottomRef?.current?.scrollIntoView();//ทำให้หน้าจอเลื่อนลงมาgเมือมีการเรียกใช้ api message
        }

        // ถ้า currentMessage.id เท่ากับ newMessage.id, 
        //แสดงว่าเราพบข้อความที่ต้องการอัปเดต จึง return newMessage เพื่ออัปเดตข้อความนี้.
        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage;
                }

                return currentMessage;
            }))
        };


        //ตั้งชือ event 'messages:new' ใช้เพื่อผูก event  กับฟังก์ชัน messageHandler
        // ทำให้ฟังก์ชัน messageHandler ถูกเรียกทุกครั้งที่มีการเกิด event 'messages:new'.
        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler);

        //ยกเลิกการ subscribe และการผูก event ที่เคยทำไว้ ทำให้ไม่มีการทำงานเพิ่มเติมเมื่อ component ไม่ถูกแสดงบนหน้าเว็บอีกต่อไป.
        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', messageHandler);
            pusherClient.unbind('message:update', updateMessageHandler);
        }

    }, [conversationId]); // เก็บค่าไว้แสดง จนกว่าจะมีการเปลี่ยนแปลงที่ messageHandler

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div className="pt-24" ref={bottomRef} />
        </div>
    );
}

export default Body