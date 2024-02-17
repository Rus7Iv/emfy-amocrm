const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJlMzM1YWJiNmEyNmY0ZDEzZTQ2MGU0MDI3N2FiYTZhOWZiZWUwZTcwMGM0YTU1NmI0MzAyNmU4Yzk2ODhjYjc0M2I0MTU4OGU5YTU2OWJhIn0.eyJhdWQiOiJmMmI3Y2Q2Yi1lYWYwLTQzYzAtOTI0Mi04ZTMyY2RhYzRiNDkiLCJqdGkiOiJiZTMzNWFiYjZhMjZmNGQxM2U0NjBlNDAyNzdhYmE2YTlmYmVlMGU3MDBjNGE1NTZiNDMwMjZlOGM5Njg4Y2I3NDNiNDE1ODhlOWE1NjliYSIsImlhdCI6MTcwODE4MjY2NCwibmJmIjoxNzA4MTgyNjY0LCJleHAiOjE3MDkyNTEyMDAsInN1YiI6IjEwNjg4ODYyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTc2NDQyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMjhhMjllNTEtYjUxZC00N2IxLWFhNWItZGVmYWY0ZmIwZTdmIn0.HbdtIYu8XocUG3LasjUvFzQW-zAyknWBdE4W-OixfcnDKbKBPKbIP-NjmWbli6kXysRGphxqqquGUmRMY8tw6pUCX_zrc0tINht_H9RyiPsWjyYFPcBQ7bgFCmt-CtvlZeu7jvFo2zx115Ym79uW0SuhCq2gYVsU2XMFtKRKxgoFyrzAhDqlWi1G1O34pMY-qRQ2sQbMrTLMgt3ZsL-eqB9CsvBqJTJsnOm7Mm20q6wqfoEipCXJFwARoAvfEcUJqSF3CJzuoggCU7reZDWp9_33WDjPIj_lEjNIFfi40AZCVceg1pi-7ZQs3AHiFbAmeYH-bw_qlaP-eXP92jelSg';

const apiUrl = 'https://rusivary.amocrm.ru/api/v4/leads';

const usersApiUrl = 'https://rusivary.amocrm.ru/api/v4/users';

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

async function getDeals(page, limit) {
    const response = await fetch(proxyUrl + `${apiUrl}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data._embedded.leads;
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
    for (let i = 1; i <= totalPages; i++) {
        // пагинация 
    }
}

function updateDeals(page, limit) {
    getDeals(page, limit).then(displayDeals);
}

function sortDealsByPrice(deals) {
    return deals.sort((a, b) => a.price - b.price);
}

function sortDealsByName(deals) {
    return deals.sort((a, b) => a.name.localeCompare(b.name));
}

getDeals(1, 5).then(deals => {
    displayDeals(deals);
    displayPagination(deals.length, 5);
});