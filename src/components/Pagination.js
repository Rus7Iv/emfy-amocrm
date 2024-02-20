import { updateDeals } from "../api/getDeals.js";

export function displayPagination(totalDeals, limit) {
    const totalPages = Math.ceil(totalDeals / limit);
    const pagination = document.getElementById('pagination');
    const loadingWheel = document.getElementById('loading-wheel');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';
        button.addEventListener('click', async function() {
            loadingWheel.style.display = 'block';

            await updateDeals(i, limit);

            setTimeout(() => {
                loadingWheel.style.display = 'none';
            }, 500);
        });
        pagination.appendChild(button);
    }
}