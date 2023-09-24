import getConversations from "../actions/getConversation";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function Conversation({ children }: { children: React.ReactNode }) {
    // รอให้ Promise สำเร็จ
    const conversations = await getConversations();
    // รับผู้ใช้อื่นที่ไม่ใช่ผู้ใช้ปัจจุบัน
    const users = await getUsers();

    return (
        <Sidebar>
            <ConversationList
                users={users}
                initialItems={conversations}
            />
            <div className="h-full">
                {children}
            </div>
        </Sidebar>
    )
}
