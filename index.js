import { updateDeals } from './src/api/getDeals.js';

export let sortState = {
    'Название сделки': 0,
    'Бюджет': 0
};

document.getElementById('deals-select').addEventListener('change', function() {
    const limit = this.value === 'all' ? Infinity : parseInt(this.value);
    localStorage.setItem('dealsPerPage', this.value);
    updateDeals(1, limit);
});

const savedLimit = localStorage.getItem('dealsPerPage');
const limit = savedLimit === 'all' ? Infinity : parseInt(savedLimit) || 5;
document.getElementById('deals-select').value = savedLimit;
updateDeals(1, limit);
