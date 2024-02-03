// all classNames based on tailwind css

const defaultPadding = "px-10 py-3"; // we should use some of this in here if not we have to change all the strings
const defaultDimension = "h-12 max-w-[550px]"; // this is to standardize the height of the buttons
const dayDimension = "h-fit-content max-w-[550px]"; // this is to standardize the height of the buttons
const longDimension = "h-fit-content max-w-[1000px]"; // this is to standardize the height of the buttons
const ButtonClassSets = {
    primary: "items-center flex flex-row gap-3 " +
    defaultDimension + " " +
        "font-medium " +
        "bg-custom-yellow rounded " +
        "text-lg text-white " +
        "px-10 py-3 " +
        "hover:shadow-lg hover:bg-custom-yellow-hover " +
        "ease-in duration-200",
        primary2: "items-center flex flex-row gap-3 " +
    longDimension + " " +
        "font-medium " +
        "bg-custom-yellow rounded " +
        "text-lg text-white " +
        "px-10 py-3 " +
        "hover:shadow-lg hover:bg-custom-yellow-hover " +
        "ease-in duration-200",

    secondary: "items-center flex flex-row gap-3 " +
    defaultDimension + " " +
        "font-medium " +
        "text-lg text-custom-yellow " +
        "bg-white border-2 border-custom-yellow rounded " +
        "px-10 py-3" +
        "hover:shadow-lg hover:bg-custom-yellow hover:text-white " +
        "ease-in duration-200 ",
        secondary2: "items-center flex flex-row gap-3 " +
    longDimension + " " +
        "font-medium " +
        "text-lg text-custom-yellow " +
        "bg-white outline-2 outline-custom-yellow rounded " +
        "px-10 py-4" +
        "hover:shadow-lg hover:bg-custom-yellow hover:text-white " +
        "ease-in duration-200 ",

    danger: "items-center flex flex-row gap-3 " +
        "font-medium " +
        defaultDimension + " " +
        "bg-black rounded " + // experimenting with black, I read an article abt an app's primary color being red 
        "text-lg text-white " +
        "px-10 py-3 " +
        "hover:shadow-lg hover:bg-red-600 " +
        "ease-in duration-200",

    dangerRounded: "items-center flex flex-row gap-3 " +
        "font-medium " +
        defaultDimension + " " +
        "bg-red-500 rounded-full " +
        "text-lg text-white " +
        "px-8 py-3 " +
        "hover:shadow-lg hover:bg-red-600 " +
        "ease-in duration-200 ",

    success: "items-center flex flex-row gap-3 " +
        "font-medium " +
        defaultDimension + " " +
        "bg-green-500 rounded " +
        "px-10 py-3 " +
        "text-lg text-white " +
        "hover:shadow-lg " +
        "ease-in duration-200 ",

    disabled: "items-center flex flex-row gap-3 " +
        "font-medium " +
        defaultDimension + " " +
        "bg-gray-500 rounded " +
        "text-lg text-white " +
        "px-10 py-3 " +
        "cursor-not-allowed",
    disabled2: "items-center flex flex-row gap-3 " +
        "font-medium " +
       longDimension + " " +
        "bg-gray-500 rounded " +
        "text-lg text-white " +
        "px-10 py-3 " +
        "cursor-not-allowed",

    

    primaryRounded: "items-center flex flex-row gap-3 " +
        "font-medium " +
        defaultDimension + " " +
        "bg-custom-yellow rounded-full " +
        "text-lg text-white " +
        "px-8 py-3 " +
        "hover:shadow-lg hover:bg-custom-yellow-hover " +
        "ease-in duration-200",

    dynamicDelete: "items-center flex flex-row gap-3 " +
        "font-medium " +
        defaultDimension + " " +
        "bg-red-600 bg-opacity-60 " +
        "text-lg text-white " +
        "px-10 " +
        "hover:bg-red-600",
    tableDelete: "bg-red-400 hover:bg-red-500 text-white",
    tableEdit: "bg-blue-400 hover:bg-blue-500 text-white",
    bookingTypeButton: "bg-custom-yellow text-white px-2 py-1 rounded-md  hover:bg-red-800 duration-300 ease-in",
    bookingTypeButtonSec: "bg-white text-custom-yellow px-2 py-1 rounded-md border-2 border-custom-yellow hover:bg-red-800 hover:text-white duration-300 ease-in",
    bookingTypeButtonDanger: "bg-black text-white px-2 py-1 rounded-md border-2 border-custom-yellow hover:bg-red-600 hover:text-white duration-300 ease-in",
    daySchSetting: "items-center flex flex-row gap-3 " +
    dayDimension+ " " +
        "font-medium " +
        "bg-custom-yellow rounded " +
        "text-lg text-white " +
        "px-10 py-3 " +
        "hover:shadow-lg hover:bg-custom-yellow-hover " +
        "ease-in duration-200",
    daySchSettingSec: "items-center flex flex-row gap-3 " +
    dayDimension+ " " +
    "font-medium " +
    "text-lg text-custom-yellow " +
    "bg-white border-2 border-custom-yellow rounded " +
    "px-10 py-5" +
    "hover:shadow-lg hover:bg-custom-yellow hover:text-white " +
    "ease-in duration-200 ",

    // "bg-black rounded " + // experimenting with black, I read an article abt an app's primary color being red
    //         "text-lg text-white " +
    //     "px-10 py-3 " +
    //     "hover:shadow-lg hover:bg-red-600 " +
    //     "ease-in duration-200",
};

export default ButtonClassSets;
