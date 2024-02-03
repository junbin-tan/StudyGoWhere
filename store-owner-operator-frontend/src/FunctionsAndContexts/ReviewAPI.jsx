import { BACKEND_PREFIX } from "./serverPrefix";
export const ReviewAPI = {
    getReviews(searchObj, tokenValue) {
        return fetch(`${BACKEND_PREFIX}/owner/review/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(searchObj),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else if (response.status === 401 || response.status === 403) {
                throw new Error("UNAUTHORIZED");
              } else {
                throw new Error(`Connection error, failed to get reviews: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
      },
      reply(replyObj, tokenValue) {
        return fetch(`${BACKEND_PREFIX}/owner/review/reply`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(replyObj),
          })
            .then((response) => {
              if (response.ok) {
              } else if (response.status === 401 || response.status === 403) {
                throw new Error("UNAUTHORIZED");
              } else {
                throw new Error(`Connection error, failed to reply review: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
      },
      getReviewStatistics(venueId, tokenValue) {
        return fetch(`${BACKEND_PREFIX}/owner/venue/${venueId}/statistics`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenValue}`
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else if (response.status === 401 || response.status === 403) {
                throw new Error("UNAUTHORIZED");
              } else {
                throw new Error(`Connection error, failed to get stats: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
      },
}