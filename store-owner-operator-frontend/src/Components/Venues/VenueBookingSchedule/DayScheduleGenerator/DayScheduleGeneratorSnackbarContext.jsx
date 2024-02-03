import {createContext} from "react";
const DayScheduleGeneratorSnackbarContext = createContext();
// use it like:
// SnackbarContext.Provider value={{snackbarState, setSnackbarState, severity, setSeverity, snackbarMessage, setSnackbarMessage}}>
export default DayScheduleGeneratorSnackbarContext;
