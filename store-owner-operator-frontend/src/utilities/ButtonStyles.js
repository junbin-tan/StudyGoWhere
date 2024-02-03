const ButtonStyles = {
    default: {
        backgroundColor: "var(--custom-yellow)",
        color: "white",
        fontSize: "16px",
        fontWeight: "500",
        fontFamily: "Montserrat",
    },
    disabled: {
        backgroundColor: "gray",
        color: "white",
        fontSize: "16px",
        fontWeight: "500",
        fontFamily: "Montserrat",
        cursor: "not-allowed",
    },
    back: {
        backgroundColor: "white",
        color: "var(--custom-yellow)",
        fontSize: "16px",
        fontWeight: "500",
        fontFamily: "Montserrat",
        border: "2px solid var(--custom-yellow)",
        borderRadius: "16px",
    },
    delete: {
        backgroundColor: "red",
        color: "white",
        fontSize: "16px",
        fontWeight: "500",
        fontFamily: "Montserrat",
    },
    success: { backgroundColor: "rgb(34 197 94)",
        color: "white",
        fontSize: "16px",
        fontWeight: "500",
        fontFamily: "Montserrat",
    },
    selected: {
        backgroundColor: "var(--light-red)", // Change the background color for selected buttons
        color: "var(--custom-yellow)", // Text color
        fontSize: "16px", // Font size
        fontWeight: "600", // Font weight
        fontFamily: "Montserrat", // Font family
        border: "3px solid var(--custom-yellow)", // Border
        // You can add more custom styles for selected buttons here
    },
};

export default ButtonStyles;
