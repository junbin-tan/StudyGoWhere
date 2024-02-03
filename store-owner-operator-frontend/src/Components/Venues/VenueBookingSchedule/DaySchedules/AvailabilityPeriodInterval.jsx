import ButtonClassSets from "../../../../utilities/ButtonClassSets";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import AvailabilityPeriodClassSets from "./AvailabilityPeriodClassSets";
import ConfirmModalV2 from "../../../CommonComponents/Modal/ConfirmModalV2";
import FieldLabel from "../../../CommonComponents/Form/FieldLabel";
import SnackbarContext from "../../../../FunctionsAndContexts/SnackbarContext";
import { LoginTokenContext } from "../../../../FunctionsAndContexts/LoginTokenContext";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import FormControlLabelWrapper from "../../../CommonComponents/Form/FormControlLabelWrapper";
import NewAvailabilityPeriodInfo from "./helpers/NewAvailabilityPeriodInfo";

export default function AvailabilityPeriodInterval({
  children,
  availabilityPeriodIntervalData,
  intervalStartGrid = 1,
  intervalEndGrid = 1,
  tableTypeDayAvailabilityId,
  dispatch,
  isTemplate,
}) {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const { setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity } =
    useContext(SnackbarContext);

  const [editedAvailabilityPeriodForm, setEditedAvailabilityPeriodForm] =
    useState({
      id: availabilityPeriodIntervalData.id,
      fromTime: availabilityPeriodIntervalData.fromTime,
      toTime: availabilityPeriodIntervalData.toTime,
      numAvailable: availabilityPeriodIntervalData.numAvailable,
      overrideDefaultPrice: availabilityPeriodIntervalData.overrideDefaultPrice,
      basePrice: availabilityPeriodIntervalData.basePrice,
      pricePerHalfHour: availabilityPeriodIntervalData.pricePerHalfHour,
    });

  const [
    editedAvailabilityPeriodFormErrors,
    setEditedAvailabilityPeriodFormErrors,
  ] = useState(NewAvailabilityPeriodInfo.defaultFormErrorsObject);

  const handleEditedAPFormChange = (event) => {
    let { name, value } = event.target;
    if (name == "numAvailable") {
      value = Number(value);
    }
    if (name == "basePrice" || name == "pricePerHalfHour") {
      value = Number(value) * 100;
    }

    setEditedAvailabilityPeriodForm({
      ...editedAvailabilityPeriodForm,
      [name]: value,
    });
    console.log("editedAvailabilityPeriodForm", editedAvailabilityPeriodForm);

    console.log("validating form...");
    // validation
    // TODO: validate the numerical fields; HOWEVER, since the TextField helps us restrict user input, i'm skipping it here
    if (name == "fromTime") {
      console.log("validating fromTime...");
      if (
        dayjs(`1970-01-01 ${value}`).isAfter(
          dayjs(`1970-01-01 ${editedAvailabilityPeriodForm.toTime}`)
        )
      ) {
        setEditedAvailabilityPeriodFormErrors({
          ...editedAvailabilityPeriodFormErrors,
          fromTime: true,
          toTime: true,
        });
      } else {
        setEditedAvailabilityPeriodFormErrors({
          ...editedAvailabilityPeriodFormErrors,
          fromTime: false,
          toTime: false,
        });
      }
    } else if (name == "toTime") {
      console.log("validating toTime...");
      if (
        dayjs(`1970-01-01 ${value}`).isBefore(
          dayjs(`1970-01-01 ${editedAvailabilityPeriodForm.fromTime}`)
        )
      ) {
        setEditedAvailabilityPeriodFormErrors({
          ...editedAvailabilityPeriodFormErrors,
          fromTime: true,
          toTime: true,
        });
      } else {
        setEditedAvailabilityPeriodFormErrors({
          ...editedAvailabilityPeriodFormErrors,
          fromTime: false,
          toTime: false,
        });
      }
    }

    console.log(
      "editedAvailabilityPeriodFormErrors",
      editedAvailabilityPeriodFormErrors
    );
  };

  const handleSaveAvailabilityPeriod = () => {
    if (
      Object.keys(editedAvailabilityPeriodFormErrors).some(
        (key) => editedAvailabilityPeriodFormErrors[key]
      )
    ) {
      console.log("errors in form, not submitting");
      // setOpenSnackbar(true);
      // setSnackbarSeverity("error");
      // setSnackbarMessage("Error editing availability period");
      return;
    }

    console.log(
      "no errors in form, calling dispatch with AP form:",
      editedAvailabilityPeriodForm
    );
    dispatch({
      type: "EDIT_AVAILABILITY_PERIOD_TO_TABLE_TYPE_DAY_AVAILABILITY",
      payload: {
        tableTypeDayAvailabilityId: tableTypeDayAvailabilityId,
        availabilityPeriod: editedAvailabilityPeriodForm,
        isTemplate: isTemplate,
      },
    });
    setIsConfirmModalOpen(false);
    setOpenSnackbar(true);
    setSnackbarSeverity("success");
    setSnackbarMessage("Successfully edited availability period");
  };

  const handleDeleteAvailabilityPeriod = () => {
    console.log(
      "deleting availability period with id: ",
      availabilityPeriodIntervalData.id
    );
    dispatch({
      type: "DELETE_AVAILABILITY_PERIOD_FROM_TABLE_TYPE_DAY_AVAILABILITY",
      payload: {
        tableTypeDayAvailabilityId: tableTypeDayAvailabilityId,
        availabilityPeriod: editedAvailabilityPeriodForm,
        isTemplate: isTemplate,
      },
    });
    setIsConfirmDeleteModalOpen(false);
    // setOpenSnackbar(true);
    // setSnackbarSeverity("success");
    // setSnackbarMessage("Successfully deleted availability period");
  }
  const DeleteButton = () => {
    return (
      <>
        <div>
          <Button
            variant={" justify-self-start"}
            className={ButtonClassSets.danger + " justify-self-start"}
            onClick={() => setIsConfirmDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
        <ConfirmModalV2
          open={isConfirmDeleteModalOpen}
          onClose={() => setIsConfirmDeleteModalOpen(false)}
          confirmButtonCallbackFn={handleDeleteAvailabilityPeriod}
          backButtonCallbackFn={() => setIsConfirmDeleteModalOpen(false)}
          headerText="Delete Availability Period?"
        >
          <p className="text-center font-bold">
            Are you sure you want to delete this availability period?
          </p>
          <p>
            This can be undone by exiting the page without saving the day
            schedule.
          </p>
        </ConfirmModalV2>
      </>
    );
  };

  return (
    <>
      <button
        key={availabilityPeriodIntervalData.id}
        className={
          AvailabilityPeriodClassSets.primary +
          " overflow-visible flex flex-col items-center text-xs justify-start pointer-events-auto py-4 hover:bg-custom-yellow hover:text-white duration-300 ease-in"
          // `col-[span_${intervalUnits}]`
          // "col-[span_8]"
          // `col-[span_${intervalUnits}]`
          // `${colStartAndEndClass}`
        }
        style={{
          gridColumnStart: intervalStartGrid,
          gridColumnEnd: intervalEndGrid,
        }}
        onClick={() => setIsConfirmModalOpen(true)}
      >
        {/*{console.log("intervalLength", intervalLength)}*/}

          <p>T: {availabilityPeriodIntervalData.numAvailable} </p>
            {availabilityPeriodIntervalData.overrideDefaultPrice && (
                <>
                    <p>B: {availabilityPeriodIntervalData.basePrice / 100}</p>
                    <p>H: {availabilityPeriodIntervalData.pricePerHalfHour / 100}</p>
                </>
            )}
          {children}
        </button>

      <ConfirmModalV2
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        confirmButtonCallbackFn={handleSaveAvailabilityPeriod}
        backButtonCallbackFn={() => setIsConfirmModalOpen(false)}
        headerText="Edit Availability Period"
        leftSideActions={<DeleteButton />}
      >
        {/*MAKE THE TIMES UNCHANGEABLE FOR NOW... LATER WE CAN ADD THE ABILITY TO CHANGE...?*/}
        <div className={"flex flex-row"}>
          <div>
            <FieldLabel>From: </FieldLabel>
            <TimePicker
              minutesStep={30}
              value={dayjs(
                `1970-01-01 ${editedAvailabilityPeriodForm.fromTime}`
              )} // converting date to dayjs obj
              onChange={(newToTime) =>
                handleEditedAPFormChange({
                  target: {
                    name: "fromTime",
                    value: newToTime.format("HH:mm"),
                  },
                })
              }
            />
            {editedAvailabilityPeriodFormErrors.fromTime && (
              <p style={{ color: "red" }}>
                {' "From" time is later than "To" time! '}
              </p>
            )}
          </div>
          <div>
            <FieldLabel>To: </FieldLabel>
            <TimePicker
              minutesStep={30}
              value={dayjs(`1970-01-01 ${editedAvailabilityPeriodForm.toTime}`)}
              onChange={(newToTime) =>
                handleEditedAPFormChange({
                  target: { name: "toTime", value: newToTime.format("HH:mm") },
                })
              }
            />
            {editedAvailabilityPeriodFormErrors.fromTime && (
              <p style={{ color: "red" }}>
                {' "To" time is earlier than "From" time! '}
              </p>
            )}
          </div>
        </div>

        <div className={"flex flex-col"}>
          <FieldLabel htmlFor="numAvailable">
            Number of tables available:{" "}
          </FieldLabel>
          <TextField
            id="numAvailable"
            name={"numAvailable"}
            type={"number"}
            value={editedAvailabilityPeriodForm.numAvailable}
            inputProps={{ min: 0 }}
            onChange={handleEditedAPFormChange}
            error={editedAvailabilityPeriodFormErrors.numAvailable}
            helperText={
              editedAvailabilityPeriodFormErrors.numAvailable &&
              "Please input a valid number of tables."
            }
          />
        </div>

        <div className={""}>
          {/*<FieldLabel htmlFor="overrideDefaultPrice">Override default price?</FieldLabel>*/}
          <FormControlLabelWrapper
            value={"overrideDefaultPrice"}
            label={"Override Table's Default Price?"}
            checked={editedAvailabilityPeriodForm.overrideDefaultPrice}
            handleOnClick={() =>
              setEditedAvailabilityPeriodForm({
                ...editedAvailabilityPeriodForm,
                overrideDefaultPrice:
                  !editedAvailabilityPeriodForm.overrideDefaultPrice,
              })
            }
          ></FormControlLabelWrapper>
        </div>

        <div className={"flex flex-col"}>
          <FieldLabel htmlFor="basePrice">Base Price: </FieldLabel>
          <TextField
            id="basePrice"
            name="basePrice"
            type={"number"}
            disabled={!editedAvailabilityPeriodForm.overrideDefaultPrice}
            value={editedAvailabilityPeriodForm.basePrice / 100}
            onChange={handleEditedAPFormChange}
            inputProps={{ min: 0 }}
            error={editedAvailabilityPeriodFormErrors.basePrice}
            helperText={
              editedAvailabilityPeriodFormErrors.basePrice &&
              "Please input a valid price."
            }
          />
        </div>

        <div className="flex flex-col">
          <FieldLabel htmlFor="pricePerHalfHour">
            Price Per Half Hour:
          </FieldLabel>
          <TextField
            id="pricePerHalfHour"
            name="pricePerHalfHour"
            type={"number"}
            disabled={!editedAvailabilityPeriodForm.overrideDefaultPrice}
            inputProps={{ min: 0 }}
            value={editedAvailabilityPeriodForm.pricePerHalfHour / 100}
            onChange={handleEditedAPFormChange}
            error={editedAvailabilityPeriodFormErrors.pricePerHalfHour}
            helperText={
              editedAvailabilityPeriodFormErrors.pricePerHalfHour &&
              "Please input a valid price."
            }
          />
        </div>
      </ConfirmModalV2>
    </>
  );
}
