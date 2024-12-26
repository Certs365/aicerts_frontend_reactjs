import React, { useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const FileUpload = ({onUploadSuccess,imageType}) => {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5 MB max file size
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      if (file.size > maxSize) {
        toast.error("File size should not exceed 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
  };

  // Upload background image
  const uploadBackground = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("type", imageType);

    const userObject = JSON.parse(localStorage.getItem("user"));
    const issuerId = userObject ? userObject.issuerId : null;

    if (!issuerId) {
      console.error("Issuer ID not found in local storage.");
      return;
    }

    formData.append("issuerId", issuerId);

    try {
      setUploadStatus("uploading");
      const response = await axios.post(
        `https://userdevapi.certs365.io/api/add/certificate/image`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentComplete);
          },
        }
      );
      if (response.status !== 201) {
        console.error("Upload failed.");
        // throw new Error("Upload failed.");
      }
      toast.error("Background uploaded successfully!");
      // fetchUploadedBackgrounds(); // Uncomment if this function is defined and needed
      setUploadStatus("done");
      onUploadSuccess && onUploadSuccess();
      clearFileInput()
    } catch (error) {
      console.error("Error uploading background:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!selectedFile && (
        <button className="file-btn" onClick={onChooseFile}>
          <span>
            <IoCloudUploadOutline />
          </span>
          Upload Image
        </button>
      )}

      {selectedFile && (
        <>
          <div className="file-card">
            <CiImageOn color="#CFA935" fontSize={"50px"} />
            <div className="file-info">
              <div style={{ flex: 1 }}>
                <h6>{selectedFile.name}</h6>
                <div className="progress-bg">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <button onClick={clearFileInput}>
                <IoMdClose fontSize={"50px"} />
              </button>
            </div>
          </div>
          <button className="upload-btn" onClick={uploadBackground}>
            {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
