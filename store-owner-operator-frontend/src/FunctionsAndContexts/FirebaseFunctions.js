import {getDownloadURL, ref, uploadBytes, deleteObject, getStorage} from "firebase/storage";
import storage from "../firebase";
const FirebaseFunctions = {

    convertPathsToDownloadURLs: async (paths) => {

        const downloadURLs = [];
        // const storage = getStorage();
        if (!paths || paths.length == 0) {
            return downloadURLs;
        }
        // Promise.allSettled doesn't cancel the whole thing on 1 single rejected Promise like Promise.all does
        return Promise.allSettled(
            paths.map(async (path) => {
                try {
                    const url = await getDownloadURL(ref(storage, path));
                    return url;
                } catch (e) {
                    console.log("error: ", e);
                    throw e; // Re-throw the error to reject the Promise.
                    // return null; // If we return null, it is a fulfilled Promise with a value of null.
                }
            })
        ).then(downloadURLPromises => {
            downloadURLPromises.forEach(downloadURLPromise => {
                console.log("downloadURLPromise: ", downloadURLPromise)
                if (downloadURLPromise.status == "fulfilled") {
                    console.log("pushing into downloadURLs: ", downloadURLPromise.value)
                    downloadURLs.push(downloadURLPromise.value)
                } else {
                    console.log("Promise rejected: ", downloadURLPromise)
                }
            })
            return downloadURLs;
        })


    }

}

export default FirebaseFunctions;