import { getServerSession } from "next-auth"; // รับ session ผู้ใช้ฝั่ง server
import { authOptions } from '../api/auth/[...nextauth]/route'; //ค่าต่างๆ auth get,post

// รับค่า session ผู้ใช้ 
export default async function getSession() {
    return await getServerSession(authOptions);
}

