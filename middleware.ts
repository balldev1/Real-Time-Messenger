import { withAuth } from "next-auth/middleware";

//ถ้าไม่มี session ให้ไปที่หน้า / 
export default withAuth({
    pages: {
        signIn: "/"
    }
});

// ถ้ามี session ให้ไปหน้า user path อะไรก็ได้ 
export const config = {
    matcher: [
        "/users/:path*",
        "/conversations/:path*"
    ]
};