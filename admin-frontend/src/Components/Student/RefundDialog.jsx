import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useEncodedToken from '../../Helpers/useEncodedToken';
import React, {useReducer, useContext, useState} from 'react';
import Box from '@mui/material/Box';
import Api from '../../Helpers/Api';
import { useSnackbar } from '../../Helpers/SnackbarContext';
import { SnackbarContent } from '@mui/material';
import { SnackbarContext } from '../../Helpers/SnackbarContextOrigin';

const refundReducer = (state, action) => {
  switch(action.type) {
      case "INPUT_CHANGE":
          return {...state, [action.field] : action.value};
      default : 
          return state;
  }
}
export default function RefundDialog({handleClose, open, student}) {
    const {encodedToken} = useEncodedToken();
    const [submitted, setSubmitted] = useState(false);
    const {snackbarDispatch} = useContext(SnackbarContext);
    const [refund, dispatchRequest] = useReducer(refundReducer, {});
    const fields = [
        {type : "text", id: "refundReason", value : refund?.refundReason, label : "Refund Reason", validation : (value) => true, validationMsg : ""},
        {type : "number", id: "amt", value : refund?.amt, label : "Refund Amount ($)", placeholder : "Enter amount in $", validation : (value) => true, validationMsg : ""},
        {type : "text", id: "confirm", value : refund?.confirm, label : "Confirmation", placeholder : "Type YES to confirm (case sensitive)", validation : (value) => value === "YES", validationMsg : "Confirmation is not valid"},
    ]
    const handleRefund = () => {
        if (refund?.confirm === "YES" && !submitted) {
          setSubmitted(true);
          Api.makePayment({...refund, amt : refund?.amt * 100, userId : student.id}, encodedToken)
          .then(res => {
            if (res.ok) {
              snackbarDispatch({type : "SUCCESS"})
            } else {
              throw new Error();
            }
          }).catch(error => {
              snackbarDispatch({type : "ERROR"})
          }).finally(() => setSubmitted(false))
          handleClose();
        } 
    }
    return (<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth >
    <DialogTitle>Refund</DialogTitle>
    <DialogContent>
      <DialogContentText>
          {"Student Username : " + student?.username}
      </DialogContentText>
      {fields.map(field => {
        return (
            <div key={field.id}>
            <label htmlFor={field.id} className="block my-4 text-lg font-medium ">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={field.value}
              onChange={(e) => dispatchRequest({type : "INPUT_CHANGE", field : e.target.name, value : e.target.value})}
              className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder={field.placeholder ? field.placeholder : ""}
              required
            />
            {submitted && !field.validation(field.id) &&<label htmlFor={field.id} className="block my-4 text-md text-red-500	font-medium">
               {field.validationMsg}
            </label>}
          </div> 
        )
      })}
    </DialogContent>
    <DialogActions>
      <button
        onClick={handleClose}
        className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg text-sm px-3 py-2 m-1 text-center"
      >
        Cancel
      </button>
      <button
        onClick={handleRefund}
        className="bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg text-sm px-3 py-2 m-1 text-center"
      >
        Refund
      </button>        
      </DialogActions>
  </Dialog>)
}