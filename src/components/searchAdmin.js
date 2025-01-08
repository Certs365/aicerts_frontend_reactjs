import React, { useState, useEffect } from "react";
import {
  Form,
  Dropdown,
  Modal,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Image from "next/image";
import axios from "axios";
import { encryptData } from "../utils/reusableFunctions";
import issuance from "../services/issuanceServices";
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

const SearchAdmin = ({
  setFilteredSingleWithCertificates,
  setFilteredSingleWithoutCertificates,
  setFilteredBatchCertificatesData,
  tab,
  setLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("certificationNumber");
  const [searchFor, setSearchFor] = useState("default");
  const [suggestions, setSuggestions] = useState([]);
  const [email, setEmail] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDateInput, setIsDateInput] = useState(false); // Control input type
  const [rawDate, setRawDate] = useState(""); // Store raw date for date picker UI
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState("");
  const [dynamicSearchCriteria, setDynamicSearchCriteria] = useState("");

  const handleSearchForSelect = (eventKey) => setSearchFor(eventKey);

  const dynamicSearchByOptions = ["documentNumber", "name"]; // Add your custom options here
  const handleDynamicSearchCriteriaChange = (event) =>
    setSearchBy(event.target.value);

  const getSearchByOptions = () => {
    if (searchFor === "default") {
      return (
        <>
          <Dropdown.Item eventKey="certificationNumber">
            Certification Number
          </Dropdown.Item>
          <Dropdown.Item eventKey="name">Name</Dropdown.Item>
          <Dropdown.Item eventKey="course">Course</Dropdown.Item>
          <Dropdown.Item eventKey="grantDate">Grant Date</Dropdown.Item>
          <Dropdown.Item eventKey="expirationDate">
            Expiration Date
          </Dropdown.Item>
        </>
      );
    } else if (searchFor === "dynamic") {
      return (
        <>
          <Dropdown.Item eventKey="certificationNumber">
            Certification Number
          </Dropdown.Item>
          <Dropdown.Item eventKey="name">Name</Dropdown.Item>
          <InputGroup className="mb-3">
            {/* <FormControl
    size="sm" // Make the input small
    placeholder="Enter search criteria"
    aria-label="Search criteria"
    aria-describedby="basic-addon1"
    className='m-2'
    value={dynamicSearchCriteria}
    onChange={(e)=>{setDynamicSearchCriteria(e.target.value)}}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleDynamicSearchCriteriaChange(e); // Trigger onEnter
      }
    }}
  /> */}
          </InputGroup>
        </>
      );
    } else {
      // Handle unexpected searchFor values (optional)
      console.warn(`Unknown searchFor value: ${searchFor}`);
      return null; // Or provide a default set of options
    }
  };

  useEffect(() => {
    if (searchTerm === "" || isDateInput) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  }, [searchTerm, isDateInput]);

  const handleClose = () => {
    setShow(false);
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    if (storedUser && storedUser.JWTToken) {
      setEmail(storedUser.email);
    }
  }, []);

  const fetchSuggestions = async (term, criterion) => {
    if (!term.trim() || isDateInput) {
      setSuggestions([]);
      return;
    }

    const dataToEncrypt = {
      email: email,
      input: term,
      filter: criterion,
      flag: 1,
    };

    // Your AES secret key (ensure both front-end and back-end use the same key)

    // const encryptedData = encryptData(dataToEncrypt);

    try {
      // const response = await fetch(`${apiUrl}/api/get-filtered-issues`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     data: encryptedData,
      //   }),
      // });
      issuance.filteredIssues(dataToEncrypt, async (response) => {
        if (response.status != "SUCCESS") {
          // if (!response.ok) {
          // throw new Error('Network response was not ok');
          console.log("Network response was not ok");
        }
        const data = response.data;
        setSuggestions(data?.details);
        setShowSuggestions(true);
      });

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      // const data = await response.json();
      // setSuggestions(data?.details);
      // setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (!isDateInput) {
      const debounceFetch = setTimeout(() => {
        fetchSuggestions(searchTerm, searchBy);
      }, 300);

      return () => clearTimeout(debounceFetch);
    }
  }, [searchTerm, searchBy]);
  /* eslint-disable */

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setRawDate(value); // Store raw date in 'yyyy-mm-dd' format
    setSearchTerm(formatDate(value)); // Format date for API call
  };

  const handleSearchBySelect = (eventKey) => {
    setSearchBy(eventKey);
    setSearchTerm(""); // Reset search term when search criterion changes
    setSuggestions([]);
    setShowSuggestions(false);

    // Toggle date picker for certain searchBy options
    if (eventKey === "grantDate" || eventKey === "expirationDate") {
      setIsDateInput(true);
    } else {
      setIsDateInput(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("suggestion: ", suggestion);
    setSearchTerm(suggestion); // Set suggestion as search term
    setShowSuggestions(false);
  };

  const filteredData = (data, type, second = "") => {
    console.log("filtereddata: ", data);
    // console.log('filtereddata: data.data ', data?.data);
    return data?.data?.filter((item) => {
      if (type === "batch") {
        // Return items that have no 'type' property
        return item.hasOwnProperty("batchId");
      }
      // Return items that match the specified 'type'
      return item.type === type || second;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // setLoading(true);

      const dataToEncrypt = {
        email: email,
        input: searchTerm,
        filter: searchBy,
        flag: 2,
      };
      // const encryptedData = encryptData(dataToEncrypt);

      // const response = await fetch(`${apiUrl}/api/get-filtered-issues`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     data: encryptedData,
      //   }),
      // });

      issuance.filteredIssues(dataToEncrypt, async (response) => {
        if (response.status == "SUCCESS") {
          // if (!response.ok) {
          // throw new Error('Network response was not ok');
          const responseData = response;
          const data = responseData?.data?.details;

          if (!data) {
            // throw new Error("No data returned from the server.");
            console.log("No data returned from the server.");
          }

          if (tab === 0) {
            setFilteredSingleWithCertificates(
              filteredData(data, "withpdf", "dynamic")
            );
            const checker = filteredData(data, "withpdf", "dynamic");
          } else if (tab === 1) {
            setFilteredSingleWithoutCertificates(
              filteredData(data, "withoutpdf")
            );
            const checker = filteredData(data, "withoutpdfthpdf");
          } else if (tab === 2) {
            setFilteredBatchCertificatesData(
              filteredData(data, "batch", "dynamic")
            );
            const checker = filteredData(data, "batch", "dynamic");
          }
          setLoading(false);
        } else {
          setError(response?.data?.message || "Please Try After Sometime");
          setShow(true);
        }
      });

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      // const responseData = await response.json();
      // const data = responseData?.details?.data;
      // if (!data) {
      //   throw new Error("No data returned from the server.");
      // }

      // if (tab === 0) {
      //   setFilteredSingleWithCertificates(filteredData(data, "withpdf", "dynamic"));
      // } else if (tab === 1) {
      //   setFilteredSingleWithoutCertificates(filteredData(data, "withoutpdf"));
      // } else if (tab === 2) {
      //   setFilteredBatchCertificatesData(filteredData(data, "batch", "dynamic"));
      // }
      // setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || "Not able to Search");
        setShow(true);
      } else {
        setError("An unexpected error occurred.");
        console.error("Error during search:", error);
      }
      setLoading(false);
    }
  };

  // Utility function to format date as mm-dd-yyyy for the API call
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group controlId="search">
        <div className="search  align-items-center d-flex align-items-center">
          {/* First Dropdown (For) */}
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Dropdown
              onSelect={handleSearchForSelect}
              className="me-2 golden-dropdown-button"
              style={{top:"6px"}}
            >
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic btn-golden"
                className="btn-golden"
                style={{
                  backgroundColor: "#CFA935",
                  color: "white",
                  border: "none",
                  borderRadius: 0,
                  fontSize:"14px",
                }}
              >
                {`For: ${
                  searchFor.charAt(0).toUpperCase() + searchFor.slice(1)
                }`}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{ borderRadius: 0 }}
                className="custom-dropdown-menu"
              >
                {["default", "dynamic"].map((item) => (
                  <div
                    key={item}
                    style={{ position: "relative" }}
                  >
                    <Dropdown.Item
                      eventKey={item}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 16px",
                        color: item === searchFor ? "#CFA935" : "#5B5A5F", // Apply golden color if selected
                      }}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      {item === searchFor && (
                        <span style={{ color: "#CFA935", fontWeight: "bold" }}>
                          ✔
                        </span> // Tick for selected item
                      )}
                    </Dropdown.Item>
                    {/* Horizontal Line */}
                    {item !== "dynamic" && (
                      <hr style={{ margin: "0", borderColor: "#ccc" }} />
                    )}
                  </div>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              onSelect={handleSearchBySelect}
              className="golden-dropdown-button d-flex d-md-none "
            >
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic btn-golden"
                className="custom-dropdown-toggle fs-14-10 "
                style={{
                  backgroundColor: "#CFA935",
                  color: "white",
                  borderColor: "white",
                  borderRadius: 0,
                  height: "100%",
                  minWidth: "150px",
                }}
                disabled={!searchFor}
              >
                {` ${
                  searchBy.length
                    ? searchBy.charAt(0).toUpperCase() + searchBy.slice(1)
                    : "Select Search For"
                }`}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{ borderRadius: 0}}
                className="custom-dropdown-menu fs-14-10"
              >
                {getSearchByOptions()}
              </Dropdown.Menu>
            </Dropdown>

            {/* Wrapper div to hold the input and dropdown */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize:"14px"
              }}
            >
              {/* Search Input */}
              <div style={{ flex: 1 }}>
                {isDateInput ? (
                  <Form.Control
                    style={{ paddingLeft: "220px" }}
                    type="date"
                    className="search-input-admin custom-date-picker pd-220"
                    value={rawDate} // Bind rawDate to the date picker
                    onChange={handleDateChange}
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      className="d-none d-md-flex search-input-admin ml-2"
                      placeholder={`Search by ${searchBy}`}
                      value={searchTerm}
                      onChange={handleSearchTermChange}
                      style={{
                        paddingLeft: "220px",
                        border: "none",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="text"
                      // style={{paddingLeft:"220px"}}
                      placeholder="Search here..."
                      className="d-flex d-md-none search-input  "
                      value={searchTerm}
                      onChange={handleSearchTermChange}
                      style={{ border: "none" }}
                    />
                  </>
                )}

                {/* Suggestions List */}
                {!isDateInput && showSuggestions && (
                  <ul className="suggestions-list" style={suggestionsListStyle}>
                    {suggestions?.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={suggestionItemStyle}
                          onMouseDown={(e) => e.preventDefault()} // Prevents input blur
                        >
                          {suggestion}
                        </li>
                      ))
                    ) : (
                      <li style={suggestionItemStyle}>No suggestions found</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Dropdown (placed inside the input container) */}
              <Dropdown
                onSelect={handleSearchBySelect}
                className="golden-dropdown-button d-none d-md-flex"
                style={{ position: "absolute", left: 2, width: "200px" }}
              >
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic btn-golden"
                  className="btn-golden fs-14-10 "
                  style={{
                    backgroundColor: "#CFA935",
                    color: "white",
                    borderRadius: 0,
                    height: "100%",
                    width: "200px",
                    // marginRight: "10px",
                    border: "none",
                  }}
                  disabled={!searchFor}
                >
                  {` ${
                    searchBy.length
                      ? searchBy.charAt(0).toUpperCase() + searchBy.slice(1)
                      : "Select Search For"
                  }`}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{ borderRadius: 0 }}
                  className="custom-dropdown-menu"
                >
                  {getSearchByOptions()}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Search Icon */}
            <div
              className="d-none d-md-flex search-icon-container"
              onClick={handleSearch}
            >
              <Image
                width={10}
                height={10}
                src="/icons/search.svg"
                alt="search"
              />
            </div>
            <div
              className="d-flex d-md-none search-icon-container-mobile"
              onClick={handleSearch}
            >
              <Image
                width={10}
                height={10}
                src="/icons/search.svg"
                alt="search"
              />
            </div>
          </div>
        </div>
      </Form.Group>

      <Modal
        onHide={handleClose}
        className="loader-modal text-center"
        show={show}
        centered
      >
        <Modal.Body>
          {error !== "" ? (
            <>
              <div className="error-icon success-image">
                <Image
                  src="/icons/invalid-password.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="Loader"
                />
              </div>
              <div className="text" style={{ color: "#ff5500" }}>
                {error}
              </div>
              <button className="warning" onClick={handleClose}>
                Ok
              </button>
            </>
          ) : (
            <>
              <div className="error-icon success-image">
                <Image
                  src="/icons/success.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="Loader"
                />
              </div>
              <div className="text" style={{ color: "#CFA935" }}>
                {success}
              </div>
              <button className="success" onClick={handleClose}>
                Ok
              </button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Form>
  );
};

// Inline styles for suggestions list and items
const suggestionsListStyle = {
  position: "absolute",
  top: "100%",
  width: "65%",
  right: 15,
  zIndex: 1000,
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  maxHeight: "200px",
  overflowY: "auto",
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const suggestionItemStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
};

export default SearchAdmin;
