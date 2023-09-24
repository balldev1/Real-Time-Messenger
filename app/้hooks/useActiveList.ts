import { create } from 'zustand';

// type รูปแบบข้อมูลที่่จะรับเข้ามา
interface ActiveListStore {
    members: string[]; //เก็บสมาชิค
    add: (id: string) => void; // +
    remove: (id: string) => void; // -
    set: (ids: string[]) => void; //เพิ่มสามาชิค[]
}

// เพิ่มลบ แก้ไข ข้อมูล
// สร้าง store จัดเก็บ  useActiveList คือ store
// เป็น state ที่เก็บรายชื่อสมาชิกarray []
// add รับ id เพิ่มลงใน member []
// remove รับ id แล้วกรองเอาค่าที่ !id เพิ่มลงใน members
// รับ ids ที่มี id หลาย id เก็บไว้ที่ useActiveList
const useActiveList = create<ActiveListStore>((set) => ({
    members: [],
    add: (id) => set((state) => ({ members: [...state.members, id] })),
    remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
    set: (ids) => set({ members: ids })
}));

export default useActiveList;