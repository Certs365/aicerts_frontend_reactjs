import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale, LinearScale, BarElement } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from 'next/router';
import DatePicker from "react-datepicker";
import { AiOutlineCalendar, AiOutlineDown } from 'react-icons/ai';
import calenderIcon from "../../public/icons/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

function BarChartSecond() {
    Chart.register(CategoryScale, LinearScale, BarElement);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [originalData, setOriginalData] = useState({
        labels: [],
        datasets: [],
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [token, setToken] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("All");

    const [barThickness, setBarThickness] = useState(20); // Default bar thickness

    // Determine screen size and adjust bar thickness
    useEffect(() => {
        const updateBarThickness = () => {
            if (window.innerWidth < 768) { // If mobile screen
                setBarThickness(10); // Thinner bars for mobile
            } else {
                setBarThickness(20); // Default bar thickness for larger screens
            }
        };

        window.addEventListener("resize", updateBarThickness);
        updateBarThickness(); // Set the initial bar thickness based on screen size

        return () => window.removeEventListener("resize", updateBarThickness);
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email);
        } else {
            router.push("/");
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const currentYear = new Date().getFullYear();
                const selectedYear = date.getFullYear();

                if (selectedYear !== currentYear) {
                    updateChartData([], `${selectedYear}`);
                    return;
                }

                const encodedEmail = encodeURIComponent(email);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const response = await fetch(`${apiUrl}/api/get-status-graph-data/${month}/${encodedEmail}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                updateChartData(data.data, `${year}-${month}`);
            } catch (error) {
                // console.error('Error fetching data:', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData(selectedDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, email]);

    const updateChartData = (data, option) => {
        const isYearSelected = option.length === 4; // Check if option is a year
        const issuedData = Array(isYearSelected ? 12 : 31).fill(0);
        const reactivatedData = Array(isYearSelected ? 12 : 31).fill(0);
        const revokedData = Array(isYearSelected ? 12 : 31).fill(0);
        const expiredData = Array(isYearSelected ? 12 : 31).fill(0);

        data.forEach((item) => {
            const index = isYearSelected ? item.month - 1 : item.day - 1;
            issuedData[index] = item.count[0];
            expiredData[index] = item.count[1];
            revokedData[index] = item.count[2];
            reactivatedData[index] = item.count[3];
        });

        const updatedData = {
            labels: isYearSelected
                ? ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
                : Array.from({ length: 31 }, (_, i) => i + 1),
            datasets: [
                {
                    label: "Issued",
                    backgroundColor: "#FF885B",
                    borderColor: "#FF885B",
                    data: issuedData,
                    barThickness: barThickness,
                    borderRadius: 6,
                    tension: 0.4,
                    barPercentage: 0.5,
                    categoryPercentage: 1.0
                },
                {
                    label: "Reissued",
                    backgroundColor: "#FABC3F",
                    borderColor: "#FABC3F",
                    data: expiredData,
                    barThickness: barThickness,
                    borderRadius: 6,
                    tension: 0.4,
                    barPercentage: 0.5,
    categoryPercentage: 1.0
                },
                {
                    label: "Reactivated",
                    backgroundColor: "#4D9891",
                    borderColor: "#4D9891",
                    data: reactivatedData,
                    // barThickness: 10,
                    borderRadius: 6,
                    tension: 0.4,
                    barPercentage: 0.5,
                    categoryPercentage: 1.0
                },
                {
                    label: "Revoked",
                    backgroundColor: "#EE2A3A",
                    borderColor: "#EE2A3A",
                    data: revokedData,
                    // barThickness: 10,
                    borderRadius: 6,
                    tension: 0.4,
                    barPercentage: 0.5,
                    categoryPercentage: 1.0
                },
            ],
        };

        setOriginalData(updatedData);
        filterChartData(selectedFilter, updatedData);
    };

    const filterChartData = (filter, data = originalData) => {
        if (filter === "All") {
            setChartData(data);
        } else {
            const filteredDatasets = data.datasets.filter(dataset => dataset.label === filter);
            setChartData({
                labels: data.labels,
                datasets: filteredDatasets,
            });
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setSelectedFilter(filter);
        filterChartData(filter);
    };

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <div className="custom-date-input" onClick={onClick} ref={ref}>
            <Image className="me-2" width={26} height={26} src={calenderIcon} alt="Calendar Icon" />
            <span>{value}</span>
            <AiOutlineDown className="icon-down" />
        </div>
    ));
    CustomInput.displayName = "CustomInput";

    const getPadding = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 600) {
                return { left: 10, right: 10, top: 50, bottom: 20 };
            } else if (window.innerWidth < 900) {
                return { left: 20, right: 20, top: 50, bottom: 50 };
            } else {
                return { left: 50, right: 50, top: 50, bottom: 50 };
            }
        }
        return { left: 50, right: 50, top: 50, bottom: 50 }; // Default padding
    };

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        setChartOptions({
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
            },
            scales: {
            
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: true,
                        font: {
                            size: window.innerWidth < 600 ? 8 : 12 // Adjust label size for small screens
                        }
                    },
                    // barPercentage: window.innerWidth < 600 ? 0.2 : 0.6, // Adjust bar width for mobile
                    // categoryPercentage: 0.5,
                },
                y: {
                    grid: {
                        color: "rgba(0,0,0,0.2)",
                        borderDash: [5],
                    },
                    ticks: {
                        stepSize: 5, // Adjust the step size to 5
                        maxTicksLimit: 10, // Adjust the number of ticks
                        font: {
                            size: window.innerWidth < 600 ? 8 : 12 // Adjust label size for small screens
                        },
                        callback: function (value) {
                            return value;
                        },
                    },
                },
          
            },
            layout: {
                padding: getPadding()
            },
        });
    }, []);

    return (
        <div  className="container outer-container p-0" style={{height:"300px"}}>
            <div className="chart-date">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    customInput={<CustomInput />}
                    className="form-control"
                />
            </div>
            <div className="filter-options d-none d-md-flex " >
                <label>
                    <input
                        type="radio"
                        value="All"
                        checked={selectedFilter === "All"}
                        onChange={handleFilterChange}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        value="Issued"
                        checked={selectedFilter === "Issued"}
                        onChange={handleFilterChange}
                    />
                    Issued
                </label>
                <label>
                    <input
                        type="radio"
                        value="Reissued"
                        checked={selectedFilter === "Reissued"}
                        onChange={handleFilterChange}
                    />
                    Reissued
                </label>
                <label>
                    <input
                        type="radio"
                        value="Reactivated"
                        checked={selectedFilter === "Reactivated"}
                        onChange={handleFilterChange}
                    />
                    Reactivated
                </label>
                <label>
                    <input
                        type="radio"
                        value="Revoked"
                        checked={selectedFilter === "Revoked"}
                        onChange={handleFilterChange}
                    />
                    Revoked
                </label>
            </div>

            {loading ? (
                <div className="loader">
                <div className="spinner-border text-danger" role="status">
                </div>
            </div>
            ) : (
                    <Bar data={chartData} options={chartOptions} width={"100%"}
                    height={"90%"}/>
            )}
        </div>
    );
}

export default BarChartSecond;
