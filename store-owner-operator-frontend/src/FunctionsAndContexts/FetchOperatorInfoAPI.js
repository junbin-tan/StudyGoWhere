import axios from "axios";
import {BACKEND_PREFIX} from "./serverPrefix";

const FetchOperatorInfoAPI = {
    // Uses token and its information to get operator
    async getOperator(encodedToken) {
        const authorisationString = "Bearer " + encodedToken;
        // THIS GETS OWNER OBJECT FROM BACKEND THRU THE ENCODED TOKEN
        const response = await axios.get(`${BACKEND_PREFIX}/owner/get-operator`, {
            headers: {
                'Authorization': authorisationString
            }
        });
        console.log('Response from API:', response.status, response.data);

        return response;
    },
}

export default FetchOperatorInfoAPI;