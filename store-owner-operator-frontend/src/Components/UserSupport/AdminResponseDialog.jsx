import React, {useState, useEffect, useContext, useRef} from "react";
import CustomButton from "../../utilities/CustomButton";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import "../../index.css";
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import storage from "../../firebase";
import TextArea from "../../utilities/TextArea";
import { fetchMessages } from "../../FunctionsAndContexts/UserSupportAPI";
import SendIconButton from '@mui/icons-material/Send';
import useEncodedToken from "../../FunctionsAndContexts/useEncodedToken";
import InputText from "../../utilities/InputText";
import {TopCloseButton, SendMessageComponent} from "./MessageComponents";
import useToken from "../../FunctionsAndContexts/useToken";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import { MainChat } from "./HelperComponents";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function AdminResponseDialog({open, ticketDialog, handleCloseAdminResponseDialog}) {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
    const [messages, setMessages] = useState([]);
    const { encodedToken } = useEncodedToken();
    const [error, setError] = useState(false);
    const {ownerData} = useContext(OwnerVenuesContext);
    const addMessage = (msg) => {
      setMessages(prev => prev.concat([msg]));
    }
    const refreshMessages = () => {
      if (encodedToken && ticketDialog?.ticketId) {
        fetchMessages(ticketDialog?.ticketId, encodedToken).then(arr => {
          if (Array.isArray(arr)) {

            console.log(arr)
            setMessages(arr);
          } else {
            throw new Error();
          }
        }).catch(error => {
          setError(true);
          setTimeout(() => {
            setError(false)
          }, 5000);
        })
      }
    }
    useEffect(() => {
      refreshMessages();
    }, [ticketDialog])
    return (
      <>
        
        <Dialog open={open} 
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleCloseAdminResponseDialog}> 
                <Snackbar
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  open={error}
                  onClose={(e) => setError(false)}
                  message="Error"
                  key={"top" + "center"}
                >
                  <Alert severity="error">Error in Retrieving Messages</Alert>
                </Snackbar>
          <TopCloseButton handleCloseAdminResponseDialog={handleCloseAdminResponseDialog}></TopCloseButton>
          <DialogContent>
            <MainChat 
            messages={messages}
            ticketDialog={ticketDialog}
            user={ownerData} />
          </DialogContent>
            <SendMessageComponent
              ticketId={ticketDialog?.ticketId}
              refreshMessages={refreshMessages}
            />
        </Dialog>
      </>
    );
  }