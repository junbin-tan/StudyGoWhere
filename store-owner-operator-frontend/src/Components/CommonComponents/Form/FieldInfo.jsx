export default function FieldInfo({ className = "", style = {},children }) {
  return (
      <p className={"text-sm text-gray-80 " + className}
         style={style}
      >
        {children}
      </p>

  )
}
