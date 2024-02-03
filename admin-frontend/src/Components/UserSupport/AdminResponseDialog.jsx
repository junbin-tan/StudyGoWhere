import React, {useState, useEffect, useContext, useRef} from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import "../../index.css";
import { fetchMessages } from "../../Helpers/UserSupportAPI";
import {TopCloseButton, SendMessageComponent} from "./MessageComponents";
import { MainChat } from "./HelperComponents";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { UserContext } from "../../Helpers/UserProviderContext";
import useEncodedToken from "../../Helpers/useEncodedToken";
import jwt_decode from "jwt-decode";

export default function AdminResponseDialog({open, ticketDialog, handleCloseAdminResponseDialog}) {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
    const [messages, setMessages] = useState([]);
    const { encodedToken } = useEncodedToken();
    const [error, setError] = useState(false);
    const addMessage = (msg) => {
      setMessages(prev => prev.concat([msg]));
    }
    console.log(jwt_decode(encodedToken))
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
            user={jwt_decode(encodedToken)} />
          </DialogContent>
            <SendMessageComponent
              ticketId={ticketDialog?.ticketId}
              refreshMessages={refreshMessages}
            />
        </Dialog>
      </>
    );
  }