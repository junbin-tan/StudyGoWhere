import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SnackbarTopCenter({open, setOpen, message, severity = "success", autoHideDuration = 5000, ...rest}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            {...rest}
        >
            <Alert onClose={() => setOpen(false)} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )

}