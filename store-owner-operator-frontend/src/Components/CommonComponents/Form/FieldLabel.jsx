export default function FieldLabel({className = "", htmlFor, style={}, children}) {
    return (
        <label className={"font-semibold " + className} htmlFor={htmlFor}
               style={style}
        >
            {children}
        </label>
    )
}