
import axios from 'axios';

const SERVER_PREFIX_ADMIN = "http://localhost:5001";


const Api = {
    getAllAdmins(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    createAdmin(adminData, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(adminData)
        });
    },
    deleteAdmin(adminId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/${adminId}`, {
            method: "DELETE",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    activateAdmin(adminId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/activateadmin/${adminId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    updateAdmin(adminId, adminData, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/${adminId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(adminData)
        });
    },
    updateAdminNoPassword(adminId, adminData, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/updateadminnopassword/${adminId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(adminData)
        });
    },
    getAdminById(adminId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/${adminId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    authenticateAdmin(adminCredentials) {
        return axios.post('http://localhost:5001/public/admin/authenticate', adminCredentials)
    },
    createSubscriptionType(subTypeData, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/subscriptiontype`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(subTypeData)
        });
    },
    getAllSubscriptionTypes(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/subscriptiontype`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    activateDeactivateSubType(subId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/subscriptiontype/activateDeactivateSubscriptionType/${subId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    getSubscriptionTypeById(subId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/subscriptiontype/${subId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    updateSubscriptionType(subId, subTypeData, tokenValue) {
        console.log(subTypeData);
        return fetch(`${SERVER_PREFIX_ADMIN}/subscriptiontype/${subId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(subTypeData)
        });
    },
    deleteSubscriptionType(subId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/subscriptiontype/${subId}`, {
            method: "DELETE",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    getAdminByToken(encodedToken) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/getLoginAdmin`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${encodedToken}`
            }
        });
    },
    getAllVenues(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/venue`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },

    activateDeactivateVenue(venueId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/venue/activateVenue/${venueId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    banUnbanVenue(venueId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/venue/banVenue/${venueId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },


    getVenueById(venueId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/venue/${venueId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    deleteVenue(venueId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/venue/${venueId}`, {
            method: "DELETE",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    getAllOwners(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/owners`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    activateDeactivateOwner(ownerId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/owner/activateowner/${ownerId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    getOwnerById(ownerId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/owner/${ownerId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },

    getAllStudents(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/students`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    changeActivationStatus(student, tokenValue) {
        student.userId = student.id;
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/student/activation-status`, {
            method: "PUT",
            headers: {
                 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body : JSON.stringify(student)
        });
    },


    searchTicket(searchObj, encodedToken) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/ticket/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${encodedToken}`
            },
            body: JSON.stringify(searchObj),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else if (response.status === 401 || response.status === 403) {
                throw new Error("UNAUTHORIZED");
              } else {
                throw new Error(`Failed to search tickets: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
    },
    getTicketById(ticketId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/ticket/${ticketId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    updateTicket(ticket, ticketId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/updateTicket/${ticketId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(ticket)
        });
    },
    
    getAllReviews(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/reviews`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },

    getAllPendingAdvertisements(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/advertisement/getAllPendingAdvertisement`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    getAllVoucherListing(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/voucherlisting`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    deleteReview(reviewId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        }).catch(error => {
            throw error;
        })
    },
    getAllAdvertisements (tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/advertisement/getAllAdvertisement`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenValue}`
              },
        });
    },
    getAdvertisementById(advertId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/advertisement/getAdvert/${advertId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    activateVoucher(voucherListingId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/activateVoucherlisting/${voucherListingId}`, {
            method: "PUT",
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
        });
    },
    getVoucherListingById(voucherListingId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/getVoucherlistingById/${voucherListingId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    updateAdvertisementById(advertId, advertData, tokenValue) {
        console.log(advertData);
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/advertisement/update/${advertId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(advertData)
        });
    },
    markAsRead(ticketId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/ticket-read/${ticketId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${tokenValue}`
            },
          })
            .then((response) => {
              if (response.ok) {
              } else if (response.status === 401 || response.status === 403) {
                throw new Error("UNAUTHORIZED");
              } else {
                throw new Error(`Failed to connect: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
      },
      sendRequest(relativeURL, httpVerb, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/${relativeURL}`, {
            method: `${httpVerb}`,
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
                throw new Error(`Failed to connect: ${response.status}`);
              }
            }).catch(error => {
              throw error;
            });
      },
       getAllTransactions(tokenValue) {
        return this.sendRequest("admin/transactions", "GET", tokenValue)
                .catch(error => {
                    throw error;
                });
      },
      getOwnTransactions(tokenValue) {
        return this.sendRequest("admin/own-transactions", "GET", tokenValue)
                .catch(error => {
                    throw error;
                });
      },
      getTransactionById(transactionId, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/transactions/${transactionId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    getWalletBalance(tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/wallet-balance`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            }
        });
    },
    
    makePayment(refundRequest, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/refund`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(refundRequest)
        });
    },
    refund(refundRequest, tokenValue) {
        return fetch(`${SERVER_PREFIX_ADMIN}/admin/transaction/refund`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: JSON.stringify(refundRequest)
        });
    },

}


export default Api;