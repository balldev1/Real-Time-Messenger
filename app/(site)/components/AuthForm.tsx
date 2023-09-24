'use client'
import axios from 'axios';
import Button from '../../components/Button';
import Input from '../../components/inputs/Input';
import React, { useState, useCallback, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub } from 'react-icons/bs'
import { BsGoogle } from 'react-icons/bs'
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

//กำหนด type ที่มี Login กับ Register เท่านั้น
type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    // false คือ ยังไม่ถูกส่งข้อมูล / ture ปุ่มกำลังประมวลผลอยู่
    const [isLoading, setIsLoading] = useState(false);

    // if มี session ให้ไปหน้า /user
    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users');
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant("REGISTER")
        } else {
            setVariant('LOGIN')
        }
    }, [variant])

    // react-hook-form form
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    //api เมือsubmit จะเก็บค่าไว้ที่ data , register , login
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        // Axios Register
        if (variant === 'REGISTER') {
            axios.post('/api/register', data)
                .then(() => signIn('credentials', data))
                .catch(() => toast.error('Something went wrong!'))
                .finally(() => setIsLoading(false));
        }

        // NextAuth SignIn
        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('Invalid credentials');
                    }

                    if (callback?.ok && !callback?.error) {
                        router.push('/conversations')
                    }
                })
                .finally(() => setIsLoading(false));
        }
    }

    // login github , google
    const socialAction = (action: string) => {
        setIsLoading(true);

        // NextAuth Social SignIn
        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials');
                }

                if (callback?.ok && !callback?.error) {
                    router.push('/conversations')
                }
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form action='' className='space-y-6' onSubmit={handleSubmit(onSubmit)}  >
                    {variant === 'REGISTER' && (
                        <Input id='name' label='Name' register={register}
                            errors={errors} disabled={isLoading} />
                    )}
                    <Input id='email' label='Email address' type='email' register={register}
                        errors={errors} disabled={isLoading} />
                    <Input id='password' label='Password' type='password' register={register}
                        errors={errors} disabled={isLoading} />
                    <div>
                        {/* isLoading เป็น true, ปุ่มจะถูกปิดใช้งาน (disabled)
                     และไม่สามารถคลิกได้ในระหว่างที่ข้อมูลกำลังโหลดหรือประมวลผลอยู่  */}
                        <Button disabled={isLoading} type='submit' fullWidth >
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>

                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300' />
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className='mt-6 flex  gap-2'>
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
                <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
                    <div>
                        {variant === 'LOGIN' ? 'New to Message' : 'Already have an account?'}
                    </div>
                    <div onClick={toggleVariant}
                        className='underline cursor-pointer'>
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm