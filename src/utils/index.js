export function delay(t, v) {
   return new Promise(function(resolve) { 
       setTimeout(resolve.bind(null, v), t)
   });
}

export function sortDealsByPrice(deals) {
    return deals.sort((a, b) => a.price - b.price);
}

export function sortDealsByName(deals) {
    return deals.sort((a, b) => a.name.localeCompare(b.name));
}