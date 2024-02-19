import {accessToken, usersApiUrl, proxyUrl } from "../../config.js";

export async function getUsers() {
    const response = await fetch(proxyUrl + usersApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data._embedded.users;
}