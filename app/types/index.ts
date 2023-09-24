import { Conversation, Message, User } from "@prisma/client";

// ข้อมูล Message
// type User
export type FullMessageType = Message & {
    sender: User,
    seen: User[]
};

// ข้อมูล Conversation
// type User / FullMessageType 
// ข้อมูล conversataion ที่มีข้ลมูล User  , message เป็น array []
// เอาข้อมูล user 
// เอาsender , seen ของ message เท่านั้น
export type FullConversationType = Conversation & {
    users: User[];
    messages: FullMessageType[]
};