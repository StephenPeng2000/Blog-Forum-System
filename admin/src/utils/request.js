import axios from "axios";
import { message } from 'antd';
// import { createHashHistory } from 'history';
// const history = createHashHistory();


/**
 * Axios interceptor
 */
axios.interceptors.request.use(config => {
    console.log("Request:", config);
    let token = global.tools.getLoginAdmin();
    console.log("Retrieved token:", token);
    if (global.tools.isNotEmpty(token)) {
        config.headers.token = token;
        console.log("Added token to request headers:", token);
    }
    return config;
}, error => {});


axios.interceptors.response.use(response => {
    console.log("Response:", response);
    if(response.data.code === -6) {
        message.error(response.data.msg);
        window.location.hash = "/login";
        return Promise.reject(response.data.msg);
    } else {
       return response;
    }
}, error => {
    return Promise.reject(error);
});

