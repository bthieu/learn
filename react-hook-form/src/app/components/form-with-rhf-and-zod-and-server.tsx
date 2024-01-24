'use client';

import { TSignUpSchema, signUpSchema } from '../lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function FormWithReactHookFormAndZodAndServer() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema),
    });
    
    const onSubmit = async (data: TSignUpSchema) => {
        const response = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify(data),
            // // uncomment following lines to test server error
            // body: JSON.stringify({
            //     email: data.email,
            //     password: data.password,
            //     confirmPassword: '234524523452345'
            // }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseData = await response.json();
        if (!response.ok) {
            // response statusis not 2xx
            alert('Submitting form failed!');
            return;
        }
        if (responseData.errors) {
            const errors = responseData.errors;
            if (errors.email) {
                setError('email', {
                    type: 'server',
                    message: errors.email,
                });
            } else if (errors.password) {
                setError('password', {
                    type: 'server',
                    message: errors.password,
                })
            } else if (errors.confirmPassword) {
                setError('confirmPassword', {
                    type: 'server',
                    message: errors.confirmPassword,
                })
            } else {
                alert('something went wrong!');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gay-y-2">
            <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded"
            />
            {errors.email && (
                <p className="text-red-500">{`${errors.email?.message}`}</p>
            )}

            <input 
                {...register('password')}
                type="password"
                placeholder="Password"
                className="px-4 py-2 rounded" 
            />
            {errors.password && (
                <p className="text-red-500">{`${errors.password.message}`}</p>
            )}

            <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm password"
                className="px-4 py-2 rounded"
            />
            {errors.confirmPassword && (
                <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
            )}

            <button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-500 disabled:bg-gray-500 py-2 rounded" 
            >
                Submit
            </button>
        </form>
    );
}