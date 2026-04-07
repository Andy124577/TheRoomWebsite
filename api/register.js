const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx72M_1Sk_qKFR6VrcFGsFDA0lWPUYDUwSwSRCwiWWiAxpp5iXHw5zz3J97PkIuU60HuA/exec';

export const config = { api: { bodyParser: false } };

function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const rawBody = await readBody(req);
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: rawBody,
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: 'server_error', details: e.message });
    }
}
