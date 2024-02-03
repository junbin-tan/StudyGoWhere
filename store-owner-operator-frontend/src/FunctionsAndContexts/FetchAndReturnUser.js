import FetchOwnerInfoAPI from "./FetchOwnerInfoAPI";
import axios from "axios";
import {BACKEND_PREFIX} from "./serverPrefix";

export const FetchAndReturnUser = {
    owner: async (encodedToken) => {
        return FetchOwnerInfoAPI.getOwner(encodedToken).then((response) => {
            if (response.status === 200) {
                console.log("logging inside FetchAndReturnUser.owner: ", response.data);
                return response.data;
            } else {
            throw new Error(response.statusText);
        }
    })},
        operator: async (encodedToken) => {
            const authorisationString = "Bearer " + encodedToken;
            const response = await axios.get(`${BACKEND_PREFIX}/owner/get-operator`, {
                headers: {
                    'Authorization': authorisationString
                }
            });
            console.log('Response from API:', response.status, response.data);

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(response.statusText);
            }
    }
}
