
import axios from 'axios';

const SERVER_PREFIX = "http://localhost:5001";


const Api = { 
    getAllSubTypes(tokenValue) {
        return fetch(`${SERVER_PREFIX}/subscriptiontype`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    getAllSubTypesActiveOnly(tokenValue) {
        return fetch(`${SERVER_PREFIX}/subscriptiontype/activeOnly`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    getSubscriptionByToken(encodedToken) {
        return fetch(`${SERVER_PREFIX}/owner/subscriptionforowner`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${encodedToken}`
            }
        });
    },
    getSubscriptionTypeById(subId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/subscriptiontype/${subId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    activateDeactivateAutoRenew(ownerId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/updateAutoRenewSubscription/${ownerId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },

    buySubscription(subscriptionData,tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/subscription/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(subscriptionData)
        });

        return response;
    },
    buySubscriptionForSubscriptionPage(subscriptionData,tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/subscriptionpage/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(subscriptionData)
        });

        return response;
    },
    setNextMonthSubscription(subscriptionTypeData,tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/subscription/queue`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(subscriptionTypeData)
        });

        return response;
    },
    getAllAdvertisements(encodedToken) {
        return fetch(`${SERVER_PREFIX}/owner/advertisement/retrieve`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${encodedToken}`
            }
        });
    },
    addAnAdvertisement(advertisementData,tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/advertisement/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(advertisementData)
        });

        return response;
    },
    getAdvertisementById(advertId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/advertisement/getAdvert/${advertId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    markAdvertisementAsCompleted(advertId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/advertisement/markAsComplete/${advertId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    completeOrder(transactionId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/public/complete-order`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(transactionId)
        });
    },
    getOwnTransactions(tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/transactions`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },    
    getTransactionById(transactionId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/transactions/${transactionId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },

    getAllMenues(ownerId,encodedToken) {
        return fetch(`${SERVER_PREFIX}/owner/get-own-menus?ownerId=${ownerId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${encodedToken}`
            }
        });
    },
    ownerCreateMenuTemplate(ownerId, menuTemplate, tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/create-menu-template?ownerId=${ownerId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(menuTemplate)
        });
    
        return response;
    },
    
    getMenuByMenuId(menuId,tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/menu/getMenuByMenuId/${menuId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },

    retrieveVenueOrders(tokenValue){
        return fetch(`${SERVER_PREFIX}/public/retrieveVenueOrders`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    addSectionToMenu(menuId, menuSection, tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/add-section-to-menu?menuId=${menuId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(menuSection)
        });
    
        return response;
    },
    addMenuItemToSection(menuSectionId, menuItem, tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/owner/add-menu-item-to-section?menuSectionId=${menuSectionId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(menuItem)
        });
    
        return response;
    },
    deleteMenu(menuId, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/menu/deleteMenuByMenuId/${menuId}`, {
            method: "DELETE",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    deleteMenuSection(menuSectionId, tokenValue) {
        const queryParams = new URLSearchParams({ menuSectionId }).toString();
        return fetch(`${SERVER_PREFIX}/owner/menu/deleteMenuSection?${queryParams}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${tokenValue}` 
            },
        });
    },
    deleteMenuItem(menuItemId, tokenValue) {
        const queryParams = new URLSearchParams({ menuItemId }).toString();
        return fetch(`${SERVER_PREFIX}/owner/menu/deleteMenuItem?${queryParams}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${tokenValue}` 
            },
        });
    },
    updateMenu(menu, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/menu/updateMenu`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(menu)
        });
    },

    updateMenuSection(menuSection, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/menu/updateMenuSection`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(menuSection)
        });
    },

    updateMenuItem(menuItem, tokenValue) {
        return fetch(`${SERVER_PREFIX}/owner/menu/updateMenuItem`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(menuItem)
        });
    },
    copyMenuToVenue(menuTemplateId, venueId, tokenValue) {
        const response = fetch(`${SERVER_PREFIX}/public/set-menu-to-venue?menuTemplateId=${menuTemplateId}&venueId=${venueId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    
        return response;
    },

}

export default Api;