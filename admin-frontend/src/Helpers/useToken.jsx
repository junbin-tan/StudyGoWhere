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
export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        return userToken;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userInfoToken) => {
        localStorage.setItem("token", JSON.stringify(userInfoToken));
        setToken(userInfoToken);
    };

    return {
        setToken: saveToken,
        token,
    };
}