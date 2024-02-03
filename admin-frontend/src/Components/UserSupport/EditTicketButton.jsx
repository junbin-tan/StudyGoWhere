import React from "react";
import { useNavigate } from "react-router-dom";  

export default function EditTicketButton(ticketWrapper) {
    const navigate = useNavigate();
    const ticketId = ticketWrapper?.ticket?.ticketId;
    const handleRespond = (e) => {
        navigate(`/respondTicket/${ticketId}`);
    }
    return (
        <div className="flex flex-row">
    <button
    onClick={handleRespond}
    className={`bg-blue-700 hover:bg-blue-800 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
    >
    Respond
    </button>
    {ticketWrapper?.ticket?.notifyAdmin && <span class="relative flex h-3 w-3 top-0 right-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>}
    </div>);
}