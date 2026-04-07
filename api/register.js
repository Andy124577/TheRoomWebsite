const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFGfOQJ5vIyHtQZu_yNpQNaAd3gm7l_Uc8zgfDWa3xq5yOOiOPWXQERyhb5Pq0W7uxg/exec';

module.exports = async function handler(req, res) {
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
        const text = await response.text();
        const data = JSON.parse(text);
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: 'server_error', details: e.message });
    }
};
