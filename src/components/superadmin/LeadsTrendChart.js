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

const LeadsTrendChart = ({ leads = [], type = "monthly" }) => {
    const [mode, setMode] = useState(type === "weekly" ? "weekly" : "monthly");

    const generateChartData = (leads, mode) => {
        const now = new Date();

        // ================= WEEKLY (FIXED) =================
        if (mode === "weekly") {
            const startOfWeek = new Date(now);
            const day = startOfWeek.getDay(); // 0 = Sun, 1 = Mon

            // convert to Monday start
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

                leads.forEach((lead) => {
                    const d = new Date(lead.createdAt);

                    // CURRENT WEEK MATCH
                    if (
                        d.getDate() === currentDay.getDate() &&
                        d.getMonth() === currentDay.getMonth() &&
                        d.getFullYear() === currentDay.getFullYear()
                    ) {
                        current++;
                    }

                    // PREVIOUS WEEK MATCH
                    if (
                        d.getDate() === prevDay.getDate() &&
                        d.getMonth() === prevDay.getMonth() &&
                        d.getFullYear() === prevDay.getFullYear()
                    ) {
                        previous++;
                    }
                });

                days.push({
                    name: currentDay.toLocaleDateString("en-US", {
                        weekday: "short",
                    }),
                    current,
                    previous,
                });
            }

            return days;
        }
        // ================= MONTHLY (KEEP SAME) =================
        if (mode === "monthly") {
            const months = [];

            // build rolling 12 months
            for (let i = 11; i >= 0; i--) {
                const current = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const prev = new Date(current);
                prev.setFullYear(current.getFullYear() - 1);

                months.push({
                    label: current.toLocaleString("default", { month: "short" }),
                    currentDate: current,
                    prevDate: prev,
                    current: 0,
                    previous: 0,
                });
            }

            leads.forEach((lead) => {
                const d = new Date(lead.createdAt);

                months.forEach((m) => {
                    if (
                        d.getMonth() === m.currentDate.getMonth() &&
                        d.getFullYear() === m.currentDate.getFullYear()
                    ) {
                        m.current++;
                    }

                    if (
                        d.getMonth() === m.prevDate.getMonth() &&
                        d.getFullYear() === m.prevDate.getFullYear()
                    ) {
                        m.previous++;
                    }
                });
            });

            return months.map((m) => ({
                name: m.label,
                current: m.current,
                previous: m.previous,
            }));
        }
        // ================= YEARLY =================
        if (mode === "yearly") {
            const currentYear = now.getFullYear();
            const dataMap = {};

            for (let i = 4; i >= 0; i--) {
                const year = currentYear - i;
                dataMap[year] = 0;
            }

            leads.forEach((lead) => {
                const year = new Date(lead.createdAt).getFullYear();
                if (dataMap[year] !== undefined) {
                    dataMap[year]++;
                }
            });

            return Object.keys(dataMap).map((key) => ({
                name: key,
                leads: dataMap[key],
            }));
        }
    };

    const chartData = useMemo(
        () => generateChartData(leads, mode),
        [leads, mode]
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            {/* HEADER */}
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
                                className={`px-3 py-1 text-sm rounded-md transition ${mode === m
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
                            <span>
                                {mode === "weekly" ? "Current Week" : "Current Year"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>
                                {mode === "weekly" ? "Previous Week" : "Previous Year"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* CHART */}
            <div className="w-full h-64">
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />

                        {mode !== "yearly" && (
                            <>
                                <Line type="monotone" dataKey="current" stroke="#2563eb" strokeWidth={3} />
                                <Line type="monotone" dataKey="previous" stroke="#ef4444" strokeWidth={3} />
                            </>
                        )}

                        {mode === "yearly" && (
                            <Line type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={3} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LeadsTrendChart;