"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Loader2 } from "lucide-react";

export default function ManageUsers() {
  const { user } = useUser();
  const { clerk } = useClerk();
  const [users, setUsers] = useState([]);
  const [referrals, setReferrals] = useState({});
  const [newReferral, setNewReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState({ details: false, files: false });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/fetch-users");
        const responseData = await res.json();; // 🔹 Log full response for debugging
  
        // Extracting users correctly
        const usersArray = responseData.data; // 🔹 Fix: Get users from "data" key
  
        if (Array.isArray(usersArray)) {
          setUsers(usersArray);
        } else {
          console.error("Invalid data format:", responseData);
          setUsers([]); // Prevent errors if the format is wrong
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  async function handleAddReferral(userId) {
    try {
      await axios.post("/api/manage-referrals", { userId, referral: newReferral });
      setReferrals({ ...referrals, [userId]: newReferral });
      setNewReferral("");
    } catch (error) {
      console.error("Error adding referral:", error);
    }
  }

  async function handleDeleteReferral(userId) {
    try {
      await axios.delete("/api/manage-referrals", { data: { userId } });
      const updatedReferrals = { ...referrals };
      delete updatedReferrals[userId];
      setReferrals(updatedReferrals);
    } catch (error) {
      console.error("Error deleting referral:", error);
    }
  }

  async function handleResetPassword(userId) {
    try {
      await axios.post("/api/reset-passwords", { userId });
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

  async function handleDeactivateAccount(userId) {
    try {
      await axios.post("/api/deactivate-account", { userId });
      alert("Account deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  }

  async function handleDownload(userId, type) {
    try {
      setDownloading((prev) => ({ ...prev, [type]: true }));
      const res = await axios.get(`/api/${type === "details" ? "download-details" : "download-files"}?userId=${userId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `User_${userId}_${type}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
    } finally {
      setDownloading((prev) => ({ ...prev, [type]: false }));
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Manage Users</h2>
       {/* Show Loading Message */}
       {users.length === 0 && <p className="text-gray-500 text-center">No users found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="shadow-lg rounded-xl border border-gray-200">
            <CardHeader className="bg-gray-100 p-4 rounded-t-xl flex items-center gap-4">
              {/* 🔹 Profile Image */}
              <img
                src={user.imageUrl}
                alt="User Profile"
                className="w-12 h-12 rounded-full border"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div>
              <CardTitle className="text-lg font-semibold">{user.username || "No Username"}</CardTitle>
                <p className="text-sm text-gray-600">{user.emailAddresses?.[0]?.emailAddress || "No Email"}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* 🔹 Referral Section */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Referral: <span className="font-medium">{referrals[user.id] || "No Referral"}</span>
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newReferral}
                    onChange={(e) => setNewReferral(e.target.value)}
                    placeholder="Enter Referral Code"
                    className="flex-1"
                  />
                  <Button onClick={() => handleAddReferral(user.id)}>Add</Button>
                  <Button onClick={() => handleDeleteReferral(user.id)} variant="destructive">
                    Delete
                  </Button>
                </div>
              </div>

              <hr className="border-gray-300" />

              {/* 🔹 User Management Actions */}
              <div className="space-y-2">
                <Button onClick={() => handleResetPassword(user.id)} variant="outline" className="w-full">
                  Reset Password
                </Button>
                <Button onClick={() => handleDeactivateAccount(user.id)} variant="destructive" className="w-full">
                  Deactivate Account
                </Button>
              </div>

              <hr className="border-gray-300" />

              {/* 🔹 Download Actions */}
              <div className="space-y-2">
                <Button
                  onClick={() => handleDownload(user.id, "details")}
                  disabled={downloading.details}
                  className="w-full flex items-center justify-center"
                >
                  {downloading.details ? <Loader2 className="w-5 h-5 animate-spin" /> : "Download Details"}
                </Button>
                <Button
                  onClick={() => handleDownload(user.id, "files")}
                  disabled={downloading.files}
                  className="w-full flex items-center justify-center"
                >
                  {downloading.files ? <Loader2 className="w-5 h-5 animate-spin" /> : "Download Files"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
