const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZlUadEmnQWrw58HiDFqBJ3cprsrjA_9nc-Y1_-8mlBCQi4C7DuVp-VQSkYlACtw8X6g/exec';

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const log = [];

    try {
        log.push('1. Body received: ' + JSON.stringify(req.body).substring(0, 100));

        const bodyString = JSON.stringify(req.body);
        log.push('2. Calling Apps Script URL...');

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: bodyString,
        });

        log.push('3. Response status: ' + response.status);
        log.push('4. Response URL: ' + response.url);

        const text = await response.text();
        log.push('5. Raw response: ' + text.substring(0, 200));

        const data = JSON.parse(text);
        log.push('6. Parsed OK: ' + JSON.stringify(data));

        res.status(200).json({ ...data, _log: log });
    } catch (e) {
        log.push('ERROR: ' + e.message);
        res.status(500).json({ error: 'server_error', details: e.message, _log: log });
    }
};
