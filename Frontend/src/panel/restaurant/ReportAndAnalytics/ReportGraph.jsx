import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function ReportGraph({ data, labels, activeTab }) {
    // Define graph colors based on the active tab
    const colors = {
        day: {
            borderColor: 'rgb(34, 197, 94)', // Green
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        week: {
            borderColor: 'rgb(249, 115, 22)', // Orange
            backgroundColor: 'rgba(249, 115, 22, 0.5)',
        },
        month: {
            borderColor: 'rgb(59, 130, 246)', // Blue
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
    };

    const chartData = {
        labels,
        datasets: [
            {
                label: `Transactions (${activeTab})`,
                data,
                borderColor: colors[activeTab].borderColor,
                backgroundColor: colors[activeTab].backgroundColor,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={chartData} options={options} />;
}
