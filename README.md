This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

\*\*\* Next.js 13, React, Tailwind, Prisma, MongoDB, NextAuth, Pusher

npm install

- react-icons
  -react-hook-form
- clsx
  npm i @tailwindcss/forms

\*\*\* back end
npm install -D prisma
npx prisma init
/เมือ กำหนด model เสร็จ
npx prisma db push

\*\*\* NextAuth
npm install next-auth@latest @prisma/client @next-auth/prisma-adapter bcrypt
npm install -D @types/bcrypt
-next-auth@latest จัดการระบบการตรวจสอบและการเข้าสู่ระบบใ
-@prisma/clien เข้าถึงฐานข้อมูล app/libs/prismadb.ts
-@next-auth/prisma-adapter ใช้ในการเชื่อมต่อกับ Prisma Client
-bcrypt เข้ารหัส

\*\*\* api
npm install axios

\*\*\*alert
npm install react-hot-toast

npm install next-superjson-plugin แปลงข้อมูล javascript เป็น json

npm install date-fns วันที่และเวลา

npm install next-cloudinary เก็บภาพไว้ที clound
CldUploadButton ปุ่มฝากรูป

npm install @headlessui/react ui frontend

npm install react-select ฟังชั่น select

npm install react-spinners => loading

pusher api รับส่งข้อมูลแบบ real-time Node.js
npm install pusher pusher-js

npm install loadsh จัดการข้อมูล
npm install -D @types/lodash

npm install zustand จัดการสถานะ state โดยไม่ใช้ context redux
