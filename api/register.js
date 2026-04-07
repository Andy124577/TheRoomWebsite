const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx72M_1Sk_qKFR6VrcFGsFDA0lWPUYDUwSwSRCwiWWiAxpp5iXHw5zz3J97PkIuU60HuA/exec';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: 'server_error' });
    }
}
