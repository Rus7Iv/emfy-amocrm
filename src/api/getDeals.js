import {accessToken, proxyUrl } from "../../config.js";
import { delay } from "../utils/index.js";

export async function getAllDeals(page = 1, limit = 5) {
    const response = await fetch(proxyUrl + `${apiUrl}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    allDeals = allDeals.concat(data._embedded.leads);
    originalOrder = [...allDeals];
    if (data._embedded.leads.length === limit) {
        await delay(500);
        await getAllDeals(page + 1, limit);
    }
}
