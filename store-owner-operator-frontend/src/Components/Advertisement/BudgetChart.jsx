import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetChart = ({ adData }) => {
    if (!adData) {
        return <div>Loading...</div>;
    }

    const chartData = {
        labels: ['Budget Left', 'Total Budget'],
        datasets: [{
            data: [adData.budgetLeft, (adData.billablePrice/100) - adData.budgetLeft],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: $${value.toFixed(2)}`;
                    }
                }
            }
        }
    };


    return (
        <div className='flex flex-col justify-center w-72 bg-white shadow-lg rounded-lg p-4'>
            <h2 className='flex justify-center text-xl font-semibold text-gray-700-800 mb-4'>Budget Consumption</h2>
            <div className="w-64 h-64 mb-4 flex justify-center "> {/* Adjust the size here */}
                <Doughnut data={chartData} options={options} />
            </div>
            <h3 className='text-sm mb-2'> Budget Left: ${adData.budgetLeft}</h3>
            <h3 className='text-sm'> Original Budget: ${adData.billablePrice/100}</h3>
        </div>
    );
    
    
};

export default BudgetChart;
