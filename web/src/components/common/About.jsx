// #v-ifdef VITE_STARRYHOOT_PUBLISH
import version from '../../../../deploy/version/version.json';
// #v-endif

import { Button } from "../../shadcn/components/ui/button.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../../shadcn/components/ui/alert-dialog.tsx"
import { Label } from "../../shadcn/components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../shadcn/components/ui/radio-group"

export function About() {
    return (
        <>
            <h1>About</h1>
            <p>StarryHoot🦉(夜貓) Office</p>
            <p>{
                // #v-ifdef VITE_STARRYHOOT_WEB
                'Web'
                // #v-elif VITE_STARRYHOOT_WWW
                'Site'
                // #v-elif VITE_STARRYHOOT_ELECTRON
                'Electron'
                // #v-endif
            }</p>
            <p>
                {
                // #v-ifdef VITE_STARRYHOOT_PUBLISH
                `Ver: ${version.ver_major}.${version.ver_minor}.${version.ver_patch}`
                // #v-endif
                }
            </p>
            <Button>Shadcn</Button>
            <br></br>
            <AlertDialog>
                <AlertDialogTrigger>Open</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                </div>
            </RadioGroup>
        </>
    );
}
