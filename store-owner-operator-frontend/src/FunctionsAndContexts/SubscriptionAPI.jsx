import {BACKEND_PREFIX} from "./serverPrefix";

export const SubscriptionAPI = {
    getSubscription(tokenValue) {
        return fetch(`${BACKEND_PREFIX}/owner/subscription`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenValue}`
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else if (response.status === 404) {
                throw new Error("NOT FOUND");
              } else if (response.status === 401 || response.status === 403) {
                throw new Error("UNAUTHORIZED");
              } else {
                throw new Error(`Failed to search get subscription: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
    },
}