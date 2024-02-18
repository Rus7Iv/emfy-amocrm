const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJlMzM1YWJiNmEyNmY0ZDEzZTQ2MGU0MDI3N2FiYTZhOWZiZWUwZTcwMGM0YTU1NmI0MzAyNmU4Yzk2ODhjYjc0M2I0MTU4OGU5YTU2OWJhIn0.eyJhdWQiOiJmMmI3Y2Q2Yi1lYWYwLTQzYzAtOTI0Mi04ZTMyY2RhYzRiNDkiLCJqdGkiOiJiZTMzNWFiYjZhMjZmNGQxM2U0NjBlNDAyNzdhYmE2YTlmYmVlMGU3MDBjNGE1NTZiNDMwMjZlOGM5Njg4Y2I3NDNiNDE1ODhlOWE1NjliYSIsImlhdCI6MTcwODE4MjY2NCwibmJmIjoxNzA4MTgyNjY0LCJleHAiOjE3MDkyNTEyMDAsInN1YiI6IjEwNjg4ODYyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTc2NDQyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMjhhMjllNTEtYjUxZC00N2IxLWFhNWItZGVmYWY0ZmIwZTdmIn0.HbdtIYu8XocUG3LasjUvFzQW-zAyknWBdE4W-OixfcnDKbKBPKbIP-NjmWbli6kXysRGphxqqquGUmRMY8tw6pUCX_zrc0tINht_H9RyiPsWjyYFPcBQ7bgFCmt-CtvlZeu7jvFo2zx115Ym79uW0SuhCq2gYVsU2XMFtKRKxgoFyrzAhDqlWi1G1O34pMY-qRQ2sQbMrTLMgt3ZsL-eqB9CsvBqJTJsnOm7Mm20q6wqfoEipCXJFwARoAvfEcUJqSF3CJzuoggCU7reZDWp9_33WDjPIj_lEjNIFfi40AZCVceg1pi-7ZQs3AHiFbAmeYH-bw_qlaP-eXP92jelSg';

const apiUrl = 'https://rusivary.amocrm.ru/api/v4/leads';

const usersApiUrl = 'https://rusivary.amocrm.ru/api/v4/users';

// const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const proxyUrl = 'https://corsproxy.io/?';

let sortState = {
    'Название сделки': 0,
    'Бюджет': 0
};

let allDeals = [];
let originalOrder = [];

function delay(t, v) {
   return new Promise(function(resolve) { 
       setTimeout(resolve.bind(null, v), t)
   });
}

async function getDeals(page, limit) {
    await delay(500);
    const response = await fetch(proxyUrl + `${apiUrl}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data._embedded.leads;
}

async function getAllDeals(page = 1, limit = 5) {
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

async function getUsers() {
    const response = await fetch(proxyUrl + usersApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data._embedded.users;
}

async function displayDeals(deals) {
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

function displayPagination(totalDeals, limit) {
    const totalPages = Math.ceil(totalDeals / limit);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function() {
            updateDeals(i, limit);
        });
        pagination.appendChild(button);
    }
}

async function updateDeals(page, limit) {
    if (!allDeals.length) {
        await getAllDeals();
    }
    const deals = allDeals.slice((page - 1) * limit, page * limit);
    displayDeals(deals);
    displayPagination(allDeals.length, limit);
}

function sortDealsByPrice(deals) {
    return deals.sort((a, b) => a.price - b.price);
}

function sortDealsByName(deals) {
    return deals.sort((a, b) => a.name.localeCompare(b.name));
}

document.querySelectorAll('#deals-per-page button').forEach(button => {
    button.addEventListener('click', function() {
        const limit = this.value === 'all' ? Infinity : parseInt(this.value);
        localStorage.setItem('dealsPerPage', this.value);
        updateDeals(1, limit);
    });
});

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


const savedLimit = localStorage.getItem('dealsPerPage');
const limit = savedLimit === 'all' ? Infinity : parseInt(savedLimit) || 5;
updateDeals(1, limit);
