import ButtonStyles from "../../../utilities/ButtonStyles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";

// When using this component, user need to define his own boolean useState outside.

// const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

// const handleCloseConfirmModal = () => {
//     setIsConfirmModalOpen(false);
// };

// The confirmButtonType can be set as "submit" to call the fn defined in a form's onSubmit
// default callback fn is nothing, in case the modal is used for other purposes
export default function ErrorModal({
    open = false,
    onClose = () => {},
    onSubmit = (event) => {event.preventDefault()},
    closeButtonStyle = ButtonStyles.delete,
    headerText = "headerText",
    bodyText = "bodyText",
    closeButtonText = "Close",
    closeButtonCallbackFn = () => {},
    isCloseButtonSubmit = false
}) {
    return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{headerText}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{bodyText}</DialogContentText>
                </DialogContent>
                    <form onSubmit={onSubmit}>
                <DialogActions spacing={10}>
                    <Button onClick={closeButtonCallbackFn} type={isCloseButtonSubmit ? "submit" : "button"} color="primary"
                    style={closeButtonStyle}>
                        {closeButtonText}
                    </Button>
                </DialogActions>
                    </form>
            </Dialog>
    );
}
