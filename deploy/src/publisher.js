import fs from 'fs-extra';
import path from 'path';
import * as utils from './utils.js';
import { Octokit } from 'octokit';

const GH_TOKEN = process.env.GH_TOKEN;
if (typeof GH_TOKEN !== 'string' || GH_TOKEN.trim() === '') {
    console.error('❌ GH_TOKEN is not set or is empty.');
} else {
    console.log(`✅ GH_TOKEN length: ${GH_TOKEN.trim().length}`);
}

const OWNER = 'rustytsuki';
const REPO = 'starryhoot';

const octokit = new Octokit({
    auth: GH_TOKEN,
    baseUrl: 'https://api.github.com',
});

const octokit_upload = new Octokit({
    auth: GH_TOKEN,
    baseUrl: 'https://uploads.github.com',
});

export async function upload_assets(target, pkg) {
    const tag_ver = utils.get_tag_version();
    
    let release_id = await get_release(tag_ver);
    if (!release_id) {
        release_id = await create_release(tag_ver);
    }

    if (!release_id) {
        return 1;
    }

    let assets = await list_release_assets(release_id);

    if (!Array.isArray(assets)) {
        return 1;
    }

    const packed_files = await utils.get_packed_files(target, pkg);
    for (let i = 0; i < packed_files.length; ++i) {
        const asset_path = packed_files[i];
        let asset_name = path.basename(asset_path);
        if (target.indexOf('linux') >= 0) {
            if (target.indexOf('aarch64' >= 0)) {
                asset_name = asset_name.replace(/-linux-arm64(?=\.yml$)/, '');
            } else if (target.indexOf('x86_64' >= 0)) {
                asset_name = asset_name.replace(/-linux(?=\.yml$)/, '');
            }
        } else if (target.indexOf('apple') >= 0) {
            asset_name = asset_name.replace(/-mac(?=\.yml$)/, '');
        }

        if (assets.indexOf(asset_name) >= 0) {
            continue;
        }
    
        if (await upload_release_asset(release_id, asset_path, asset_name)) {
            return 1;
        }
    }

    return 0;
}

async function get_tag(tag_ver) {
    console.log(`try to get tag: ${tag_ver}`);
    try {
        let tag = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
            owner: OWNER,
            repo: REPO,
            ref: `tags/${tag_ver}`,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (tag && tag.data) {
            return tag.data;
        } else {
            console.error("cannot find tag!");
            return null;
        }
    } catch (e) {
        console.error("cannot find tag!");
        return null;
    }
}

async function get_release(tag_ver) {
    try {
        let ret = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
            owner: OWNER,
            repo: REPO,
            tag: tag_ver,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (ret) {
            return ret.data.id;
        } else {
            console.error("cannot find release, do create.");
            return null;
        }
    } catch (e) {
        console.error("cannot find release, do create.");
        return null;
    }
}

async function create_release(tag_ver) {
    let tag = await get_tag(tag_ver);
    if (!tag) {
        return null;
    }

    try {
        let ret = await octokit.request('POST /repos/{owner}/{repo}/releases', {
            owner: OWNER,
            repo: REPO,
            tag_name: tag_ver,
            target_commitish: 'main',
            name: tag_ver,
            body: utils.get_release_note(),
            draft: false,
            prerelease: false,
            generate_release_notes: false,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (ret && ret.data) {
            return ret.data.id;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function list_release_assets(release_id) {
    try {
        let ret = await octokit.request('GET /repos/{owner}/{repo}/releases/{release_id}/assets', {
            owner: OWNER,
            repo: REPO,
            release_id,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (ret && ret.data) {
            let assets = [];
            for (let i in ret.data) {
                assets.push(ret.data[i].name);
            }
            return assets;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function upload_release_asset(release_id, file_path, name) {
    console.log('upload asset to release: ', file_path);

    try {
        if (!fs.existsSync(file_path)) {
            console.error(`${file_path} doesn't exist!`);
            return 1;
        }

        const data = await fs.readFile(file_path);

        let ret = await octokit_upload.request('POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}', {
            owner: OWNER,
            repo: REPO,
            release_id,
            data,
            name,
            label: '',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (ret && ret.data) {
            return 0;
        } else {
            console.error(`upload asset: ${name} failed!`);
            return 1;
        }
    } catch (e) {
        console.error(e);
        return 1;
    }
}
