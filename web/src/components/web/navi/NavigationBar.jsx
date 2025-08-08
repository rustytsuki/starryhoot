import { useState, useEffect } from 'react';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../shadcn/components/ui/dropdown-menu.tsx';
import { ChevronDown } from "lucide-react";
import { Logo } from './Logo';
import { NavMenu } from './NaviMenu';
import { NavigationSheet } from './NavigationSheet';
import { ROUTE } from '../ROUTE.js';
import { goto, redirect, get_current_route } from '../../common/utils/route_util';

export const NavigationBar = (props) => {
    const [loaded, setLoaded] = useState(false);
    const [user, setUserName] = useState(null);

    useEffect(() => {
        if (window.session && window.session.user) {
            setUserName({
                id: window.session.user.id,
                name: window.session.user.name,
            });
        }

        setLoaded(true);

        return () => {
            setUserName(null);
        };
    }, []);

    let onSignout = async () => {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const content = await response.json();
        if (content['success']) {
            redirect(ROUTE.HOME);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-muted">
            <nav className="h-16 bg-background border-b shrink-0">
                <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Logo />

                    {/* Desktop Menu */}
                    <NavMenu loaded={loaded} user={user} className="hidden md:block" />

                    <div className="flex items-center gap-3">
                        {loaded && !user && (
                            <>
                                <Button
                                    variant="outline"
                                    className="sm:inline-flex"
                                    onClick={() => {
                                        goto(ROUTE.SIGN_IN);
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => {
                                        goto(ROUTE.SIGN_UP);
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                        {loaded && user && (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">{user.name} <ChevronDown className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={onSignout}>Sign out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <NavigationSheet />
                        </div>
                    </div>
                </div>
            </nav>
            <div className="relative flex-1 overflow-auto">{props.children}</div>
        </div>
    );
};
