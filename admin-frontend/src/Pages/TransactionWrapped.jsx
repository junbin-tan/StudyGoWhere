import { SnackbarProvider } from "../Helpers/SnackbarContext";
import TransactionListing from "./TransactionPage"
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

export default function TransactionWrapped() {
    return (
        <SnackbarProvider>
            <TransactionListing>
            </TransactionListing>
        </SnackbarProvider>
    );
}