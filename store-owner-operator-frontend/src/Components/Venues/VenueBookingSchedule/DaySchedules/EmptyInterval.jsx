export default function EmptyInterval({
  children,
  index,
  colorOne = "snow",
  colorTwo = "papayawhip",
  handleClick = () => null,
  handleHover = () => null,
  className,
  ...rest
}) {
  return (
    <div
      key={index}
      className={`col-span-1 overflow-visible ${
        index % 2 == 0 ? "bg-white" : "bg-slate-100"
      } ${className}}`}
      style={{
        zIndex: 47 - index,
        cursor: "pointer",
      }}
      onClick={() => handleClick(index)}
      onMouseEnter={() => handleHover(index)} // we don't need an onMouseLeave because we wanna keep the hover state until the user clicks
      {...rest}
    >
      {children}
    </div>
  );
}
