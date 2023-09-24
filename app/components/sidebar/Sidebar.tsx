import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode; }) {

    // ผู้ใช้ปัจจุบัน
    const currentUser = await getCurrentUser();

    return (
        <div className="h-full ">
            {/* ส่งค่า currentUserไปใช้งาน */}
            <DesktopSidebar currentUser={currentUser!} />
            <MobileFooter />
            <main className="lg:pl-20  h-full ">
                {children}
            </main>
        </div>
    )
}

export default Sidebar;