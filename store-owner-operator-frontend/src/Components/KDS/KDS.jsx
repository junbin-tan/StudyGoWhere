import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import OrderCard from "./OrderCard";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import Api from "../../FunctionsAndContexts/Api";
import PageStructure from "../PageStructure/PageStructure";
import { RiComputerLine } from "react-icons/ri";
import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";

const KDS = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const [orderLoading, setOrderLoading] = useState(true);

  const [events, setEvents] = useState([]);

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/">
            Home
          </Link>
          <Link underline="hover" className="text-custom-yellow" to="/kds">
            Kitchen Display System
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  const handleCompletion = async (key) => {
    await Api.completeOrder(key, token);
    setEvents((prevItems) => {
      return prevItems.filter((item) => item.transactionId !== key);
    });
  };

  const fetchData = async () => {
    const retrieveOrders = await Api.retrieveVenueOrders(encodedToken);
    const initOrders = await retrieveOrders.json();
    console.log(initOrders);
    setEvents((data) => [...initOrders]);
    setOrderLoading(false);

    await fetchEventSource(
      `http://localhost:5001/public/create-order-connection`,
      {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${encodedToken}`,
        },
        onopen(res) {
          console.log(res);
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          console.log(event.data);
          const parsedData = JSON.parse(event.data);
          setEvents((data) => [...data, parsedData]);
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
      }
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageStructure
      icon={<RiComputerLine size="1.5em" />}
      title={"Kitchen Display System"}
      breadcrumbs={<ActiveLastBreadcrumb />}
    >
      {!orderLoading ? ( events.length != 0 ?
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            {events.map((event) => {
              return (
                <OrderCard
                  key={event.transactionId}
                  username={event.username}
                  items={event.items}
                  transactionId={event.transactionId}
                  handleCompletion={handleCompletion}
                />
              );
            })}
          </div>
        </div> : <h3>No current orders</h3>
      ) : (
        <h3>Initializing System...</h3>
      )}
    </PageStructure>
  );
};

export default KDS;
