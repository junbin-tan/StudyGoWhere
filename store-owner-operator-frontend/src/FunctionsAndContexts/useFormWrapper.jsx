import { useState } from "react";
function getNestedValue(obj, keys) {
  return keys.reduce((currentObj, key) => {
    if (currentObj && key in currentObj) {
      return currentObj[key];
    }
    return undefined; // Key doesn't exist, return undefined
  }, obj);
}
function setNestedValue(obj, keys, value) {
  const clonedObj = { ...obj }; // not deep clone, but don't need it for our context
  let currentLevel = clonedObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in currentLevel)) {
      currentLevel[key] = {}; // if key doesn't exist, create new object
    }
    currentLevel = currentLevel[key];
  }
  currentLevel[keys[keys.length - 1]] = value;
  return clonedObj;
}

function useFormWrapper(initialForm) {
  const [form, setForm] = useState(initialForm);

  const getObj = () => {
    return form;
  };

  const setObj = (updatedForm) => {
    setForm(updatedForm);
    return updatedForm;
  };

  const getKeyValue = (keyFullString) => { // keyFullString is sth like address.addressId
    return getNestedValue(form, keyFullString.split('.'));
  }

  // have to be aware this doesn't rerender components...? or at least its inconsistent
  // why? idk
  const setKeyValue = (keyFullString, value, formObject = form) => {
    const updatedForm = setNestedValue(formObject, keyFullString.split('.'), value);
    setForm(updatedForm);
    return updatedForm;
  };


  return {
    getObj,
    setObj,
    getKeyValue,
    setKeyValue, // use this instead of (name, value) !!
  };
}

export default useFormWrapper;
