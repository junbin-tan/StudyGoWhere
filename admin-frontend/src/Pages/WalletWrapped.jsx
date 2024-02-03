import { SnackbarProvider } from "../Helpers/SnackbarContext";
import TransactionListing from "./TransactionPage"
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { WalletListing } from "./WalletPage";
export default function WalletWrapped() {
    return (
        <SnackbarProvider>
            <WalletListing>
            </WalletListing>
        </SnackbarProvider>
    );
}