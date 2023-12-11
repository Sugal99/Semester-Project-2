export const API_BASE_URL = `https://api.noroff.dev/api/v1`;

export const allListingsDESC = `${API_BASE_URL}/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc&_active=true`;

// Get all listings ASC
export const allListingsASC = `${API_BASE_URL}/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=asc&_active=true`;
