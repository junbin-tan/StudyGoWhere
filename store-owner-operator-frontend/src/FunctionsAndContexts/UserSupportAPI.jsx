import {BACKEND_PREFIX} from "./serverPrefix";

export async function fetchMessages(ticketId, tokenValue) {
  return fetch(`${BACKEND_PREFIX}/owner/ticket/${ticketId}/message`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenValue}`
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401 || response.status === 403) {
          throw new Error("UNAUTHORIZED");
        } else {
          throw new Error(`Connection error, failed to create tickets: ${response.status}`);
        }
      }).catch(error => {
        throw error;
      });
}
function generateResponse(response) {
  if (response.ok) {
    return response.json();
  } else if (response.status === 401 || response.status === 403) {
    throw new Error("UNAUTHORIZED");
  } else {
    throw new Error(`Connection error : ${response.status}`);
  }
}
export async function postMessage(message, ticketId, tokenValue) {
  return fetch(`${BACKEND_PREFIX}/owner/ticket/${ticketId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenValue}`
      },
      body: JSON.stringify({message : message}),
    })
      .then((response) => { 
        return generateResponse(response);
      }).catch(error => {
        throw error;
      });
};
export async function createTicket(ticket, tokenValue) {
    return fetch(`${BACKEND_PREFIX}/owner/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenValue}`
        },
        body: JSON.stringify(ticket),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 401 || response.status === 403) {
            throw new Error("UNAUTHORIZED");
          } else {
            throw new Error(`Connection error, failed to create tickets: ${response.status}`);
          }
        }).catch(error => {
          throw error;
        });
  };

  //const  {encodedToken} = useEncodedToken();

  export async function searchTicket(searchObj, tokenValue) {
    return fetch(`${BACKEND_PREFIX}/owner/ticket/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenValue}`
        },
        body: JSON.stringify(searchObj),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 401 || response.status === 403) {
            throw new Error("UNAUTHORIZED");
          } else {
            throw new Error(`Failed to search tickets: ${response.status}`);
          }
        }).catch(error => {
          throw error;
        });
  };

  export async function markAsRead(ticketId, tokenValue) {
    return fetch(`${BACKEND_PREFIX}/owner/ticket-read/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokenValue}`
        },
      })
        .then((response) => {
          if (response.ok) {
          } else if (response.status === 401 || response.status === 403) {
            throw new Error("UNAUTHORIZED");
          } else {
            throw new Error(`Failed to connect: ${response.status}`);
          }
        }).catch(error => {
          throw error;
        });
  };