import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { CategoryScale, LinearScale, ArcElement, Title } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from 'next/router';
import chart from '../services/chartServices';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getYears = (numYears) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: numYears }, (_, i) => currentYear - i);
};

function PieChart() {
    const [responseData, setResponseData] = useState(null);
    const [email, setEmail] = useState(''); // Placeholder email
    const [token, setToken] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false); // State to track loading status
    const [selectedFilter, setSelectedFilter] = useState("All");

    Chart.register(CategoryScale, LinearScale, ArcElement, Title);
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
            // const response = await fetch(`${apiUrl}/api/get-graph-data/${selectedYear}/${encodedEmail}`, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            const endpoints ={
                selectedYear: selectedYear,
                encodedEmail: encodedEmail
            }
            chart.graphData(endpoints, (response)=>{
                if (response.status !== "SUCCESS") {
                    console.error('Failed to fetch data');
                    // throw new Error('Failed to fetch data');
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
            setLoading(false); // Set loading to false after the API call
        }
    };

    useEffect(() => {
        if (email) {
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

    const chartData = responseData ? {
        labels: ["Single Issued", "Batch Issued"],
        datasets: [
            {
                label: "Counts",
                backgroundColor: ["#CFA935", "#3D915E"],
                borderColor: ["#CFA935", "#3D915E"],
                data: [
                    responseData.reduce((acc, item) => acc + item.count[0], 0),
                    responseData.reduce((acc, item) => acc + item.count[1], 0)
                ],
                borderWidth: 1,
            },
        ],
    } : {
        labels: ["A1", "A2"],
        datasets: [
            {
                label: "Counts",
                backgroundColor: ["#CFA935", "#ffcf40"],
                borderColor: ["#CFA935", "#ffcf40"],
                data: [0, 0],
                borderWidth: 1,
            },
        ],
    };

    const filteredChartData = {
        ...chartData,
        datasets: chartData.datasets.map(dataset => {
            if (selectedFilter === "All") return dataset;
            if (selectedFilter === "Single Issued") {
                return {
                    ...dataset,
                    data: [dataset.data[0]],
                    backgroundColor: [dataset.backgroundColor[0]],
                    borderColor: [dataset.borderColor[0]]
                };
            }
            if (selectedFilter === "Batch Issued") {
                return {
                    ...dataset,
                    data: [dataset.data[1]],
                    backgroundColor: [dataset.backgroundColor[1]],
                    borderColor: [dataset.borderColor[1]]
                };
            }
            return dataset;
        }),
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
                    display: true,
                    position: "top",
                },
            },
            layout: {
                padding: getPadding(),
            },
        });
    }, []);

    return (
        <div className="container outer-container">
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
                <Pie
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

export default PieChart;
