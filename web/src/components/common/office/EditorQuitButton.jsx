import { Button } from "../../../shadcn/components/ui/button";
import { goto } from '../utils/route_util';
import { ArrowLeft } from "lucide-react";

export function EditorQuitButton({onGoBackClick}) {
    return (
        <Button
            variant="outline"
            onClick={() => {
                // #v-ifdef VITE_STARRYHOOT_WEB
                goto('/drive');
                // #v-elif VITE_STARRYHOOT_WWW
                onGoBackClick();
                // #v-elif VITE_STARRYHOOT_ELECTRON
                starryhoot.goto_home_tab();
                // #v-endif
            }}
        >
            {
                // #v-ifdef VITE_STARRYHOOT_WEB
                'My Files'
                // #v-elif VITE_STARRYHOOT_WWW
                <span className="inline-flex items-center gap-1">
                    <ArrowLeft className="inline-block" />
                    Go Back
                </span>
                // #v-elif VITE_STARRYHOOT_ELECTRON
                "Home"
                // #v-endif
            }
        </Button>
    );
}
