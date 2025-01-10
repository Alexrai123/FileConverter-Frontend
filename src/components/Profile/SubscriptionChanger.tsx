import React, { useState, useEffect } from "react";
import { getSubscriptionTypes, changeSubscriptionType } from "@/api/apiClient";
import apiClient from "@/api/apiClient";

const SubscriptionChanger = ({
  email,
  currentSubscriptionType,
  setProfile,
}: {
  email: string;
  currentSubscriptionType: string;
  setProfile: any;
}) => {
  const [subscriptionTypes, setSubscriptionTypes] = useState<any[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState(
    currentSubscriptionType
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptionTypes = async () => {
      try {
        const data = await getSubscriptionTypes();
        console.log("Fetched subscription types:", data);
        setSubscriptionTypes(data);
      } catch (error) {
        console.error("Failed to fetch subscription types:", error);
      }
    };

    fetchSubscriptionTypes();
  }, []);

  const handleSubscriptionChange = async () => {
    setIsLoading(true);
    try {
      await changeSubscriptionType(email, selectedSubscription);
      alert("Subscription type updated successfully.");

      // Reîmprospătează profilul utilizatorului
      const updatedProfile = await apiClient.get(`/users/profile/${email}`);
      setProfile(updatedProfile.data); // Actualizează datele profilului în UI
    } catch (error) {
      console.error("Failed to update subscription type:", error);
      alert("Failed to update subscription type. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Change Subscription Type</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Select a new subscription:
        </label>
        <select
          value={selectedSubscription}
          onChange={(e) => setSelectedSubscription(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {subscriptionTypes.length === 0 && (
            <option disabled>Loading...</option>
          )}
          {subscriptionTypes.map((type) => (
            <option key={type.subscription_type_id} value={type.typeName}>
              {type.typeName} - ${type.price}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubscriptionChange}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Subscription"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionChanger;
