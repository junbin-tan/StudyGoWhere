import axios from "axios";
import { BACKEND_PREFIX } from "./serverPrefix";

const FetchOwnerInfoAPI = {
  async getOwner(encodedToken) {
    const authorisationString = "Bearer " + encodedToken;
    // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
    const response = await axios.get(`${BACKEND_PREFIX}/owner/get-owner`, {
      headers: {
        Authorization: authorisationString,
      },
    });
    console.log("Response from API:", response.status, response.data);

    // sorts venue by venue id

    // response.data.venues.sort((venueA, venueB) => (venueB.venueId - venueA.venueId));
    response.data.venues = response.data.venues.filter(
      (ven) => ven.venueStatus != "DELETED"
    );
    response.data.venues.sort(
      (venueA, venueB) => venueA.venueId - venueB.venueId
    );
    return response;
  },

  async getVenuesOfOwner(encodedToken) {
    const authorisationString = "Bearer " + encodedToken;
    // console.log("authorisationString is: " + authorisationString);
    const response = await axios.get(`${BACKEND_PREFIX}/owner/get-venue`, {
      headers: {
        Authorization: authorisationString,
      },
    });

    console.log("Response from API:", response.status, response.data);
    return response;
    // if (response.status == 200) {
    //     setVenueData(response.data);
    // }
  },

  async getVenueById(encodedToken, venueId) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.get(
      `${BACKEND_PREFIX}/owner/get-venue/${venueId}`,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );

    console.log("Response from API:", response.status, response.data);
    return response;
  },
  async updateVenueCrowdLevel(encodedToken, venueId, venueCrowdLevel) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.put(
      `${BACKEND_PREFIX}/owner/update-venue-crowd-level/${venueId}`,
      {
        venueCrowdLevel: venueCrowdLevel,
      },
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );
    console.log("Response from API:", response.status, response.data);
    return response;
  },
  async updateVenueStatus(encodedToken, venueId, venueStatus) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.put(
      `${BACKEND_PREFIX}/owner/update-venue-status/${venueId}`,
      {
        venueStatus: venueStatus,
      },
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );
    console.log("Response from API:", response.status, response.data);
    return response;
  },
  async updateOwner(encodedToken, ownerId, ownerData) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.put(
      `${BACKEND_PREFIX}/owner/updateOwner/${ownerId}`,
      ownerData,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );

    console.log("Response from API:", response.status, response.data);
    return response;
  },

  async deleteVenueById(encodedToken, venueId) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.delete(
      `${BACKEND_PREFIX}/owner/delete-venue/${venueId}`,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );

    console.log("Response from API:", response.status, response.data);
    return response;
  },

  async toggleVenueStatusById(encodedToken, venueId) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.get(
      `${BACKEND_PREFIX}/owner/toggle-venue-visible-status/${venueId}`,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );

    console.log("Response from API:", response.status, response.data);
    return response;
  },

  async updateVenue(encodedToken, venueObject) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.put(
      `${BACKEND_PREFIX}/owner/put-venue`,
      venueObject,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );
    console.log("Response from API:", response.status, response.data);
    return response;
  },

  async updateVenueDisplayImagePath(
    encodedToken,
    venueId,
    venueDisplayImagePath
  ) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.put(
      `${BACKEND_PREFIX}/owner/put-venue/${venueId}/displayImagePath`,
      venueDisplayImagePath,
      {
        headers: {
          Authorization: authorisationString,
          "Content-Type": "text/plain",
        },
      }
    );
    console.log("Response from API:", response.status, response.data);
    return response;
  },

  async createVenue(encodedToken, venueObject) {
    const authorisationString = "Bearer " + encodedToken;
    console.log(venueObject);
    const response = await axios.post(
      `${BACKEND_PREFIX}/owner/post-venue`,
      venueObject,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );
    console.log("Response from API:", response.status, response.data);
    return response;
  },
  async createVoucherListingForOwner(voucherListingDetail, encodedToken) {
    try {
      const response = await fetch(
        `${BACKEND_PREFIX}/owner/postVoucherListing-forOwner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${encodedToken}`,
          },
          body: JSON.stringify(voucherListingDetail),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
  async getAllVoucherListingForOwner(tokenValue) {
    return fetch(`${BACKEND_PREFIX}/owner/allvenuevoucherlisting`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenValue}`,
      },
    });
  },
  async activateDeactivateVoucherListingForOwner(voucherListingID, tokenValue) {
    return fetch(
      `${BACKEND_PREFIX}/owner/activateDeactivateVoucherListing/${voucherListingID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
  },
  async getVoucherListingById(voucherListingID, tokenValue) {
    return fetch(
      `${BACKEND_PREFIX}/owner/getVoucherListingById/${voucherListingID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
  },
  async updateVoucherListing(voucherListingID, vcListingData, tokenValue) {
    return fetch(
      `${BACKEND_PREFIX}/owner/updateVoucherListing/${voucherListingID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
        body: JSON.stringify(vcListingData),
      }
    );
  },
  async deleteVoucherListing(voucherListingID, tokenValue) {
    return fetch(
      `${BACKEND_PREFIX}/owner/deleteVoucherListing/${voucherListingID}`,
      {
        method: "DELETE",
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
  },

  async redeemAndUseVoucher(encodedToken, voucherCode) {
    const authorisationString = "Bearer " + encodedToken;
    return await axios.post(
      `${BACKEND_PREFIX}/owner/usevoucher/${voucherCode}`,
      {},
      {
        method: "POST",
        headers: {
          Authorization: authorisationString,
        },
      }
    );
  },

  async getVoucherByVoucherCode(encodedToken, voucherCode) {
    const authorisationString = "Bearer " + encodedToken;
    return await axios.get(
      `${BACKEND_PREFIX}/owner/getvoucherbycode/${voucherCode}`,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );
  },

  async createTableType(encodedToken, tableTypeObject, venueId) {
    const authorisationString = "Bearer " + encodedToken;
    const response = await axios.put(
      `${BACKEND_PREFIX}/owner/create-table-type/${venueId}`,
      tableTypeObject,
      {
        headers: {
          Authorization: authorisationString,
        },
      }
    );
    console.log("Response from API:", response.status, response.data);
    return response;
  },

  async deleteTableType(tableTypeId, encodedToken) {
    const authorisationString = "Bearer " + encodedToken;
    try {
      const response = await axios.delete(
        `${BACKEND_PREFIX}/owner/delete-table-type?tableTypeId=${tableTypeId}`,
        {
          headers: {
            Authorization: authorisationString,
          },
        }
      );
      console.log("Response from API:", response.status, response.data);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async editTableType(tableTypeObject, encodedToken) {
    const authorisationString = "Bearer " + encodedToken;
    try {
      const response = await axios.put(
        `${BACKEND_PREFIX}/owner/edit-table-type`,
        tableTypeObject,
        {
          headers: {
            Authorization: authorisationString,
          },
        }
      );
      console.log("Response from API:", response.status, response.data);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

async getTableTypeById(tableTypeId, tokenValue) {
    return fetch(
      `${BACKEND_PREFIX}/owner/get-table-type-by-id?id=${tableTypeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
  },

  async cancelBookingAsOwner(bookingId, tokenValue) {
    return fetch(`${BACKEND_PREFIX}/owner/cancel-booking?bookingId=${bookingId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenValue}`
        }
    });
},

    
    

}

export default FetchOwnerInfoAPI;
