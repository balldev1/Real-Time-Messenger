import Avatar from '@/app/components/Avatar';
import useOtherUser from '@/app/้hooks/useOtherUser';
import { Transition, Dialog } from '@headlessui/react';
import { Conversation, User } from '@prisma/client';
import { format } from 'date-fns';
import React, { Fragment, useMemo, useState } from 'react'
import { IoClose, IoTrash } from 'react-icons/io5'
import ConfirmModal from './ConfirmModal';
import AvatarGroup from '@/app/components/AvatarGroup';
import useActiveList from '@/app/้hooks/useActiveList';

interface ProfileDrawerProps {
    isOpen?: boolean;
    onClose: () => void;
    data: Conversation & {
        users: User[]
    }
}

//
//data คือข้อมูลาก ฐานข้อมูล conversation 
const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, data }) => {

    const otherUser = useOtherUser(data);
    const [confirmOpen, setConfirmOpen] = useState(false);

    //Active
    //  array member มาใช้
    const { members } = useActiveList();
    // !== -1 ตรวจว่า ไม่ใช่ค่า -1 แปลว่าพบค่าอยู่ใน members
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    // รูปแบบเวลา ของ otherUser
    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser.createdAt]);

    // convesation params.id (data) | !== user
    const title = useMemo(() => {
        return data.name || otherUser.name
    }, [data.name, otherUser.name]);

    // คืนค่า user[] ทั้งหมดที่อยู่ใน conversation
    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users.length} members`;
        }

        return isActive ? 'Active' : 'Offline';
    }, [data, isActive]);

    return (
        // {ui @headlessui/react}
        <>
            {/* เมือ isModalOpen true modal นี้จะแสดง  */}
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            />
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as='div' className='relative z-50 ' onClose={onClose}>
                    {/* {opacity หน้าจอ} */}
                    <Transition.Child as={Fragment}
                        enter='ease-out duration-500'
                        enterFrom='opacity-0'
                        enterTo='opacity-100' //แสดง
                        leave='ease-in duration-500'
                        leaveFrom='opacity-100' //แสดง
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black bg-opacity-40' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-hidden'>
                        <div className='absolute inset-0 overflow-hidden'>
                            {/*  pointer-events-noneปิดการใช้งาน (disable)  */}
                            <div className='pointer-events-none  fixed inset-y-0 right-0
                        flex max-w-full pl-10'>
                                {/* {opacity หน้าจอ} */}
                                {/* EFFECT */}
                                <Transition.Child as={Fragment}
                                    enter='transform transition ease-in-out duration-500'
                                    enterFrom='translate-x-full'
                                    enterTo='translate-x-0' //แสดง
                                    leave='transform transition ease-in-out duration-500'
                                    leaveTo='translate-x-full'>
                                    {/* {Dialog.Panel แสดงข้อมูล} */}
                                    {/* {แถบ scroll ข้าง} */}
                                    {/* pointer-events-auto  แยกจากค่า default ที่อาจจะถูก disable ไว้} */}
                                    <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>

                                        {/* {scroll w-screen max-w-md} */}
                                        <div className='flex h-full flex-col overflow-y-scroll bg-white
                                    py-6 shadow-xl'>
                                            <div className='px-4 sm:px-6'>
                                                <div className='flex items-start justify-end'>
                                                    <div className='ml-3 flex h-7 items-center'>
                                                        <button onClick={onClose}
                                                            type='button'
                                                            className='rounded-md bg-white text-gray-400
                                                        hover:text-gray-500 focus:outline-none
                                                        focus:ring-2 focus:ring-sky-500
                                                        focus:ring-offset-2'>
                                                            {/* {sr-only เข้าถึงอุปกรณ์ช่วยอ่าน} */}
                                                            <span className='sr-only'>Close panel</span>
                                                            <IoClose size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative flex-1 mt-6 px-4 sm:px-6'>
                                                <div className='flex flex-col items-center'>
                                                    <div className='mb-2'>
                                                        {data.isGroup ?
                                                            (<AvatarGroup users={data.users} />)
                                                            : (<Avatar user={otherUser} />)}
                                                    </div>
                                                    <div>
                                                        {title}
                                                    </div>
                                                    <div className='text-sm text-gray-500 '>
                                                        {statusText}
                                                    </div>
                                                    <div className='flex gap-10 my-8  '>
                                                        {/* {เมือคลิก ถังขยะเป็น true Modal จะแสดง} */}
                                                        <div onClick={() => setConfirmOpen(true)}
                                                            className='flex flex-col gap-3 items-center 
                                                        cursor-pointer hover:opacity-75'>
                                                            <div className='w-10 h-10 bg-neutral-100 rounded-full
                                                        flex items-center justify-center'>
                                                                <IoTrash size={24} />
                                                            </div>
                                                            <div className='text-sm font-light text-neutral-600'>
                                                                Delete
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='w-full pb-5 pt-5  sm:px-0 sm:pt-0'>
                                                        <dl className='space-y-8 px-4  sm:space-y-6 sm:px-6'>
                                                            {data.isGroup && (
                                                                <div>
                                                                    <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                                                                        Emails
                                                                    </dt>
                                                                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                                                        {data.users.map((user) => user.email).join(', ')}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {/* {isGroup เก็บค่า true false ไม่ใช่ true / false แสดง} */}
                                                            {!data.isGroup && (
                                                                <div>
                                                                    <dt className='text-sm font-medium text-gray-500
                                                                 sm:w-40 sm:flex-shrink-0'>
                                                                        Email
                                                                    </dt>
                                                                    {/* {col-span-2 ครอบคลุมพื้นที 2 คอลัมแนวนอน} */}
                                                                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                                                        {otherUser.email}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {!data.isGroup && (
                                                                <>
                                                                    <hr />
                                                                    <div>
                                                                        <dt className='text-sm font-medium text-gray-500
                                                                    sm:w-400 sm:flex-shrink-0'>
                                                                            Joined
                                                                        </dt>
                                                                        <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                                                            <time dateTime={joinedDate}>
                                                                                {joinedDate}
                                                                            </time>
                                                                        </dd>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >
        </>
    )
}

export default ProfileDrawer