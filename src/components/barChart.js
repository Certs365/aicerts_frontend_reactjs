import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; 
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from 'next/router';
import chart from '../services/chartServices';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getYears = (numYears) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: numYears }, (_, i) => currentYear - i);
};

function BarChart() {
    const [responseData, setResponseData] = useState(null);
    const [email, setEmail] = useState(''); // Placeholder email
    const [token, setToken] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false); // State to track loading status
    const [selectedFilter, setSelectedFilter] = useState("All");
    
    Chart.register(CategoryScale, LinearScale, BarElement, Title);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email);
        } else {
            router.push("/");
        }
    }, [router]);

    const fetchData = async (selectedYear) => {
        try {
            setLoading(true); // Set loading to true before making the API call
            const encodedEmail = encodeURIComponent(email);
            const endpoints ={
                selectedYear: selectedYear,
                encodedEmail
            }
            // const response = await fetch(`${apiUrl}/api/get-graph-data/${selectedYear}/${encodedEmail}`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            chart.graphData(endpoints, (response)=>{
                if (response.status !== "SUCCESS") {
                    throw new Error('Failed to fetch data');
                }
                const data = response.data;
                setResponseData(data.data);
            })


            // if (!response.ok) {
            //     throw new Error('Failed to fetch data');
            // }

            // const data = await response.json();
            // setResponseData(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // setTimeout(() => setLoading(false), 100);
            setLoading(false); // Set loading to false after the API call

        }
    };

    // @ts-ignore: Implicit any for children prop
    useEffect(() => {
        if(email){
            fetchData(year);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, email]);

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setSelectedFilter(filter);
    };

    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    const chartData = responseData ? {
        labels: labels,
        datasets: [
            {
                label: "Single Issued",
                backgroundColor: "#CFA935",
                borderColor: "#CFA935",
                data: responseData.map(item => item.count[0]),
                barPercentage: 0.5,
                categoryPercentage: 1.0,
                borderRadius:12
            },
            {
                label: "Batch Issued",
                backgroundColor: "#3D915E",
                borderColor: "#3D915E",
                data: responseData.map(item => item.count[1]),
                barPercentage: 0.5,
                categoryPercentage: 1.0,
                borderRadius:12

            },
        ],
    } : {
        labels: labels,
        datasets: [
            {
                label: "Single Issued",
                backgroundColor: "#CFA935",
                borderColor: "#CFA935",
                data: Array(12).fill(0),
                borderRadius: 6,
                barPercentage: 0.5,
                categoryPercentage: 1.0,
            },
            {
                label: "Batch Issued",
                backgroundColor: "#ffcf40",
                borderColor: "#ffcf40",
                data: Array(12).fill(0),
                borderRadius: 6,
                barPercentage: 0.5,
                categoryPercentage: 1.0
            },
        ],
    };

    const filteredChartData = {
        ...chartData,
        datasets: chartData.datasets.filter(dataset => 
            selectedFilter === "All" || dataset.label === selectedFilter
        ),
    };

    const getPadding = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 600) {
                return { left: 10, right: 10, top: 20, bottom: 20 };
            } else if (window.innerWidth < 900) {
                return { left: 50, right: 50, top: 50, bottom: 50 };
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
                    display: false,
                    position: "top",
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: true,
                    },
                    barPercentage: 0.6,  // Adjust this value for bar width
                    categoryPercentage: 0.5,  // Adjust this value for space between groups
                },
                y: {
                    grid: {
                        color: "rgba(0,0,0,0.2)",
                        borderDash: [5],
                    },
                    ticks: {
                        stepSize: 5, // Adjust the step size to 5
                        maxTicksLimit: 10, // Adjust the number of ticks
                        callback: function (value) {
                            return value;
                        },
                    },
                },
            },
            layout: {
                padding: getPadding(),
            },
        });
    }, []);

    return (
        <div style={{height:"300px"}} className="container outer-container">
            <div className="filter-options d-none d-md-flex">
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
                        value="Single Issued"
                        checked={selectedFilter === "Single Issued"}
                        onChange={handleFilterChange}
                    />
                    Single Issued
                </label>
                <label>
                    <input
                        type="radio"
                        value="Batch Issued"
                        checked={selectedFilter === "Batch Issued"}
                        onChange={handleFilterChange}
                    />
                    Batch Issued
                </label>
            </div>
            {loading ? (
                <div className="loader">
                    <div className="spinner-border text-danger" role="status">
                    </div>
                </div>
            ) : (
                <Bar
                    width={"100%"}
                    height={"90%"}
                    data={filteredChartData}
                    options={chartOptions}
                />
            )}

            <div className="filter-options d-flex d-md-none">
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
                        value="Single Issued"
                        checked={selectedFilter === "Single Issued"}
                        onChange={handleFilterChange}
                    />
                    Single Issued
                </label>
                <label>
                    <input
                        type="radio"
                        value="Batch Issued"
                        checked={selectedFilter === "Batch Issued"}
                        onChange={handleFilterChange}
                    />
                    Batch Issued
                </label>
            </div>
        </div>
    );
}

export default BarChart;
