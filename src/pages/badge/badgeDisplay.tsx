// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import axios from "axios";
import { useRouter } from "next/router";

const apiUserUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

const CertificateEditor: React.FC = () => {
    const [placeholders, setPlaceholders] = useState([]);
    const [badge, setBadge] = useState(null);
    const [canvasBackground, setCanvasBackground] = useState("#ffffff");
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false); // Track the download state
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(
                    `${apiUserUrl}/api/get-badge-template/${id}`
                );
                const { designFields, url, title, subTitle, description, attributes } = response?.data?.data;

                // Combine title, subtitle, and description into placeholders
                const initialPlaceholders = [
                    { text: title, posx: 100, posy: 50, width: 300, height: 40, isLocked: false },
                    { text: subTitle, posx: 100, posy: 100, width: 300, height: 40, isLocked: false },
                    { text: description, posx: 100, posy: 150, width: 400, height: 60, isLocked: false },
                    ...attributes.map((field) => ({
                        text: field.value,
                        posx: field.x || 150,
                        posy: field.y || 150,
                        width: 150,
                        height: 40,
                        isLocked: false,
                        fontSize: field.fontSize,
                        fontColor: field.fontColor,
                    })),
                ];
                setPlaceholders(initialPlaceholders);

                // Set badge data separately
                setBadge({
                    url,
                    posx: 200,
                    posy: 200,
                    width: 100,
                    height: 100,
                });
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchDetails();
        }
    }, [id]);

    const handleFieldChange = (index, field, value) => {
        const updatedPlaceholders = [...placeholders];
        updatedPlaceholders[index] = { ...updatedPlaceholders[index], [field]: value };
        setPlaceholders(updatedPlaceholders);
    };

    const handleSaveImage = async () => {
        setIsDownloading(true); // Start download process

        const canvas = document.getElementById("working-area");

        if (canvas && badge) {
            try {
                // Fetch image as a blob from the badge URL
                const response = await fetch(badge?.url);
                if (!response.ok) throw new Error("Failed to fetch the image");

                const imageBlob = await response.blob();
                const badgeImageUrl = URL.createObjectURL(imageBlob);

                // Create an image element for the badge
                const badgeImage = new Image();
                badgeImage.src = badgeImageUrl;
                badgeImage.style.position = "absolute";
                badgeImage.style.left = `${badge.posx}px`;
                badgeImage.style.top = `${badge.posy}px`;
                badgeImage.style.width = `${badge.width}px`;
                badgeImage.style.height = `${badge.height}px`;

                // Wait for the badge image to load
                badgeImage.onload = async () => {
                    // Add the badge image temporarily to the canvas
                    canvas.appendChild(badgeImage);

                    // Ensure all placeholders have correct dimensions
                    placeholders.forEach((placeholder, index) => {
                        const textarea = document.querySelector(`#textarea-${index}`) as HTMLTextAreaElement;
                        if (textarea) {
                            textarea.style.height = "auto";
                            textarea.style.height = `${textarea.scrollHeight}px`;
                            textarea.style.width = "auto";
                            textarea.style.width = `${textarea.scrollWidth}px`;
                            placeholder.width = textarea.scrollWidth;
                            placeholder.height = textarea.scrollHeight;
                        }
                    });

                    // Allow time for layout adjustments before taking the snapshot
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    // Take the snapshot using html2canvas
                    const snapshot = await html2canvas(canvas, {
                        useCORS: true,
                        allowTaint: true,
                        x: 0,
                        y: 0,
                        width: canvas.offsetWidth,
                        height: canvas.offsetHeight,
                        scale: 2, // Increase the scale for better quality
                        logging: true,
                    });

                    // Remove the badge image after taking the snapshot
                    canvas.removeChild(badgeImage);

                    // Download the generated image
                    const link = document.createElement("a");
                    link.download = "certificate.png";
                    link.href = snapshot.toDataURL();
                    link.click();

                    setIsDownloading(false); // End download process
                };
            } catch (error) {
                console.error("Error fetching image:", error);
                setIsDownloading(false); // End download process
            }
        }
    };



    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>Badge Editor</h2>
            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="background-color">Background Color:</label>
                <input
                    type="color"
                    id="background-color"
                    value={canvasBackground}
                    onChange={(e) => setCanvasBackground(e.target.value)}
                    style={{ marginLeft: "10px" }}
                />
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div
                    id="working-area"
                    style={{
                        position: "relative",
                        width: "70vw",
                        height: "70vh",
                        backgroundColor: canvasBackground,
                        border: "1px solid #ccc",
                        overflow: "hidden",
                    }}
                >
                    {/* Render placeholders */}
                    {placeholders.map((placeholder, index) => (
                        <Rnd
                            key={index}
                            size={{
                                width: placeholder.width,
                                height: placeholder.height, // Initially set to match textarea height
                            }}
                            position={{ x: placeholder.posx, y: placeholder.posy }}
                            onDragStop={(e, d) => {
                                const updatedPlaceholders = [...placeholders];
                                updatedPlaceholders[index].posx = d.x;
                                updatedPlaceholders[index].posy = d.y;
                                setPlaceholders(updatedPlaceholders);
                            }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                const updatedPlaceholders = [...placeholders];
                                updatedPlaceholders[index].width = ref.offsetWidth;
                                updatedPlaceholders[index].height = ref.offsetHeight; // Sync height of Rnd with new size
                                updatedPlaceholders[index].posx = position.x;
                                updatedPlaceholders[index].posy = position.y;
                                setPlaceholders(updatedPlaceholders);
                            }}
                            bounds="parent"
                            className="placeholder"
                            style={{
                                backgroundColor: "transparent",
                                border: isDownloading ? "none" : "1px dashed #000", // Hide border when downloading
                            }}
                        >
                            <textarea
                                value={placeholder.text}
                                onChange={(e) => {
                                    handleFieldChange(index, "text", e.target.value);
                                    const updatedPlaceholders = [...placeholders];
                                    updatedPlaceholders[index].height = e.target.scrollHeight; // Update height of Rnd based on content
                                    updatedPlaceholders[index].width = e.target.scrollWidth; // Optionally update width based on content
                                    setPlaceholders(updatedPlaceholders);
                                }}
                                style={{
                                    width: "100%",
                                    height: "auto", // Auto height adjustment
                                    minHeight: "30px", // Minimum height for textarea
                                    border: "none",
                                    background: "transparent",
                                    fontSize: `${placeholder.fontSize || 16}px`,
                                    textAlign: "center",
                                    color: placeholder.fontColor || "#000",
                                    // resize: "none", // Disable manual resize
                                    wordWrap: "break-word", // Ensures text wraps
                                    whiteSpace: "normal", // Allows text to break and wrap
                                    overflow: "auto", // Ensures overflow is scrollable
                                    boxSizing: "border-box", // Ensures padding and border are included in width/height
                                }}
                                ref={(textarea) => {
                                    if (textarea) {
                                        // Ensure the height matches the content height while keeping the border in sync
                                        textarea.style.height = 'auto'; // Reset height before recalculating
                                        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
                                    }
                                }}
                            />
                        </Rnd>
                    ))}

                    {/* Render Badge */}
                    {badge && (
                        <Rnd
                            size={{ width: badge.width, height: badge.height }}
                            position={{ x: badge.posx, y: badge.posy }}
                            onDragStop={(e, d) => {
                                setBadge((prev) => ({ ...prev, posx: d.x, posy: d.y }));
                            }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                setBadge((prev) => ({
                                    ...prev,
                                    width: ref.offsetWidth,
                                    height: ref.offsetHeight,
                                    posx: position.x,
                                    posy: position.y,
                                }));
                            }}
                            bounds="parent"
                            dragHandleClassName="badge-drag"
                            style={{
                                cursor: "move",
                                zIndex: 2,
                                border: "1px dashed #333",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                backgroundColor: "rgba(200, 200, 200, 0.3)",

                            }}
                            id="badge-placeholder"
                        >
                            <div className="badge-drag" style={{
                                width: "100%", height: "100%",
                                color: "#000",

                            }}>
                                {/* Remove Badge text for download */}
                                {isDownloading ? null : "Badge Position"}
                            </div>
                        </Rnd>
                    )}
                </div>
            )}

            <button
                onClick={handleSaveImage}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Download Certificate
            </button>
        </div>
    );
};

export default CertificateEditor;
