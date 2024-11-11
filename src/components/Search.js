import React, { useState, useEffect } from 'react';
import { Form, Dropdown, Modal } from 'react-bootstrap';
import Image from 'next/image';
import axios from 'axios';
import { encryptData } from '../utils/reusableFunctions';
import issuance from '../services/issuanceServices';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

const Search = ({ setResponseData, tab, setLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('certificationNumber');
    const [suggestions, setSuggestions] = useState([]);
    const [email, setEmail] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isDateInput, setIsDateInput] = useState(false); // Control input type
    const [rawDate, setRawDate] = useState(''); // Store raw date for date picker UI
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (searchTerm === "" || isDateInput) {
            setShowSuggestions(false);
        } else {
            setShowSuggestions(true);
        }
    }, [searchTerm, isDateInput]);

    const handleClose = () => {
        setShow(false);
        setError("")
        setSuccess("")
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
        if (storedUser && storedUser.JWTToken) {
            setEmail(storedUser.email);
        }
    }, []);

    // Debounced function to fetch suggestions
    const fetchSuggestions = async (term, criterion) => {
        if (!term.trim() || isDateInput) {
            setSuggestions([]);
            return;
        }

        const dataToEncrypt = {
            email: email,
            input: searchTerm,
            filter: searchBy,
            status: tab,
            flag: 1
        }
        const encryptedData = encryptData(dataToEncrypt);

        try {
            // const response = await fetch(`${apiUrl}/api/admin-filtered-issues`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         data: encryptedData,
            //     }),
            // });

            issuance.adminFilteredIssues(dataToEncrypt, async (response)=>{
                debugger
                if( response.status != 'SUCCESS'){
                // if (!response.ok) {
                    // throw new Error('Network response was not ok');
                    console.log('Network response was not ok');
                }
    
                const data = response.data;
                setSuggestions(data?.details);
                setShowSuggestions(true);
            });

            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            // const data = await response.json();
            // setSuggestions(data?.details);
            // setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
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
        setSearchTerm(''); // Reset search term when search criterion changes
        setSuggestions([]);
        setShowSuggestions(false);

        // Toggle date picker for certain searchBy options
        if (eventKey === 'grantDate' || eventKey === 'expirationDate') {
            setIsDateInput(true);
        } else {
            setIsDateInput(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion); // Set suggestion as search term
        setShowSuggestions(false);
    };

    const filteredData = (data, type) => {
        return data.filter(item => {
            if (type === "batch") {
                // Return items that have no 'type' property
                return item.hasOwnProperty('batchId');
            }
            // Return items that match the specified 'type'
            return item.type === type;
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
                status: tab,
                flag: 2,
            }
            const encryptedData = encryptData(dataToEncrypt);

            const response = await axios.post(`${apiUrl}/api/admin-filtered-issues`, {
                data: encryptedData
            });

            const data = response?.data?.details;
            if (!data) {
                throw new Error("No data returned from the server.");
            }
            setResponseData(data)
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message || "Not able to Search");
                setShow(true);
            } else {
                setError('An unexpected error occurred.');
                console.error('Error during search:', error);
            }
            setLoading(false);
        }
    };


    // Utility function to format date as mm-dd-yyyy for the API call
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="search">
                <div className="search d-flex align-items-start">
                    {/* Search Criteria Dropdown */}
                    <Dropdown style={{ borderRadius: 0 }} onSelect={handleSearchBySelect} className="me-2 golden-dropdown">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="custom-dropdown-toggle">
                            Search by: {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item eventKey="certificationNumber">Certification Number</Dropdown.Item>
                            <Dropdown.Item eventKey="name">Name</Dropdown.Item>
                            <Dropdown.Item eventKey="courseName">Course Name</Dropdown.Item>
                            <Dropdown.Item eventKey="grantDate">Grant Date</Dropdown.Item>
                            <Dropdown.Item eventKey="expirationDate">Expiration Date</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                        <Modal.Body>
                            {error !== '' ? (
                                <>
                                    <div className='error-icon success-image'>
                                        <Image
                                            src="/icons/invalid-password.gif"
                                            layout='fill'
                                            objectFit='contain'
                                            alt='Loader'
                                        />
                                    </div>
                                    <div className='text' style={{ color: '#ff5500' }}>{error}</div>
                                    <button className='warning' onClick={handleClose}>Ok</button>
                                </>
                            ) : (
                                <>
                                    <div className='error-icon success-image'>
                                        <Image
                                            src="/icons/success.gif"
                                            layout='fill'
                                            objectFit='contain'
                                            alt='Loader'
                                        />
                                    </div>
                                    <div className='text' style={{ color: '#CFA935' }}>{success}</div>
                                    <button className='success' onClick={handleClose}>Ok</button>
                                </>
                            )}
                        </Modal.Body>
                    </Modal>


                    {/* Search Input and Suggestions */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        {isDateInput ? (
                            <Form.Control
                            style={{paddingLeft:"220px"}}
                                type="date"
                                className="search-input-admin"
                                value={rawDate} // Bind rawDate to the date picker
                                onChange={handleDateChange}
                            />
                        ) : (
                            <>
                                <input
                                
                                    type="text"
                                    className="d-none d-md-flex search-input-admin-page"
                                    placeholder={`Search by ${searchBy}`}
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="d-flex d-md-none search-input"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                            </>
                        )}
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

                    {/* Search Icon */}
                    <div className='d-none d-md-flex search-icon-container' onClick={handleSearch}>
                        <Image width={10} height={10} src="/icons/search.svg" alt='search' />
                    </div>
                    <div className='d-flex d-md-none search-icon-container-mobile' onClick={handleSearch}>
                        <Image width={10} height={10} src="/icons/search.svg" alt='search' />
                    </div>
                </div>
            </Form.Group>
        </Form>
    );
};

// Inline styles for suggestions list and items
const suggestionsListStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    maxHeight: '200px',
    overflowY: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const suggestionItemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
};

export default Search;
