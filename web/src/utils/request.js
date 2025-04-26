import axios from "axios";
import { message } from 'antd';
// import { createHashHistory } from 'history';
// const history = createHashHistory();


/**
 * axios interceptor
 */
axios.interceptors.request.use(config => {
    console.log("request:", config);
    let token = global.tools.getLoginUser();
    console.log("get token:", token);
    if (global.tools.isNotEmpty(token)) {
        config.headers.token = token;
        console.log("请求headers增加token:", token);
    }
    return config;
}, error => {});


axios.interceptors.response.use(response => {
    console.log("返回结果：", response);
    return response;
}, error => {
    return Promise.reject(error);
});

