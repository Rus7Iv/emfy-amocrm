import { delay } from "../utils/index.js";
import { getUsers } from '../../src/api/getUsers.js';
import { accessToken, proxyUrl, apiUrl } from "../../config.js";
import { displayPagination } from '../components/Pagination.js';
import { sortState } from "../../index.js";
import { sortDealsByName, sortDealsByPrice } from "../utils/index.js";

let allDeals = [];
let originalOrder = [];

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

export async function updateDeals(page, limit) {
    if (!allDeals.length) {
        await getAllDeals();
    }
    const deals = allDeals.slice((page - 1) * limit, page * limit);
    displayDeals(deals);
    displayPagination(allDeals.length, limit);
}

export async function displayDeals(deals) {
    const users = await getUsers();
    const table = document.getElementById('deals-table');
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    deals.forEach(deal => {
        const row = tbody.insertRow();

        const nameCell = row.insertCell();
        nameCell.textContent = deal.name;

        const priceCell = row.insertCell();
        priceCell.textContent = deal.price;
        
        const createdCell = row.insertCell();
        createdCell.textContent = new Date(deal.created_at * 1000).toLocaleString();

        const updatedCell = row.insertCell();
        updatedCell.textContent = new Date(deal.updated_at * 1000).toLocaleString();

        const responsibleCell = row.insertCell();
        const responsibleUser = users.find(user => user.id === deal.responsible_user_id);
        responsibleCell.textContent = responsibleUser ? responsibleUser.name : 'Неизвестно';
    });
}

document.getElementById('deals-table').addEventListener('click', function(event) {
    if (event.target.tagName === 'TH') {
        let column = event.target.textContent;
        column = column.replace(' ▲', '').replace(' ▼', '');
        if (column === 'Название сделки' || column === 'Бюджет') {
            for (let key in sortState) {
                if (key !== column) {
                    sortState[key] = 0;
                    let otherHeader = Array.from(document.querySelectorAll('#deals-table th')).find(th => th.textContent.includes(key));
                    otherHeader.textContent = key;
                }
            }
            sortState[column] = (sortState[column] + 1) % 3;
            if (sortState[column] === 1) {
                allDeals = column === 'Название сделки' ? sortDealsByName(allDeals) : sortDealsByPrice(allDeals);
                event.target.innerHTML = column + ' ▼';
            } else if (sortState[column] === 2) {
                allDeals = (column === 'Название сделки' ? sortDealsByName(allDeals) : sortDealsByPrice(allDeals)).reverse();
                event.target.innerHTML = column + ' ▲';
            } else {
                allDeals = [...originalOrder];
                event.target.textContent = column;
            }
            const savedLimit = localStorage.getItem('dealsPerPage');
            const limit = savedLimit === 'all' ? Infinity : parseInt(savedLimit) || 5;
            updateDeals(1, limit);
        }
    }
});