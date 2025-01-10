import React, { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import SubscriptionChanger from "./SubscriptionChanger";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  email: string;
  subscriptionType: string;
  price: number;
  fileSizeLimit: number;
  fileNumberLimitPerDay: number;
  subscriptionStartDate: string;
  nrOfFilesConvertedPerMonth: number;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Șterge email-ul logat din localStorage
    localStorage.removeItem("loggedInEmail");

    // Redirecționează utilizatorul către pagina de login
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("loggedInEmail"); // Preia email-ul utilizatorului logat
        if (!email) {
          throw new Error("No logged-in email found");
        }

        const response = await apiClient.get(`/users/profile/${email}`);
        setProfile(response.data);
      } catch (err: any) {
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-profileBackground p-6">
      <div className="max-w-3xl mx-auto p-6 bg-profileCard shadow-profile rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Profile
        </h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Email:</span>
            <span className="text-profileText">{profile?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Subscription Type:</span>
            <span className="text-profileText">
              {profile?.subscriptionType} (${profile?.price.toFixed(2)})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">
              Subscription Start Date:
            </span>
            <span className="text-profileText">
              {profile?.subscriptionStartDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">
              Files Converted This Month:
            </span>
            <span className="text-profileText">
              {profile?.nrOfFilesConvertedPerMonth}/
              {profile?.fileNumberLimitPerDay}
            </span>
          </div>
        </div>

        {/* Adaugă funcționalitatea de schimbare a tipului de abonament */}
        <div className="mt-6">
          <SubscriptionChanger
            email={profile.email}
            currentSubscriptionType={profile.subscriptionType}
            setProfile={setProfile}
          />
        </div>

        {/* Buton de Logout */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("loggedInEmail"); // Șterge email-ul logat
              navigate("/login"); // Redirecționează la pagina de logare
            }}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
