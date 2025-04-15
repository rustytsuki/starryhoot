import fs from 'fs-extra';
import path from 'path';
import * as utils from './utils.js';
import { Octokit } from 'octokit';

const GH_TOKEN = process.env.GH_TOKEN;
if (typeof token !== 'string' || token.trim() === '') {
    console.error('❌ GH_TOKEN is not set or is empty.');
} else {
    console.log(`✅ GH_TOKEN length: ${token.trim().length}`);
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

export async function upload_assets(target) {
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

    const packed_files = utils.get_packed_files(target);
    for (let i = 0; i < packed_files.length; ++i) {
        const asset_path = packed_files[i];
        const asset_name = path.basename(asset_path);

        if (assets.indexOf(asset_name) >= 0) {
            continue;
        }
    
        if (upload_release_asset(release_id, asset_path, asset_name)) {
            return 1;
        }
    }

    return 0;
}

async function get_tag(tag_ver) {
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
            body: '',
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
            return 1;
        }
    } catch (e) {
        console.error(e);
        return 1;
    }
}
