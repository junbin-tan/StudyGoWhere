export default function TimeHeaderInterval({
                                          children, index,
                                          colorOne="snow", colorTwo="papayawhip",
                                          ...rest}) {
    return <div key={index} className={`col-span-1 overflow-visible ${index % 2 === 0 ? colorOne : colorTwo}`}
                 style={{zIndex: 47 - index}}
                 {...rest}
    >
        {children}
    </div>
}
