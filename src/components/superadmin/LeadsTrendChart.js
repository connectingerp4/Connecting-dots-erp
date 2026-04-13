"use client";
 
import { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
 
const LeadsTrendChart = ({ leads = [], type = "monthly", startDate, endDate }) => {
    const [mode, setMode] = useState(type === "weekly" ? "weekly" : "monthly");
 
    const generateChartData = (leads, mode, startDate, endDate) => {
        // Filter leads by date range if provided
        let filteredLeads = leads;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // End of day
            filteredLeads = leads.filter((lead) => {
                const rawDate = lead.createdAt || lead.created_at || lead.date || lead.timestamp;
                if (!rawDate) return false;
                const d = new Date(rawDate);
                return d >= start && d <= end;
            });
        }
 
        const now = new Date();
 
        if (mode === "weekly") {
            const startOfWeek = new Date(now);
            const day = startOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            startOfWeek.setDate(now.getDate() + diff);
 
            const days = [];
 
            for (let i = 0; i < 7; i++) {
                const currentDay = new Date(startOfWeek);
                currentDay.setDate(startOfWeek.getDate() + i);
 
                const prevDay = new Date(currentDay);
                prevDay.setDate(currentDay.getDate() - 7);
 
                let current = 0;
                let previous = 0;
 
                filteredLeads.forEach((lead) => {
                    const rawDate = lead.createdAt || lead.created_at || lead.date || lead.timestamp;
                    if (!rawDate) return;
 
                    const d = new Date(rawDate);
                    if (isNaN(d)) return;
 
                    const dStr = d.toISOString().split("T")[0];
                    const currentStr = currentDay.toISOString().split("T")[0];
                    const prevStr = prevDay.toISOString().split("T")[0];
 
                    if (dStr === currentStr) current++;
                    if (dStr === prevStr) previous++;
                });
 
                days.push({
                    name: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
                    current,
                    previous,
                });
            }
 
            return days;
        }
 
        if (mode === "monthly") {
            const dataMap = {};
 
            for (let i = 11; i >= 0; i--) {
                const current = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const prev = new Date(current);
                prev.setFullYear(current.getFullYear() - 1);
 
                const key = current.toLocaleString("default", { month: "short" });
 
                dataMap[key] = {
                    current: 0,
                    previous: 0,
                    currentKey: current.toISOString().slice(0, 7),
                    prevKey: prev.toISOString().slice(0, 7),
                };
            }
 
            filteredLeads.forEach((lead) => {
                const rawDate = lead.createdAt || lead.created_at || lead.date || lead.timestamp;
                if (!rawDate) return;
 
                const d = new Date(rawDate);
                if (isNaN(d)) return;
 
                const leadMonthKey = d.toISOString().slice(0, 7);
 
                Object.values(dataMap).forEach((item) => {
                    if (leadMonthKey === item.currentKey) item.current++;
                    if (leadMonthKey === item.prevKey) item.previous++;
                });
            });
 
            return Object.keys(dataMap).map((key) => ({
                name: key,
                current: dataMap[key].current,
                previous: dataMap[key].previous,
            }));
        }
 
        if (mode === "yearly") {
            const currentYear = now.getFullYear();
            const dataMap = {};
 
            for (let i = 4; i >= 0; i--) {
                dataMap[currentYear - i] = 0;
            }
 
            filteredLeads.forEach((lead) => {
                const rawDate = lead.createdAt || lead.created_at || lead.date || lead.timestamp;
                if (!rawDate) return;
 
                const d = new Date(rawDate);
                if (isNaN(d)) return;
 
                const year = d.getFullYear();
                if (dataMap[year] !== undefined) dataMap[year]++;
            });
 
            return Object.keys(dataMap).map((key) => ({
                name: key,
                leads: dataMap[key],
            }));
        }
 
        return [];
    };
 
    const chartData = useMemo(
        () => generateChartData(leads, mode, startDate, endDate) || [],
        [leads, mode, startDate, endDate]
    );
 
    const hasData = chartData.some((item) =>
        (item.current ?? 0) > 0 || (item.previous ?? 0) > 0 || (item.leads ?? 0) > 0
    );
 
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                    {mode === "weekly"
                        ? "Weekly Comparison (Current vs Previous)"
                        : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Distribution of Leads`}
                </h3>
 
                {type !== "weekly" && (
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        {["monthly", "yearly"].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-3 py-1 text-sm rounded-md transition ${
                                    mode === m
                                        ? "bg-white shadow text-blue-600 font-semibold"
                                        : "text-gray-600"
                                }`}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>
 
            {mode !== "yearly" && (
                <div className="flex justify-end mb-2">
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span>{mode === "weekly" ? "Current Week" : "Current Year"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>{mode === "weekly" ? "Previous Week" : "Previous Year"}</span>
                        </div>
                    </div>
                </div>
            )}
 
            {!hasData ? (
                <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    No lead data available for this period
                </div>
            ) : (
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height={256}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" allowDecimals={false} />
                            <Tooltip />
 
                            {mode !== "yearly" && (
                                <>
                                    <Line type="monotone" dataKey="current" stroke="#2563eb" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="previous" stroke="#ef4444" strokeWidth={3} dot={false} />
                                </>
                            )}
 
                            {mode === "yearly" && (
                                <Line type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={3} dot={false} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
 
export default LeadsTrendChart;
 
 