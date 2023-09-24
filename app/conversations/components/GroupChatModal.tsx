'use client'
import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupChatModalProp {
    isOpen?: boolean,
    onClose: () => void;
    users: User[]; //ข้อมูลที่ไม่ใช่ผู้ใช้ปัจจุบัน
}

const GroupChatModal: React.FC<GroupChatModalProp> = ({ isOpen, onClose, users }) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // form ข้อมูลที่รับเข้ามา
    const { register, handleSubmit, setValue, watch,
        formState: { errors } } = useForm<FieldValues>({
            defaultValues: {
                name: '',
                members: []
            }
        });

    //watch ติดตาม form member
    const members = watch('members');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/conversations', {
            ...data,
            isGroup: true
        })
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error('Something went wrong'))
            .finally(() => setIsLoading(false))
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create a group chat
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Create a chat more than 2 people.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                register={register}
                                label="Name"
                                id='name'
                                disabled={isLoading}
                                required
                                errors={errors}
                            />
                            <Select
                                disabled={isLoading}
                                label='Members'
                                // ค่าจากuusers มาทำdropdown 
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name
                                }))}
                                // เกิดเหตุการณ์กับ value :user.id ให้ => setValue => member
                                onChange={(value) => setValue('members', value, {
                                    shouldValidate: true // ตรวจสอบความถูกต้อง form ว่าตรงกับที่กำหนดไหม
                                })}
                                value={members}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        type='button'
                        secondary
                    >
                        Cencel
                    </Button>
                    <Button
                        disabled={isLoading}
                        type='submit'
                    >
                        Create
                    </Button>
                </div>
            </form>
        </Modal >
    )
}

export default GroupChatModal