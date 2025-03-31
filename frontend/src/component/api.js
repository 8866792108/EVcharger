import axios from "axios";
import { backendurls } from "../assets/utility";

const api = axios.create({
    baseURL:`${backendurls}/auth`
})

export const googleAuth = (code) => api.get(`/google?code=${code}`)