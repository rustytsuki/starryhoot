// #v-ifdef PROD
import version from '../../../../deploy/version/version.json';
// #v-endif

export function About() {
    return (
        <>
            <h1>About</h1>
            <p>StarryHoot🦉(夜貓) Office</p>
            <p>{
                // #v-ifdef VITE_STARRYHOOT_WEB
                'Web'
                // #v-elif VITE_STARRYHOOT_ELECTRON
                'Electron'
                // #v-endif
            }</p>
            <p>
                {
                // #v-ifdef PROD
                `Ver: ${version.ver_major}.${version.ver_minor}.${version.ver_patch}`
                // #v-endif
                }
            </p>
        </>
    );
}
