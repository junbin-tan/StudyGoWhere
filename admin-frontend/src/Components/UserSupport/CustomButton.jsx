
export default function CustomButton({label, handleButtonClick, buttonType = "button"}) {
    return (    <button
        onClick={handleButtonClick}
        className={`bg-blue-700 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
      >
        {label}
      </button>);
}