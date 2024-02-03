import React, {useContext, createContext, useReducer} from "react"
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { SnackbarContext } from "./SnackbarContextOrigin";
export const SnackbarProvider = ({children}) => {
    const {snackbar, snackbarDispatch} = useSnackbar();
    return <SnackbarContext.Provider value={{snackbar, snackbarDispatch}}>
            <Snackbar
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar?.open}
                onClose={(e) => snackbarDispatch({type : "CLOSE"})}
                message={snackbar?.message}
                key={"top" + "center2"}
            >
                <Alert severity={snackbar?.severity}>{snackbar?.message}</Alert>
            </Snackbar>
                {children}
            </SnackbarContext.Provider>

}
export function useSnackbar() {
    const snackbarReducer = (state, action) => {
      console.log(action.type)
        if (action.type === "ERROR") {
            console.log("ERROR DISPATCHED")
          return {
            open : true,
            message : "Error In Performing Action",
            severity : "error"
          }
        } else if (action.type === "SUCCESS") {
          return {
            open : true,
            message : "Action Success",
            severity : "success"
          }
        } else if (action.type === "CLOSE") {
          return {...state, open : false};
        } else {
            console.log("LASTT")
            return {...state};
        }
      }
    const [snackbar, snackbarDispatch] = useReducer(snackbarReducer, {});
  return {snackbar, snackbarDispatch};
}