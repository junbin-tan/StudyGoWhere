import React, {useState, useEffect} from "react";
import TextField from '@mui/material/TextField';
import CustomButton from "../../utilities/CustomButton";
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import "../../index.css";
import { createTicket } from "../../FunctionsAndContexts/UserSupportAPI";
import useToken from "../../FunctionsAndContexts/useToken";
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import storage from "../../firebase";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { v4 as uuidv4 } from 'uuid';
import InputText from "../../utilities/InputText";
import TextArea from "../../utilities/TextArea";
import useEncodedToken from "../../FunctionsAndContexts/useEncodedToken";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import ButtonClassSets from "../../utilities/ButtonClassSets";
export default function CreateTicketForm({onInputChange, ticket, searchTickets, clearForm, onImageChange, handleUploadError}) {
    const [open, setOpen] = React.useState(false);
    const [uploaded, setUploaded] = useState(false);
    const {encodedToken} = useEncodedToken();
    const [snackbar, setSnackbar] = useState({
      open : false,
      label : "",
      type : "error"
    })
    const snackbarClose = {
      open : false,
      label : "",
      type : "success"
    }
    const snackbarSuccess = {
      open : true,
      label : "Ticket Created",
      type : "success"
    }
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };

    const categoryOptions = [
      {label : "Account", value : "ACCOUNT"},
      {label : "Finance", value : "FINANCE"},
      {label : "Booking", value : "BOOKING"},
      {label : "Voucher", value : "VOUCHER"},
      {label : "Others", value : "OTHERS"}
    ]
  
    const handleClose = () => {
      clearForm();
      setOpen(false);
      setSubmitted(false);
      setUploaded(false);
      setLoading(false);
    };
    const validateTicket = (ticket) => {
      if (!ticket.subject || ticket.subject.length > 256) {
        console.log("NO")
        return false;
      } else if (ticket.description.length > 1000) {
        console.log("NO2")
        return false;
      } else if (!ticket.ticketCategory) {
        return false;
      }
      return true;
    }
    const handleCreate = (e) => {
      e.preventDefault();
      setSubmitted(true);
      console.log(ticket)
      if (validateTicket(ticket)) {
        console.log("CREATE TICKET")
        createTicket(ticket, encodedToken)
          .then(res => {
            setSnackbar(snackbarSuccess);
            searchTickets();
          }).catch(error => {
            const snackbarError = {
              open : true,
              label : error.message,
              type : "error"
            }
            setSnackbar(snackbarError);
          }).finally(() => {
            handleClose();
          })
      }
    }
    const VisuallyHiddenInput = styled('input')({
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    });
    
    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbar(snackbarClose);
    };
    const uploadImage = async (event) => {
        setLoading(true)
        const promiseArr = [];
        const pathArr = [];
        const files = event.target.files;

        for (const file of files) {
          const path = 'ticket-images/' + uuidv4();
          const imageRef = ref(storage, path);
          const promise = uploadBytes(imageRef, file);
          promiseArr.push(promise);
          pathArr.push(path);
        }

        Promise.all(promiseArr).then((res) => {
          setUploaded(true);
          onImageChange(pathArr);
        }).catch(error => {
          handleUploadError();
        }).finally(() => {
          setLoading(false);
        })
      };
  
    return (
      <>
        <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={snackbar.open}
              autoHideDuration={5000}
              onClose={handleCloseSnackbar}
              message={snackbar.type}
              key={"top" + "center2"}
              > 
              <Alert severity={snackbar.type} onClose={handleCloseSnackbar}>{snackbar.label}</Alert>
        </Snackbar>
        <CustomButton label={"Add Ticket"} onClick={handleClickOpen}>
          Add Ticket
        </CustomButton>
        <Dialog open={open} 
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleClose}>
          <form onSubmit={handleCreate}>
          <DialogContent>
            <h1 className='text-xl font-bold mb-4'>Create a New Ticket</h1>
            <InputText 
              label={"Subject"} 
              field={"subject"} 
              value={ticket.subject}
              onInputChange={onInputChange}
              validationFunction={!(submitted && !ticket.subject)}
              validationRequirements={"must be between 1-256 char."}
            />
            <TextArea 
              label={"Description"} 
              field={"description"} 
              value={ticket.description}
              onInputChange={onInputChange}
              validationFunction={!(submitted && ticket.description && ticket.description.length > 1000)}
              validationRequirements={"must be between 0-1000 char."}
            />   
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ticket.category}
                label="Category"
                onChange={(e) => onInputChange("ticketCategory", e)}
              >
              {categoryOptions.map(opt => {
                return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>;
              })}
              </Select>
              {submitted && !ticket?.ticketCategory && <FormHelperText error>Category is required</FormHelperText>}
            </FormControl>         
            <div className='grid grid-cols-3 text-center items-center justify-items-center m-4'>
              <div></div>
              <div>
                {!loading && <Button component="label" variant="contained" className={'bg-custom-yellow text-center font-medium'}
                sx={{ marginTop: 2 }}
                startIcon={<CloudUploadIcon />}>
                  Upload image  {uploaded &&  <CheckBoxIcon/>}
                  <VisuallyHiddenInput type="file" onChange={uploadImage} multiple />
                </Button> }
                {loading &&  <CircularProgress />}
              </div>
              <div></div>
            </div>
          </DialogContent>
          <DialogActions>
            <CustomButton label={"Cancel"} onClick={handleClose}></CustomButton>
            <CustomButton label={"Create"} buttonType={"submit"}></CustomButton>
          </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }