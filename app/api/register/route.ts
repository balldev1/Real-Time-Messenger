import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // รับ req ค่าจาก from
        const body = await request.json();
        const { email, name, password } = body;

        // ถ้า form ไม่มีค่าใดค่าหนึ่งให้ error
        if (!email || !name || !password) {
            return new NextResponse('Missing info', { status: 400 });
        }

        // เข้ารหัส แปลงรหัสที่รับมาจาก form
        const hashedPassword = await bcrypt.hash(password, 12);

        //สร้างข้อมูล user 
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return NextResponse.json(user);
        //error เป็น any คือ เก็บ error =นิดข้อมูลอะไรก็ได้
    } catch (error: any) {
        console.log(error, 'REGISTRATION_ERROR');
        return new NextResponse('Internal Error', { status: 500 });
    }
}