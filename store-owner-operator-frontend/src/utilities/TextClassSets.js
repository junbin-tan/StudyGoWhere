const TextClassSets = {
    info: "text-sm text-gray-500",
    icon: "text-lg", // this is 18x18 i think, though technically it sets the size as 1.125 rem
    sidebarLink: "nav-title px-3 text-md font-semibold rounded-xl py-3 hover:bg-custom-yellow-hover items-center flex flex-row gap-2 ease-in duration-200",
    sidebarLinkActive: "text-custom-yellow hover:text-white font-semibold bg-lightgray-90",
    sidebarVenue: "nav-title pl-8 text-md rounded-xl py-3 hover:bg-custom-yellow-hover items-center flex flex-row gap-2 ease-in duration-200",
    title: "title-24pt text-gray-90",
    h2: 'text-xl font-bold',
    h3: 'text-lg font-semibold',
    h4: 'text-base font-medium',
    h5: 'text-sm ',
    header: 'flex flex-row justify-between px-8 items-center mb-8',
    selected: "text-amber-400",
}

export default TextClassSets;