export default function camelCaseToCapitalized(input) {
    // Replace all capital letters with a space followed by the same letter
    // Use a regular expression to match capital letters
    return input.replace(/([A-Z])/g, ' $1')
        // Capitalize the first letter of the resulting string
        .replace(/^./, function(str) {
            return str.toUpperCase();
        });
}

// Example usage:
const input = "camelCase";
const result = camelCaseToCapitalized(input);
console.log(result); // "Camel Case"
