// config
const host = window.location.host;
console.log("host", host);
export const serverUrl = host.includes("localhost")
  ? "http://127.0.0.1:3000"
  : "http://NetworkIP:3000";
