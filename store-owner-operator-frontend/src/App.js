import React from 'react'
import "./App.css";
import "./index.css";
import EndPoints from "./EndPoints";
import { LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

const App = () => {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <EndPoints/>
    </LocalizationProvider>
    </>

  )
}

export default App