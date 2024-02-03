import ButtonStyles from "../../../utilities/ButtonStyles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

// When using this component, user need to define his own boolean useState outside.

// const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

// const handleCloseConfirmModal = () => {
//     setIsConfirmModalOpen(false);
// };

// The confirmButtonType can be set as "submit" to call the fn defined in a form's onSubmit
// default callback fn is nothing, in case the modal is used for other purposes
export default function ConfirmModal({
  confirmButtonType = "button",
  confirmButtonStyle = ButtonStyles.default,
  backButtonStyle = ButtonStyles.back,
  headerText = "headerText",
  bodyText = "bodyText",
  confirmButtonCallbackFn = () => {},
  backButtonCallbackFn = () => {},
}) {
  return (
    <>
      <div className="modal-overlay"></div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center inset-0 z-50 bg-lightgray-80 border border-solid border-lightgray-100 px-5 py-10 rounded-lg h-64 w-fit text-center flex flex-col justify-between">
        <h3 className="font-bold text-xl text-custom-yellow">{headerText}</h3>
        <p>{bodyText}</p>

        <Button
          onClick={confirmButtonCallbackFn}
          variant="contained"
          style={confirmButtonStyle}
          type={confirmButtonType}
        >
          Confirm
        </Button>
        <Button
          onClick={backButtonCallbackFn}
          variant="contained"
          style={backButtonStyle}
        >
          Back
        </Button>
      </div>
    </>
  );
}
