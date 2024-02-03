import React, {useState, useEffect} from "react";
import useEncodedToken from "../../FunctionsAndContexts/useEncodedToken";
import { postMessage } from "../../FunctionsAndContexts/UserSupportAPI";
export function TopCloseButton ({handleCloseAdminResponseDialog}) {
    return (<div className="flex justify-between items-center py-2 px-4">
    <h1 className="font-bold text-2xl mx-2">Chat</h1>
    <button class="text-custom-yellow font-bold text-right transition-duration-500 hover:scale-110 m-2" onClick={e => handleCloseAdminResponseDialog()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </div>)
}

export function SendMessageComponent({ticketId, refreshMessages}) {
  const [value, setValue] = useState("");
  const onChange = (e) => {
    setValue(e.target.value);
  }
  const {encodedToken} = useEncodedToken();
  const onSend = (e) => {
       e.preventDefault();
       if (value) {
        postMessage(value, ticketId, encodedToken)
        .then(res => {
          refreshMessages();
        }).catch(error => {
          console.log(error)
        })
       }
       setValue("");
  }
  return (
    <form onSubmit={onSend}  className="flex items-center m-4">
      <input className=" appearance-none block w-full bg-lightgray-80 text-gray-700 border focus:border-custom-yellow rounded py-3 px-4 m-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-4  00" 
      id={"sendField"} 
      type="text" 
      value={value}
      onChange={onChange}
      ></input>
      <button type="submit" className="bg-custom-yellow text-white font-bold py-2 px-4 m-2 border border-custom-yellow rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  );
}