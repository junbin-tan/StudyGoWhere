import CustomButton from "./CustomButton";
import React, {useRef, useEffect} from "react";
export default function ChatButton({row, handleViewResponse}) {
    return (!row?.newMessage ? <CustomButton
            label={"Chat"}
            handleButtonClick={(e) => handleViewResponse(row)}
          ></CustomButton>
          : (<button className="bg-brown-80 font-medium hover:drop-shadow-lg text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button"
                    onClick={(e) => handleViewResponse(row)}
                    > 
                    <span>Chat</span>
                    <span className="absolute inline-flex bg-white animate-ping rounded-full h-3 w-3"></span>
          </button>));
    
}

export function MainChat({messages, user, ticketDialog}){
  const mainChatRef = useRef(null);
  useEffect(() => {
      mainChatRef.current?.scrollIntoView();
  }, [messages]);
  console.log(user.sub)
  return (<>
          <div className="min-h-[30vh] h-full min-w-[40vh] overflow-auto max-h-[60vh]">
          {messages.length === 0 && <p className="text-2xl">Start a Conversation about Ticket : {ticketDialog?.subject} </p>}
          {messages.map(m => {
            console.log(user?.sub === m.sender);
            return (<div key={m.messageId} className={"mx-4 flex flex-col "+ (user?.sub === m.sender ? "items-end" : "items-start")}>
              <h1>{m.sender}</h1>
              <div className={"max-w-[75%] my-4 border p-4 rounded shadow-sm " + (user?.sub === m.sender ? " bg-blue-700 text-white" : "")}>
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
