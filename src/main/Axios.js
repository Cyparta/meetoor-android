import axios from "axios";

// export const test = axios.create({
//     baseURL: "https://67.205.138.191:8000/api/",
//     headers: {
//         'Content-Type': 'application/json; charset=UTF-8'
//     }
// });

export default axios.create({
    baseURL: "https://meetoor.com/api/",
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        // 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
});