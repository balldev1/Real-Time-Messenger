'use client';

import useActiveChannel from "../้hooks/useActiveChannel";

// layout
//ActiveStatus เป็น Functional Component ที่ใช้ useActiveChannel hook
// เพื่อเรียกใช้งานและทำการ subscribe ไปยัง channel ที่เกี่ยวข้องกับ active status.
const ActiveStatus = () => {
    useActiveChannel();

    return null;
}

export default ActiveStatus