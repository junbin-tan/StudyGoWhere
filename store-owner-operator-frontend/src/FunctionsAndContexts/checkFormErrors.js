export default function checkFormErrors(name, value, errorFormSetKeyValue) {

    // i know dynamic typing is kinda discouraged but its quite useful here
    // we can define multiple "types" of errors with strings, and handle them accordingly.
    // an empty string will evaluate to false in a boolean context, so we can use that to our advantage
    // can also use empty string "" as the value of errorType, but I find that false is clearer
    // (although the React console will complain about it, its just a warning and not an error)


    // in forms, we can use IIFE (immediately invoked function expressions) to define multiple if statements
    // (since JSX doesn't allow conditionals other than && and ternary ?: expressions in the return statement)

    let errorType = false;
    switch (name) {
        case "venueName": // venue name cannot be empty
            if (value.trim() == "") errorType = "empty";
            if (value.length > 255) errorType = "tooLong";
            errorFormSetKeyValue(name, errorType)
            break;
        case "address.address": // address cannot be empty
            if (value.trim() == "") errorType = "empty";
            if (value.length > 255) errorType = "tooLong";
            errorFormSetKeyValue(name, errorType)
            break;
        case "address.postalCode": // postal code must be 6 digits
            errorFormSetKeyValue(name, !/^\d{6}$/.test(value));
            break;
        case "phoneNumber": // phone number must be 8 digits
            errorFormSetKeyValue(name, !/^\d{8}$/.test(value));
            break;
        case "description": // description cannot be empty
            if (value.trim() == "") errorType = "empty";
            if (value.length > 510) errorType = "tooLong";
            errorFormSetKeyValue(name, errorType)
            break;
        case "operator.username":
            if (value.trim() == "") errorType = "empty";
            if (value.length > 255) errorType = "tooLong";
            errorFormSetKeyValue(name, errorType)
            break;
        case "operator.password":
            if (value.length > 255) errorType = "tooLong";
            errorFormSetKeyValue(name, errorType)
            break;
        case "averagePrice":
            if (value == undefined) errorType = "empty"; // double == is intentional, covers null and undefined
            if (!(value >= 1 && value <= 5)) errorType = "valueOutOfRange";
            errorFormSetKeyValue(name, errorType)
            break;
        default:
            errorFormSetKeyValue(name, errorType); // if no error is found, set error to false?? should we set to true instead?
            break;

    }

}