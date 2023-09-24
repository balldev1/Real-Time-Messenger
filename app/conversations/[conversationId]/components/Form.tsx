'use client';

import useConversation from "@/app/้hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {

    // params.id / isOpen 
    const { conversationId } = useConversation();

    //รูปแบบ form
    const { register, handleSubmit, setValue,
        formState: {
            errors,
        } } = useForm<FieldValues>({
            defaultValues: {
                message: '' // onSubmit validate
            }
        });

    //่ส่งข้อมูลform data / conversationId params.id
    // setValue คือ กำหนดค่าให้กับฟิลด์ในฟอร์ม message ค่าว่าง validate ข้อมูล ในฟิล message
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true })
        axios.post('/api/messages', {
            ...data,
            conversationId
        })
    }

    // upload image 
    //ส่งข้อมูลไปยัง API โดย image เป็น URL ของรูปภาพที่อัปโหลดผ่าน Cloudinary
    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
    }

    return (
        <div className="py-4 px-4 bg-white border-t flex items-center 
        gap-2 lg:gap-4 w-full">
            {/* cloud image */}
            <CldUploadButton options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset='n2sb3ooy'>
                <HiPhoto size={30} className='text-sky-500' />
            </CldUploadButton>
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full">
                <MessageInput
                    id='message'
                    register={register}
                    errors={errors}
                    required
                    placeholder='Write a message' />
                <button type='submit'
                    className="rounded-full p-2 bg-sky-500 cursor-pointer
                    hover:bg-sky-600 transition">
                    <HiPaperAirplane size={18}
                        className='text-white' />
                </button>
            </form>
        </div>
    )
}

export default Form