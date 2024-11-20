import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';// Assuming React Router is used
import certificate from "@/services/certificateServices";

// Define the type for the badge object
interface Badge {
  _id: number;
  name: string;
  color: string;
  title:string
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
    router.push(`/badge/badge-form?id=${badge._id}`)  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        minHeight: "100vh", // Center vertically
        backgroundColor: "#f9f9f9", // Add a light background
      }}
    >
      {badges?.length > 0 &&
        badges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => handleBadgeClick(badge)}
            style={{
              width: "300px", // Increased size
              height: "300px", // Increased size
              backgroundColor: badge.color || "gray", // Example property for color
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ddd", // Thicker border for better visibility
              borderRadius: "10px", // Rounded corners
              cursor: "pointer", // Pointer cursor for clickability
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
              transition: "transform 0.2s, box-shadow 0.2s", // Add animation
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLDivElement).style.transform = "scale(1.05)";
              (e.target as HTMLDivElement).style.boxShadow =
                "0 8px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLDivElement).style.transform = "scale(1)";
              (e.target as HTMLDivElement).style.boxShadow =
                "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            <span
              style={{
                fontSize: "16px", // Larger font size
                fontWeight: "bold", // Bold font for visibility
                color: "#fff", // White text color for contrast
                textAlign: "center",
              }}
            >
              {badge.title || "Badge"}
            </span>
          </div>
        ))}
    </div>
  );
};

export default BadgeDashboard;
