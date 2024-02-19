import { updateDeals } from "./Deals.js";

export function displayPagination(totalDeals, limit) {
    const totalPages = Math.ceil(totalDeals / limit);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';
        button.addEventListener('click', function() {
            updateDeals(i, limit);
        });
        pagination.appendChild(button);
    }
}