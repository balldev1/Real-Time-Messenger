import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

//  {ตั้งค่าที่บอกว่าต้องใช้ TLS (Transport Layer Security) 
//     ในการเชื่อมต่อกับบริการ Pusher API หรือไม่ โดยการตั้งค่านี้เป็น true จะบังคับให้ใช้ TLS (HTTPS)
//      เพื่อรักษาความปลอดภัยในการสื่อสารระหว่างแอปพลิเคชันของคุณและ Pusher API.}
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'eu',
    useTLS: true
})


export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
        channelAuthorization: {
            endpoint: '/api/pusher/auth', //เส้นทางตรวจสอบสิทธิ์
            transport: 'ajax', // คือเทคนิคการโหลดข้อมูลแบบไม่ระบุตน  Asynchronous JavaScript and XML
        },
        cluster: 'eu'
    }
)