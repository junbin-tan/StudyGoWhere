import ButtonStyles from "../../../utilities/ButtonStyles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ButtonClassSets from "../../../utilities/ButtonClassSets";

// When using this component, user need to define his own boolean useState outside.

// const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

// const handleCloseConfirmModal = () => {
//     setIsConfirmModalOpen(false);
// };

// The confirmButtonType can be set as "submit" to call the fn defined in a form's onSubmit
// default callback fn is nothing, in case the modal is used for other purposes
export default function ConfirmModalV2({
  open = false,
  onClose = () => {},
  onSubmit = (event) => {
    event.preventDefault();
  },
  confirmButtonClassName = ButtonClassSets.primary,
  backButtonClassName = ButtonClassSets.secondary,
  confirmButtonStyle = {},
  backButtonStyle = {},
  headerText = "",
  bodyText = "",
  confirmButtonText = "Confirm",
  backButtonText = "Back",
  confirmButtonCallbackFn = () => {},
  backButtonCallbackFn = () => {},
  isConfirmButtonSubmit = false,
  children,
  paperClassName = "px-4 py-4",
  leftSideActions = null, // this is for a very very specific use case, just ignore this if u dk what it is
    renderConfirmButton = true,
  renderBackButton = true,
  className,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: paperClassName }}
      className={className}
    >
      <DialogTitle>{headerText}</DialogTitle>
      <DialogContent>
        <DialogContentText>{bodyText}</DialogContentText>
        {children}
      </DialogContent>
      <form onSubmit={onSubmit}>
        <DialogActions spacing={10}>
          {leftSideActions && (
            <div className="flex flex-row">{leftSideActions}</div>
          )}
          {renderConfirmButton && (
          <Button
            variant={"contained"}
            onClick={confirmButtonCallbackFn}
            type={isConfirmButtonSubmit ? "submit" : "button"}
            className={confirmButtonClassName}
            style={confirmButtonStyle} // this is nth by default, the default className is applied instead
          >
            {confirmButtonText}
          </Button>)
          }
          {renderBackButton && (
            <Button
              variant={"contained"}
              onClick={backButtonCallbackFn}
              color="primary"
              className={backButtonClassName}
              style={backButtonStyle}
              sx={{ border: "2px solid" }}
            >
              {backButtonText}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
