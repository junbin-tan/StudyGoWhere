import {createContext} from "react";
const SnackbarContext = createContext();
// use it like:
// SnackbarContext.Provider value={{snackbarState, setSnackbarState, severity, setSeverity, snackbarMessage, setSnackbarMessage}}>
export default SnackbarContext;
