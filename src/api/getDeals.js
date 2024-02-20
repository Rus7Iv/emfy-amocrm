import {accessToken, apiUrl, proxyUrl } from "../../config.js";
import { delay } from "../utils/index.js";
import { displayPagination } from '../components/Pagination.js';
import { displayDeals } from "../components/Deals.js";

export let dealsData = {
    allDeals: [],
    originalOrder: []
};

export async function getAllDeals(page = 1, limit = 5) {
    const response = await fetch(proxyUrl + `${apiUrl}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    dealsData.allDeals = dealsData.allDeals.concat(data._embedded.leads);
    dealsData.originalOrder = [...dealsData.allDeals];
    if (data._embedded.leads.length === limit) {
        await delay(500);
        await getAllDeals(page + 1, limit);
    }
}

export async function updateDeals(page, limit) {
    if (!dealsData.allDeals.length) {
        await getAllDeals();
    }
    const deals = dealsData.allDeals.slice((page - 1) * limit, page * limit);
    displayDeals(deals);
    displayPagination(dealsData.allDeals.length, limit);
}