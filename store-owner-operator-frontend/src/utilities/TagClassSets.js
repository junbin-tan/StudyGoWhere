const TagClassSets = {
    default: "px-3 py-2 min-w-80 w-fit-content rounded-full border-2 border-gray-400 text-gray-400" + 
            " hover:font-semibold hover:border-custom-yellow " + 
            "hover:text-custom-yellow active:font-bold active:border-custom-yellow active:bg-custom-yellow active:bg-opacity-25",
    databox: "",
    default2: "px-5 py-1 min-w-80 w-fit rounded-full border-2 border-custom-yellow text-custom-yellow bg-white bg-opacity-75 text-center",
    true:  "px-5 py-1 min-w-80 w-fit rounded-full border-2 border-green-500 text-green-500 bg-white bg-opacity-75 text-center",
    false:  "px-5 py-1 min-w-80 w-fit rounded-full border-2 border-gray-300 text-gray-300 bg-white bg-opacity-75 text-center",
}

// .tag-default {
//     padding: .5em 1em;
//     min-width: 80px;
//     width: fit-content;
//     border-radius: 30px;
//     border: solid 1px var(--gray-70);   
//     color: var(--gray-70);
// }

// .tag-default:hover{
//     padding: .5em 1em;
//     width: fit-content;
//     border-radius: 30px;
//     color: var(--brown-90);
//     border: solid 1px var(--brown-90);
//     font-weight: 500;
// }

// .tag-default:active{
//     padding: .5em 1em;
//     width: fit-content;
//     border-radius: 30px;
//     color: var(--brown-60);
//     border: solid 3px var(--brown-60);
//     background-color: rgba(200, 174, 125, 0.285);
//     font-weight: 600;
// }

export default TagClassSets;