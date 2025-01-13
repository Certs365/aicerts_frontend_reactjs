// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'; // Assuming React Router is used
import certificate from "@/services/certificateServices";
import styles from './BadgeDashboard.module.scss'; // Import SCSS file
import Button from "../../../shared/button/button";

// Define the type for the badge object
interface Badge {
  _id: number;
  name: string;
  color: string;
  title: string;
}

const BadgeDashboard: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]); // State to store badge data
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null); // State to store selected badge
  const router = useRouter();

  // Function to fetch badges
  const getAllBadges = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
      let userEmail = "";

      if (storedUser && storedUser.JWTToken) {
        userEmail = storedUser.email.toLowerCase();
      }

      // Call getBadgeTemplates and handle the callback
      certificate.getBadgeTemplates({ email: userEmail }, (response) => {
        if (response.status === "SUCCESS") {
          const badges = response.data as Badge[]; // Cast data to Badge[]
          setBadges(badges?.data); // Update the state with fetched badges
        } else {
          console.error(
            "Failed to fetch badges:",
            response.error || "Unknown error"
          );
        }
      });
    } catch (error) {
      console.error("Unexpected error fetching badges:", error);
    }
  };

  // Fetch badges on component mount
  useEffect(() => {
    getAllBadges();
  }, []);

  // Handle badge click
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    router.push(`/badge/badge-form?id=${badge._id}`);
  };
  const handleNewBadge = () => {
    router.push(`/badge/badge-form`);
  };

  return (
    <div className="page-bg pt-5">
      <div className="mt-5 pt-5">
        <div className="design-container mt-5 pt-5">
          <div className="dashboard-badge mt-5 pt-5">
            <div className="d-flex flex-row align-items-center justify-content-between mt-5 pt-5">
              <h3 className="mx-5">Badge Dashboard</h3>
              <Button onClick={() => { handleNewBadge() }} className='golden me-3' label='Create New Badge' />

            </div>
            <h4 className="mx-5 mt-4">Select Your Badge Template</h4>
            <div className="d-flex flex-row m-3 flex-wrap">
              {badges?.length > 0 &&
                badges.map((badge) => (
                  <div
                    key={badge._id}
                    onClick={() => handleBadgeClick(badge)}
                    className="badge-Card-dashboard ms-4 mb-3"
                  >
                    <span className="badge-title">
                      {badge.title || "Badge"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDashboard;
