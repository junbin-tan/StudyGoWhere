import { useState } from "react";

// export default function useToken() {

//     const [token, setToken] = useState(getToken());

//     const saveToken = (userToken) => {
//         localStorage.setItem("token", JSON.stringify(userToken));
//         setToken(userToken.token);
//     };

//     return {
//         setToken: saveToken,
//         token,
//     };
// }
export default function useEncodedToken() {
    const getEncodedToken = () => {
        const tokenString = localStorage.getItem("encodedToken");
        const userToken = JSON.parse(tokenString);
        return userToken;
    };

    const [encodedToken, setEncodedToken] = useState(getEncodedToken());

    const saveEncodedToken = (userInfoToken) => {
        localStorage.setItem("encodedToken", JSON.stringify(userInfoToken));
        setEncodedToken(userInfoToken);
    };

    return {
        setEncodedToken: saveEncodedToken,
        encodedToken,
    };
}