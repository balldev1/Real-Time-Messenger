import { Channel, Members } from "pusher-js"; // ใช้เชื่อมกับ pusher realtime
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { each } from "lodash";

// set add remove member.id
const useActiveChannel = () => {

    //รับfunction store zustand
    const { set, add, remove } = useActiveList();
    // state เก็บค่า
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

    // effect หลัง จาก component render
    useEffect(() => {
        // ค่าเริ่มต้น state channel
        let channel = activeChannel;

        // !channel ใช่ช่องทางpusherClient =>presence-message
        // แล้ว setState เป็น channel 
        if (!channel) {
            channel = pusherClient.subscribe('presence-messenger');
            setActiveChannel(channel);
        }

        // ผูก event ทีเกิดขึ้น กับ pusher:subscription_succeeded
        // member ที่รับเข้ามา
        // initialmember คือ สร้าง []string
        // each => loop ค่าใน member
        // เอาmember.id เอาค่าไปเก็บไว้ที่ => initalmember 
        // ได้ค่ามาแล้วก็ set updated ค่าใน inital
        channel.bind('pusher:subscription_succeeded', (members: Members) => {
            const initialMembers: string[] = [];

            members.each((member: Record<string, any>) => initialMembers.push(member.id));
            set(initialMembers)
        });

        // add
        channel.bind('pusher:member_added', (member: Record<string, any>) => {
            add(member.id);
        })

        // remove
        channel.bind('pusher:member_removed', (member: Record<string, any>) => {
            remove(member.id);
        })

        // จะ unsubscribe 
        // activeChannel เป็น null เมื่อ Component เกิดการเปลี่ยนแปลง
        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe('presence-messenger');
                setActiveChannel(null);
            }
        }
    }, [activeChannel, set, add, remove])
}

export default useActiveChannel;