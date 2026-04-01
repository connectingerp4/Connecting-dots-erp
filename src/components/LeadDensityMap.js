"use client";

import { useEffect, useState } from "react";
import {
  GoogleMap,
  HeatmapLayer,
  useLoadScript,
} from "@react-google-maps/api";

// 🔑 YOUR KEY (keep same)
const GOOGLE_MAPS_API_KEY = "AIzaSyDc4NXYQUZTxNJT79CSQl3pxUQ_-mDeKMw";

// ==============================
// ✅ LOAD GOOGLE MAPS SAFELY
// ==============================
const libraries = ["visualization"];


// ==============================
// ✅ CLEAN CITY EXTRACTION
// ==============================
const extractCity = (input) => {
  if (!input) return "";

  let city = String(input).toLowerCase().trim();

  if (
    city.includes("submission") ||
    city.includes("form") ||
    city.includes("online") ||
    city.length > 40 ||
    city.match(/[0-9a-f-]{10,}/)
  ) {
    return "";
  }

  const parts = city.split(/[,/()-]/).map((p) => p.trim());

  city = parts.reverse().find((p) => p.length > 2) || "";

  const corrections = {
    banglore: "bangalore",
    bengaluru: "bangalore",
    pimprichinchwad: "pimpri chinchwad",
  };

  city = corrections[city] || city;

  return city;
};

// ==============================
// ✅ MAIN COMPONENT
// ==============================
export default function LeadDensityMap({ data = [] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [heatData, setHeatData] = useState([]);

  useEffect(() => {
    if (!isLoaded) return; // 🔥 WAIT FOR GOOGLE
    if (!Array.isArray(data)) return;

    const process = async () => {
      const merged = {};

      // STEP 1: CLEAN
      data.forEach((item) => {
        const city = extractCity(item?._id);
        if (!city) return;

        merged[city] =
          (merged[city] || 0) + (Number(item.count) || 0);
      });

      const results = [];

      // STEP 2: GEOCODE
      for (const city in merged) {
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${GOOGLE_MAPS_API_KEY}`
          );

          const json = await res.json();

          if (json.results?.length) {
            const loc = json.results[0].geometry.location;

            results.push({
              location: new window.google.maps.LatLng(
                loc.lat,
                loc.lng
              ),
              weight: merged[city],
            });
          }
        } catch (err) {
          console.error("Geocode failed:", city);
        }
      }

      setHeatData(results);
    };

    process();
  }, [data, isLoaded]);

  // 🔥 prevent rendering before ready
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        zoom={5}
        center={{ lat: 20.5937, lng: 78.9629 }}
        options={{
          minZoom: 4, // ✅ prevents excessive zoom out
          restriction: {
            latLngBounds: {
              north: 35,
              south: 5,
              east: 97,
              west: 65,
            },
            strictBounds: false, // ✅ IMPORTANT (true breaks map sometimes)
          },
        }}
      >
        {heatData.length > 0 && (
          <HeatmapLayer
            data={heatData}
            options={{
              radius: 30,
              opacity: 0.8,
              gradient: [
                "rgba(0,0,255,0)",   // 🔵 blue low
                "rgba(0,0,255,1)",
                "rgba(255,255,0,1)", // yellow
                "rgba(255,165,0,1)", // orange
                "rgba(255,0,0,1)",   // red
              ],
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}