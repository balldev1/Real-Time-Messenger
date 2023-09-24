// api login ด้วยระบบต่างๆ ยืนยันตัวตน
import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth" //กำหนดค่าออฟชั่นเข้าสู่ระบบ
import CredentialsProvider from "next-auth/providers/credentials" //ตรวจสอบยืนยันตัวตน
import { PrismaAdapter } from "@next-auth/prisma-adapter" // เชื่อมฐานข้อมูล
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import prisma from "@/app/libs/prismadb" // ฐานข้อมูล

//clientId คือใครเข้าสู่ระบบ  ,clientSecret รหัสตรวจสอบการเข้าสู่ระบบ
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            }, //ตรวจสอบข้อมูลของผู้ใช้
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid Credentials');
                }

                //email prisma กับ credential.emailที่รับเข้ามาตรงกัน
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // ถ้า email ที่รับเข้ามาไม่ตรงกับ ฐานข้อมูล hashpassword แจ้ง error
                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                //เปรียบเทียบรหัสผ่านที่กรอกเข้ามากับ ฐานข้อมูล
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                // ถ้ารหัสผ่านไม่ตรงกัน ให้ error
                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt', //token session user
    },
    secret: process.env.NEXTAUTH_SECRET, //KEY JWT ENV
}

const handler = NextAuth(authOptions); //เก็บค่าที่ได้ไว้ handler 

export { handler as GET, handler as POST }; //ส่งออก handler get post ไปใช้ api