import { Button } from '../../../shadcn/components/ui/button.tsx';
import { Logo } from './Logo';
import { NavMenu } from './NaviMenu';
import { NavigationSheet } from './NavigationSheet';

export const NavigationBar = (props) => {
    return (
        <div className="h-screen flex flex-col bg-muted">
            <nav className="h-16 bg-background border-b shrink-0">
                <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Logo />

                    {/* Desktop Menu */}
                    <NavMenu className="hidden md:block" />

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="hidden sm:inline-flex">
                            Sign In
                        </Button>
                        <Button>Get Started</Button>

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <NavigationSheet />
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex-1 overflow-auto">{props.children}</div>
        </div>
    );
};

