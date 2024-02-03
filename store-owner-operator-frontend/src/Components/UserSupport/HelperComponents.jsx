import CustomButton from "../../utilities/CustomButton";
import React, {useRef, useEffect} from "react";
export default function ChatButton({row, handleViewResponse}) {
    return ( !row?.notifyClient ? <button className="bg-custom-yellow text-lg	hover:drop-shadow-lg text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button"
                    onClick={(e) => handleViewResponse(row)}
                    >Chat</button>
          : (<button className="bg-custom-yellow text-lg hover:drop-shadow-lg text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button"
                    onClick={(e) => handleViewResponse(row)}
                    > 
                    <span>Chat</span>
                    <span className="absolute inline-flex bg-green-500 animate-ping rounded-full h-5 w-5"></span>
          </button>));
    
}

export function MainChat({messages, user, ticketDialog}){
  const mainChatRef = useRef(null);
  useEffect(() => {
      mainChatRef.current?.scrollIntoView();
      console.log("SCROLL")
  }, [messages]);
  return (<>
          <div className="min-h-[30vh] h-full min-w-[40vh] overflow-auto max-h-[60vh]">
          {messages.length === 0 && <p className="font-9xl font-montserrat font-bold">Start a Conversation about Ticket : {ticketDialog?.subject} </p>}
          {messages.map(m => {
            return (<div key={m.messageId} className={"mx-4 flex flex-col "+ (user.username === m.sender ? "items-end" : "items-start")}>
              <h1>{m.sender}</h1>
              <div className={"max-w-[75%] my-4 border p-4 rounded shadow-sm" + (user.username === m.sender ? " bg-custom-yellow text-white" : "")}>
                {m.message}
              </div>
              </div>
          );
          })}
          <div ref={mainChatRef}/>
          </div>
          </>
  )
};
