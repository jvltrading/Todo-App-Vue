import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.8.35:5050"
});

export default api;