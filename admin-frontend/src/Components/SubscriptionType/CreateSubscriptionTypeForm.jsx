import React from "react";
import { useState, useEffect } from "react";
import Api from "../../Helpers/Api";
import { useNavigate } from "react-router-dom";
import useEncodedToken from "../../Helpers/useEncodedToken";

const CreateSubscriptionTypeForm = () => {
  const { encodedToken } = useEncodedToken();

  const navigate = useNavigate();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [subscriptionTypeDetails, setsubscriptionTypeDetailsDetails] = useState(
    {
      subscriptionTypeName: "",
      subscriptionTypeVenueLimit: 0,
      subscriptionTypePrice: 0,
      subscriptionTypeDuration: 0,
      subscriptionTypeDetails: "",
      subscriptionTypeStatusEnum: "ACTIVATED",
    }
  );

  const handleChange = (e) => {
    setsubscriptionTypeDetailsDetails({
      ...subscriptionTypeDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Api.createSubscriptionType(subscriptionTypeDetails, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        console.log("Subscription Type created:", data);
        navigate("/subscriptiontype");
        setsubscriptionTypeDetailsDetails({
          subscriptionTypeName: "",
          subscriptionTypeVenueLimit: 0,
          subscriptionTypePrice: 0,
          subscriptionTypeDuration: 0,
          subscriptionTypeDetails: "",
          subscriptionTypeStatusEnum: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div className="w-screen rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Create an Subscription Type
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="subscriptionTypeName"
                className="block mb-2 text-sm font-medium "
              >
                Name
              </label>
              <input
                type="text"
                name="subscriptionTypeName"
                value={subscriptionTypeDetails.subscriptionTypeName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="e.g. Gold Subscription"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subscriptionTypeVenueLimit"
                className="block mb-2 text-sm font-medium "
              >
                Venue limit
              </label>
              <input
                type="number"
                name="subscriptionTypeVenueLimit"
                value={subscriptionTypeDetails.subscriptionTypeVenueLimit}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="5"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subscriptionTypePrice"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Monthly Price
              </label>
              <input
                type="number"
                name="subscriptionTypePrice"
                value={subscriptionTypeDetails.subscriptionTypePrice}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>
            <div>
              <label
                htmlFor="subscriptionTypeDuration"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Duration - Days
              </label>
              <input
                type="number"
                name="subscriptionTypeDuration"
                value={subscriptionTypeDetails.subscriptionTypeDuration}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            <div>
              <label
                htmlFor="subscriptionTypeDetails"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Details
              </label>
              <input
                type="text"
                name="subscriptionTypeDetails"
                value={subscriptionTypeDetails.subscriptionTypeDetails}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div>

            {/* <div>
              <label
                htmlFor="subscriptionTypeStatusEnum"
                className="block mb-2 text-sm font-medium "
              >
                Subscription Type Status
              </label>
              <input
                type="text"
                name="subscriptionTypeStatusEnum"
                value={subscriptionTypeDetails.subscriptionTypeStatusEnum}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder=""
                required
              />
            </div> */}

            <div className="relative">
              <label
                htmlFor="subscriptionTypeStatusEnum"
                className="block mb-1 text-sm font-medium "
              >
                Subscription Type Status
              </label>
              <select
                name="subscriptionTypeStatusEnum"
                value={subscriptionTypeDetails.subscriptionTypeStatusEnum}
                onChange={handleChange}
                className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 shadow-sm"
                required
              >
                <option value="ACTIVATED">ACTIVATED</option>
                <option value="DEACTIVATED">DEACTIVATED</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Create subscription type
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionTypeForm;
