import TransactionListing from "./TransactionPage"
import {SnackbarProvider} from '../FunctionsAndContexts/SnackbarContextProvider';
export default function TransactionWrapped() {
    return (
        <SnackbarProvider>
            <TransactionListing>
            </TransactionListing>
        </SnackbarProvider>
    );
}