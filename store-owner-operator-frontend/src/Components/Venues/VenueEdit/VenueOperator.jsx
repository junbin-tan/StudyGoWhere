import React, { useContext, useState } from "react";
import BodyCard from "../../CommonComponents/Card/BodyCard";
import { Button, Checkbox, TextField } from "@mui/material";
import ButtonStyles from "../../../utilities/ButtonStyles";
import { FormAndFormErrorsContext } from "../../../FunctionsAndContexts/FormAndFormErrorsContext";
import FieldLabel from "../../CommonComponents/Form/FieldLabel";
import CustomSwitch from "../../../utilities/CustomSwitch";
import FieldInfo from "../../CommonComponents/Form/FieldInfo";
import ButtonClassSets from "../../../utilities/ButtonClassSets";

export default function VenueOperator({
  formData,
  setFormKeyValue,
  formErrorsData,
  handleChange,
  isAddingVenue = false,
  hasSubmitButton = true,
}) {
  // IIFE to set the initial state of isOperatorEnabled
  const [isOperatorEnabled, setIsOperatorEnabled] = useState(
    (() => {
      if (isAddingVenue) return false;
      else return formData?.operator?.enabled;
    })()
  );

  const { form, formErrors } = useContext(FormAndFormErrorsContext);
  const [tempUsername, setTempUsername] = useState(
    form.getObj().operator.username
  );
  const [tempPassword, setTempPassword] = useState(
    form.getObj().operator.password
  );

  const handleOperatorDisablingForAddVenue = () => {
    const newOperatorEnabledStatus = !isOperatorEnabled;
    setIsOperatorEnabled(newOperatorEnabledStatus);
    if (newOperatorEnabledStatus == false) {
      form.setKeyValue("operator.username", null); // technically clears the form data, but because its null its not reflected in the input field
      form.setKeyValue("operator.password", null);

      // Setting the formErrors to false, because we want to allow user to submit form without operator details
      formErrors.setKeyValue("operator.username", false);
      formErrors.setKeyValue("operator.password", false);
    } else {
      // set back the tempUsername and tempPassword to the form
      const fakeUsernameEvent = {
        target: {
          name: "operator.username",
          value: tempUsername,
        },
      };
      const fakePasswordEvent = {
        target: {
          name: "operator.password",
          value: tempPassword,
        },
      };

      handleChange(fakeUsernameEvent);
      handleChange(fakePasswordEvent);
    }
    console.log("addVenue handleOperator... fn called");
    // side-note: actually another way we can "signal" to the backend that we are not creating a new operator
    // is to set the operator.enabled to false, similar to whats done with EditVenue. but its ok
  };

  const handleOperatorDisablingForEditVenue = () => {
    console.log("handleOperatorDisabling is called");

    const newOperatorEnabledStatus = !isOperatorEnabled;
    setIsOperatorEnabled(newOperatorEnabledStatus);
    if (newOperatorEnabledStatus == false) {
      form.setKeyValue("operator.enabled", false);

      // we want to allow user to submit form even if he enters gibberish, since he disabled the operator anyway?
      // we can also set the inputs as empty ourselves, but quite meaningless since result is the same anyway
      formErrors.setKeyValue("operator.username", false);
      formErrors.setKeyValue("operator.password", false);
    } else {
      const fakeUsernameEvent = {
        target: {
          name: "operator.username",
          value: tempUsername,
        },
      };
      const fakePasswordEvent = {
        target: {
          name: "operator.password",
          value: tempPassword,
        },
      };

      handleChange(fakeUsernameEvent);
      handleChange(fakePasswordEvent);
      form.setKeyValue("operator.enabled", true);
    }

    console.log("editVenue handleOperator... fn called");
  };

  return (
    <BodyCard>
      <div className="flex flex-col gap-8 xl:gap-10">
        <div className="flex flex-col gap-2">
          <div
            id={"enable-operator"}
            className={" flex flex-row items-center gap-3"}
          >
            <CustomSwitch
              checked={isOperatorEnabled}
              value={"operatorEnabled"} // adding this so React doesn't complain about uncontrolled component
              onChange={
                isAddingVenue
                  ? handleOperatorDisablingForAddVenue
                  : handleOperatorDisablingForEditVenue
              }
            />
            {/* <Checkbox
            checked={isOperatorEnabled}
            value={"operatorEnabled"} // adding this so React doesn't complain about uncontrolled component
            onChange={
              isAddingVenue
                ? handleOperatorDisablingForAddVenue
                : handleOperatorDisablingForEditVenue
            }
          /> */}
            <p className={""}> Enable Operator </p>
          </div>

          <FieldInfo>Operator has limited access only to this venue.</FieldInfo>
        </div>

        <div id="Operator details div" className="space-y-5">
          <div id="Operator username input div" className={"flex flex-col"}>
            <FieldLabel htmlFor={"operator.username"}>
              Operator Username
            </FieldLabel>
            <TextField
              className="col-span-1 md:col-span-2"
              name="operator.username"
              autoComplete={"new-password"} // this is to stop browser from autofilling
              disabled={!isOperatorEnabled}
              // label="Operator Username" // do we want this? dunno
              required
              value={formData?.operator?.username}
              placeholder={"Enter operator username"}
              onChange={(e) => {
                handleChange(e);
                setTempUsername(e.target.value);
              }}
              error={formErrorsData?.operator?.username}
              helperText={(() => {
                if (formErrorsData?.operator?.username == "empty") {
                  return "Operator username cannot be empty";
                } else if (formErrorsData?.operator?.username == "tooLong") {
                  return "Operator username is too long!";
                } else if (formErrorsData?.operator?.username) {
                  return "Some other error lol";
                } else {
                  return "";
                }
              })()}
            />
          </div>
          <div id={"Operator password input div"} className="flex flex-col ">
            <FieldLabel htmlFor={"operator.password"}>
              Operator Password
            </FieldLabel>
            <TextField
              className="col-span-1 md:col-span-2"
              type="password"
              autoComplete={"new-password"}
              name="operator.password"
              disabled={!isOperatorEnabled}
              // label="Operator Username" // do we want this? dunno
              value={formData?.operator?.password}
              placeholder={
                isAddingVenue
                  ? "Enter operator password"
                  : "Leave blank to keep the same password"
              }
              onChange={(e) => {
                handleChange(e);
                setTempPassword(e.target.value);
              }}
              error={formErrorsData?.operator?.password}
              helperText={(() => {
                if (formErrorsData?.operator?.password == "tooLong") {
                  return "Operator password is too long!";
                } else if (formErrorsData?.operator?.password == "empty") {
                  return "Operator password is empty!";
                  //^ this should only happen if isAddingVenue is true, error setting is handled in AddVenuePage
                  // } else if (formErrors?.operator?.password) {
                  //   return "some other error";
                } else if (formErrorsData?.operator?.password == "invalid") {
                  return "Password must be at least 8 characters with at least 1 uppercase, 1 lowercase, 1 numeric character";
                } else {
                  return "";
                }
              })()}
              ype="password"
            />
          </div>
        </div>
        {hasSubmitButton && (
          <div className="col-span-3 grid md:grid-cols-3 items-center">
            <div className="col-span-3 justify-self-end">
              <Button type="submit" className={ButtonClassSets.primary}>
                Save
              </Button>
            </div>
          </div>
        )}

        {/*<Button onClick={() => console.log(form.getObj())}>*/}
        {/*  {" "}*/}
        {/*  log form data*/}
        {/*</Button>*/}
      </div>
    </BodyCard>
  );
}
