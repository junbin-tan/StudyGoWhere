import {v4 as uuidv4} from "uuid";
import {ref, uploadBytes} from "firebase/storage";
import storage from "../firebase";
import FetchOwnerInfoAPI from "./FetchOwnerInfoAPI";

// NOT COMPLETE OR TESTED AT ALL, JUST A CONCEPT
export default async function SendFilesToFirebase (files) {
    const promiseArr = [];
    const pathArr = [];
    for (const file of files) {
        const path = "venue-images/" + uuidv4();
        const imageRef = ref(storage, path);
        const promise = uploadBytes(imageRef, file);
        promiseArr.push(promise);
        pathArr.push(path);
    }

    Promise.all(promiseArr)
        .then((res) => {
            setUploaded(true);
            return onImageChange(pathArr);
        })
        .then((newFormData) => {
            FetchOwnerInfoAPI.updateVenue(encodedToken, newFormData)
            handleUploadSuccess();
        })
        .catch((error) => {
            console.log(error);
            handleUploadError();
        })
        .finally(() => {
            setLoading(false);
        });
}

