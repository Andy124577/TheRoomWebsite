const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx72M_1Sk_qKFR6VrcFGsFDA0lWPUYDUwSwSRCwiWWiAxpp5iXHw5zz3J97PkIuU60HuA/exec';

export default async function handler(req, res) {
    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getSlots`, { redirect: 'follow' });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(200).json({ takenSlots: [] });
    }
}
