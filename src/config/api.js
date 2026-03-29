export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

if (!API_URL) {
  console.error("API_URL undefined");
}

console.log("API URL:", API_URL);
