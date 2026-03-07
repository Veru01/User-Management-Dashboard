import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import Navbar from './Navbaar';

const Graph = () => {
    const chartRef = useRef();
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/getusers');
                const userData = response.data;
                const data = processData(userData);
                drawBarGraph(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, []);

    const formatLocalDate = (d) => {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const processData = (userData) => {
        const lastSevenDays = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            lastSevenDays.push(formatLocalDate(date));
        }

        const userCountByDate = {};
        lastSevenDays.forEach(date => { userCountByDate[date] = 0; });

        userData.forEach(user => {
            if (!user.date) return;
            const date = user.date.split('T')[0];
            if (userCountByDate[date] !== undefined) userCountByDate[date]++;
        });

        const totalUsers = userData.length;
        return lastSevenDays.map(date => ({
            date,
            percentage: totalUsers ? (userCountByDate[date] / totalUsers) * 100 : 0,
        }));
    };

    const drawBarGraph = (data) => {
        if (!data || !chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.date),
                datasets: [{
                    label: '% of Users Added',
                    data: data.map(item => item.percentage),
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    borderRadius: 8,
                    barThickness: 32,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { font: { size: 13, weight: '600' }, color: 'rgba(255,255,255,0.7)' } },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Percentage (%)', font: { size: 13, weight: '600' }, color: 'rgba(255,255,255,0.5)' },
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: 'rgba(255,255,255,0.5)' },
                    },
                    x: {
                        title: { display: true, text: 'Date of Registration', font: { size: 13, weight: '600' }, color: 'rgba(255,255,255,0.5)' },
                        grid: { display: false },
                        ticks: { color: 'rgba(255,255,255,0.5)' },
                    },
                },
            },
        });
        chartInstanceRef.current = newChart;
    };

    return (
        <>
            <Navbar />
            <div className="graph-page">
                <div className="graph-card">
                    <h2>User Registration - Last 7 Days</h2>
                    <canvas ref={chartRef} style={{ width: '100%', maxHeight: '420px' }} />
                </div>
            </div>
        </>
    );
};

export default Graph;
