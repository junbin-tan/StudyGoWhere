import React from "react";

const VoucherListingCard = () => {
  return (
    <a
      href="#"
      className="w-full flex flex-row items-center justify-between bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-300 hover:bg-opacity-50 transform"
    >
      <div className="flex flex-row items-center">
        <div className="w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-l flex items-center justify-center">
          <h1 className="text-gray-800 text-5xl">$5</h1>
        </div>
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Venue Name: 
          </h5>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <svg
                className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Voucher Value: 
            </li>
            <li className="flex items-center">
              <svg
                className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Voucher Cost: 
            </li>

            <li className="flex items-center">
              <svg
                className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Voucher Stock: 
            </li>
            <li className="flex items-center">
              <svg
                className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Voucher Validity Period: 
            </li>
            <li className="flex items-center">
              <svg
                className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Voucher Enabled
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-end mr-5">
        <button
          // onClick={handleButtonClick}
          className="p-2 text-white rounded-md mt-4 bg-blue-500"
        >
          Edit Voucher Listing
        </button>
      </div>
    </a>
  );
};

export default VoucherListingCard;
