const https = require('https');
const http = require('http');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIuvChdzOcuKgUMhdHjuxOXchapO2l65WERqvldd1qVj3OdTfZgyoBjgqL8BCUPr509g/exec';

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
                    try { resolve(JSON.parse(data)); }
                    catch (e) { reject(new Error('Invalid JSON: ' + data)); }
                });
            }).on('error', reject);
        };
        makeRequest(url + '?action=getSlots');
    });
}

module.exports = async function handler(req, res) {
    try {
        const data = await getFromScript(APPS_SCRIPT_URL);
        res.status(200).json(data);
    } catch (e) {
        res.status(200).json({ takenSlots: [], error: e.message });
    }
};
