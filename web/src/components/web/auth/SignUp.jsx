import { useState, createRef } from 'react';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../shadcn/components/ui/form.tsx';
import { Input } from '../../../shadcn/components/ui/input.tsx';
import { Label } from '../../../shadcn/components/ui/label.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROUTE } from '../ROUTE.js';
import { goto, redirect, get_full_path } from '../../common/utils/route_util.js';
import { MessageBox } from '../../common/utils/MessageBox.jsx';

const formSchema = z
    .object({
        username: z.string().min(3, 'Username must be at least 3 characters long'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        confirm_password: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

export function SignUp() {
    const [signup_success, set_signup_success] = useState(false);
    const messageBox = createRef();

    const form = useForm({
        defaultValues: {
            username: '',
            password: '',
            confirm_password: '',
        },
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        // post signup
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'name': data.username.trim(), 'password': data.password.trim() }),
        });

        const content = await response.json();
        if (content['success']) {
            messageBox.current.show('', 'Sign up successfully! now please sign in.', false);
        } else {
            messageBox.current.show('', 'Sign up error!', false);
        }
        set_signup_success(content['success']);
    };

    let onMsgConfirm = () => {
        if (signup_success) {
            goto(ROUTE.SIGN_IN);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-xs w-full flex flex-col items-center">
                <Label className="mb-8">
                    <p className="text-xl font-bold tracking-tight">Sign up to StarryHoot🦉</p>
                </Label>
                <Form {...form}>
                    <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Username</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Username" className="w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter Password"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Confirm Password</FormLabel> */}
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter Password again"
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Label>We'll never store and share your password with anyone else.</Label>
                        <Button type="submit" className="mt-4 w-full">
                            Sign up
                        </Button>
                    </form>
                </Form>
                <div className="mt-5 space-y-5">
                    <p className="text-sm text-center">
                        Already have an account?
                        <Button
                            variant="link"
                            onClick={() => {
                                goto(ROUTE.SIGN_IN);
                            }}
                        >
                            Sign in.
                        </Button>
                    </p>
                </div>
            </div>
            <MessageBox ref={messageBox} onConfirm={onMsgConfirm} />
        </div>
    );
}
