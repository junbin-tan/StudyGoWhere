import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../Helpers/Api";
import PageHeaderBasic from "../Components/PageHeaderBasic";
import Button from "../Components/Button";
import useEncodedToken from "../Helpers/useEncodedToken";
import EditTicketForm from "../Components/UserSupport/EditTicketForm";
const EditTicketPage = () => {
  const { ticketId } = useParams();
  const emptyTicket = {
    ticketId : null,
    subject : "",
    description : "",
    ticketCategory : "",
    adminResponse: "",
    ticketStatus : "UNRESOLVED",
    images : [],
    generalUser : ""
  }
  const [ticketData, setTicketData] = useState({...emptyTicket});

  const { encodedToken } = useEncodedToken();

  useEffect(() => {
    Api.getTicketById(ticketId, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setTicketData(data);
      })
      .catch((error) => {
        console.error("Error fetching ticket details:", error);
      });
  }, [ticketId]);

  const reloadTicket = () => {
    Api.getTicketById(ticketId, encodedToken)
    .then((response) => response.json())
    .then((data) => {
      setTicketData(data);
    })
    .catch((error) => {
      console.error("Error fetching ticket details:", error);
    });
  }

  return (
    <div className="flex flex-col max-h-screen">
      <div>
        <PageHeaderBasic title="Edit Ticket">
          <Button title="Back" location="/user-support" />
        </PageHeaderBasic>
      </div>
      <div className="py-5 px-10">
        <div className="p-5  flex justify-center rounded-lg shadow-lg">
          <EditTicketForm ticket={ticketData} reloadTicket={reloadTicket} />
        </div>
      </div>
    </div>
  );
};

export default EditTicketPage;