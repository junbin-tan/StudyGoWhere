
export default function CustomButton({label, onClick, buttonType = "button", childIcon}) {
    return (<button className="bg-custom-yellow font-medium	hover:drop-shadow-lg text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type={buttonType}
                onClick={onClick}
                >
    {childIcon && <span className="mr-2">{childIcon}</span>} {label}
    </button>);
}