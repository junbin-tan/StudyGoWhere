import "../index.css";  

export default function InputText({label, field, value, onInputChange, validationFunction, validationRequirements}) {
    return (<div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full px-3">
        
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={field}>
        {label}

      </label>
      <input className="appearance-none block w-full bg-lightgray-80 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
      id={field} 
      type="text" 
      value={value}
      onChange={(e) => onInputChange(field, e)}
      placeholder={"Enter " + field}/>
      {!validationFunction && <p style={{color : "#FF0000"}} className="text-sm italic">{field + " must be " + validationRequirements}</p>}
    </div>
  </div>);
}
