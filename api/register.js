const https = require('https');
const http = require('http');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx72M_1Sk_qKFR6VrcFGsFDA0lWPUYDUwSwSRCwiWWiAxpp5iXHw5zz3J97PkIuU60HuA/exec';

function postToScript(body) {
    return new Promise((resolve, reject) => {
        const makeRequest = (url) => {
            const urlObj = new URL(url);
            const lib = urlObj.protocol === 'https:' ? https : http;
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                    'Content-Length': Buffer.byteLength(body),
                },
            };
            const req = lib.request(options, res => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return makeRequest(res.headers.location);
                }
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    try { resolve(JSON.parse(data)); }
                    catch (e) { reject(new Error('Invalid JSON: ' + data)); }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        };
        makeRequest(APPS_SCRIPT_URL);
    });
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const rawBody = JSON.stringify(req.body);
        const data = await postToScript(rawBody);
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: 'server_error', details: e.message });
    }
};
