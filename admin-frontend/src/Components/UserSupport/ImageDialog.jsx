import React, {useState, useEffect} from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import "../../index.css";
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import storage from "../../firebase";
export default function ImageDialog({paths, open, handleOpen, handleClose}) {
    const [firebaseURL, setFirebaseURL] = useState([]);
    const title = "Back"
    const buttonClass =
    title === "Back"
      ? "bg-red-400 hover:bg-red-500"
      : "bg-blue-700 hover:bg-blue-800";
    useEffect(() => {
      // Assuming storage is already initialized elsewhere
      Promise.all(paths.map(async (path) => {
          try {
              const url = await getDownloadURL(ref(storage, path));
              return url;
          } catch (error) {
              console.log("Error fetching download URL for", path, ":", error);
              return "null"; // or return a fallback URL or some default value
          }
      })).then(urls => {
          setFirebaseURL(urls);
      });
  }, [paths]); // Re-run the effect whenever 'paths' changes
    return (
      <>
        <Dialog open={open} 
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleClose}>
          <DialogContent>
            <h1 className='text-xl font-bold mb-4'>Images</h1>
            
           {firebaseURL.map((url, idx) => {
            return <div key={url} className='flex flex-col justify-center text-center'>
              <div className='text-center m-8 font-bold'>
              <h2>Image {idx + 1}</h2>
              </div>
              <div>
                <img src={url} alt="Image"/>
              </div>
            </div>
           })
            }
            
          </DialogContent>
          <DialogActions>

    <button
      onClick={handleClose}
      className={`${buttonClass} text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
    >
      {title}
    </button>
         </DialogActions>
        </Dialog>
      </>
    );
  }