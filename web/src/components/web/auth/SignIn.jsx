import { useState, createRef } from 'react';
import { Button } from "../../../shadcn/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../shadcn/components/ui/form.tsx";
import { Input } from "../../../shadcn/components/ui/input.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTE } from '../ROUTE.js';
import { redirect, get_full_path } from '../../common/utils/route_util.js';

export function SignIn() {
    const form =
        useForm <
        z.infer <
        typeof formSchema >>
            {
                defaultValues: {
                    email: '',
                    password: '',
                },
                resolver: zodResolver(formSchema),
            };
    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-xs w-full flex flex-col items-center">
                <p className="mt-4 text-xl font-bold tracking-tight">Sign in to StarryHoot🦉</p>
                <Form {...form}>
                    <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" className="w-full" {...field} />
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
                                        <Input type="password" placeholder="Password" className="w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4 w-full">
                            Sign in
                        </Button>
                    </form>
                </Form>
                <div className="mt-5 space-y-5">
                    <p className="text-sm text-center">
                        New to StarryHoot🦉?
                        <Link href="#" className="ml-1 underline text-muted-foreground">
                            Create an account.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
