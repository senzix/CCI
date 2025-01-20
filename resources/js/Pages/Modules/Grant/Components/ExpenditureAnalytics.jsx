import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { formatCurrency } from '@/utils';

export default function ExpenditureAnalytics({ expenditures = [], grant }) {
    const categoryChartRef = useRef(null);
    const trendChartRef = useRef(null);

    useEffect(() => {
        // Category-wise spending chart
        const categoryData = expenditures.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
            return acc;
        }, {});

        const categoryChart = new Chart(categoryChartRef.current, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                        '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'
                    ]
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Expenditure by Category'
                    }
                }
            }
        });

        // Monthly trend chart
        const monthlyData = expenditures.reduce((acc, exp) => {
            const month = new Date(exp.date).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + parseFloat(exp.amount);
            return acc;
        }, {});

        const trendChart = new Chart(trendChartRef.current, {
            type: 'line',
            data: {
                labels: Object.keys(monthlyData),
                datasets: [{
                    label: 'Monthly Expenditure',
                    data: Object.values(monthlyData),
                    borderColor: '#3B82F6',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Spending Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => formatCurrency(value)
                        }
                    }
                }
            }
        });

        return () => {
            categoryChart.destroy();
            trendChart.destroy();
        };
    }, [expenditures]);

    const totalSpent = expenditures.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const remainingBudget = parseFloat(grant.amount) - totalSpent;
    const spendingPercentage = (totalSpent / grant.amount) * 100;

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Expenditure Analysis
                </h3>

                {/* Budget Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">Total Budget</div>
                        <div className="text-2xl font-semibold">{formatCurrency(grant.amount)}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 mb-1">Total Spent</div>
                        <div className="text-2xl font-semibold">{formatCurrency(totalSpent)}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-600 mb-1">Remaining</div>
                        <div className="text-2xl font-semibold">{formatCurrency(remainingBudget)}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Budget Utilization</span>
                        <span>{spendingPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${spendingPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <canvas ref={categoryChartRef}></canvas>
                    </div>
                    <div>
                        <canvas ref={trendChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
} 