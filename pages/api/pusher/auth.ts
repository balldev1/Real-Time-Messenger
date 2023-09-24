import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth";

import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ตรวจสอบสิทธิ์
// รับ request ที่เกี่ยวข้องกับการเชื่อมต่อ Pusher WebSocket, 
// ดึงข้อมูล session ของผู้ใช้, สร้าง authorization สำหรับการเชื่อมต่อกับ Pusher, และส่งคำตอบกลับ
export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const session = await getServerSession(request, response, authOptions);

    if (!session?.user?.email) {
        return response.status(401);
    }

    const socketId = request.body.socket_id;
    const channel = request.body.channel_name;
    const data = {
        user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return response.send(authResponse);
}