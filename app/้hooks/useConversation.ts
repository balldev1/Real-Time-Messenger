import { useParams } from "next/navigation"; // เข้าถึง params /user/...params
import { useMemo } from 'react'; //บันทึกค่า

// params true false
const useConversation = () => {
    const params = useParams(); // ดึงค่า params user/...params

    // เก็บค่า params
    const conversationId = useMemo(() => {
        if (!params?.conversationId) {
            return '';
        } // ถ้าไม่มีค่า ให้ เป็นค่าว่าง

        return params.conversationId as string; // ถ้ามีค่าให้แปลงเป็น string
    }, [params?.conversationId]); // เก็บค่า params ที่ได้รับ

    // เอาค่า params มาใช้
    // !!สองครั้งคือทำให้ค่านั้นเป็น boolean !!conversationId,
    // conversationId ที่เป็นค่าว่างจะเป็น false
    // ถ้า conversationId มีค่าจะเป็น true
    // useMemo คำนวณบันทึกค่าใน isOpen
    // true สนทนาอยู่ false  ไม่มีการสนทนา
    const isOpen = useMemo(() => !!conversationId, [conversationId]);

    //คำนวณและคืนค่าออกมาเป็นออบเจ็กต์ทุกครั้งเมือมีการเปลี่ยนแปลง
    return useMemo(() => ({ isOpen, conversationId })
        , [isOpen, conversationId]);
}

export default useConversation;