import React, {useState, useEffect} from "react";
import CustomButton from "../../utilities/CustomButton";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import "../../index.css";
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import storage from "../../firebase";
export default function ImageDialog({paths, open, handleOpen, handleClose}) {
    const [firebaseURL, setFirebaseURL] = useState([]);

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
          console.log(urls);
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
            <CustomButton label={"Close"} onClick={handleClose}></CustomButton>
          </DialogActions>
        </Dialog>
      </>
    );
  }