const https = require('https');
const http = require('http');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZlUadEmnQWrw58HiDFqBJ3cprsrjA_9nc-Y1_-8mlBCQi4C7DuVp-VQSkYlACtw8X6g/exec';

function getFromScript(url) {
    return new Promise((resolve, reject) => {
        const makeRequest = (url) => {
            const urlObj = new URL(url);
            const lib = urlObj.protocol === 'https:' ? https : http;
            lib.get(url, res => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return makeRequest(res.headers.location);
                }
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                    catch (e) { resolve({ status: res.statusCode, raw: data.substring(0, 300), parseError: e.message }); }
                });
            }).on('error', reject);
        };
        makeRequest(url + '?action=getSlots');
    });
}

module.exports = async function handler(req, res) {
    try {
        const result = await getFromScript(APPS_SCRIPT_URL);
        if (result.body) {
            res.status(200).json(result.body);
        } else {
            res.status(200).json({ takenSlots: [], _debug: result });
        }
    } catch (e) {
        res.status(200).json({ takenSlots: [], _error: e.message });
    }
};
