const API_URL = "https://motion-blur-experiment.onrender.com/api"


export async function sendDataToServer(responseData){
  try {
    const res = await fetch(`${API_URL}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseData),
    });
    const data = await res.json();
    console.log("Server Response:", data);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
// export default async function sendDataToServer(responseData){
//     try {
//       const res = await fetch("http://localhost:5000/api/responses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(responseData),
//       });
//       const data = await res.json();
//       console.log("Server Response:", data);
//     } catch (error) {
//       console.error("Error sending data:", error);
//     }
//   };

  export function getProlificID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("PROLIFIC_PID") || "unknown";
  }