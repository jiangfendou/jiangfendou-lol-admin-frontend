import axios from "axios";
import router from "./router";
import Element from "element-ui";

// axios.defaults.baseURL = "http://8.136.17.98:8085"
axios.defaults.baseURL = "http://localhost:8085"

const request = axios.create({
    // 设置请求的超时时间
    timeout: 5000,
    headers: {
        'Content-type': "application/json; charset=utf-8"
    }
})

// 拦截请求
request.interceptors.request.use(config => {
    console.log("前端请求拦截器");
    config.headers['Authorization'] = localStorage.getItem("token");
    return config
})

// 拦截返回
request.interceptors.response.use(response => {
        console.log(response.data.httpStatus);
        var res = response.data;
        if (res.httpStatus === 'OK') {
            return response;
        } else {
            Element.Message.error(!res.apiError.message ? '系统异常' : res.apiError.message.message);
            return Promise.reject(res.apiError.message);
        }
    },
    error => {
        console.log("console.log(Promise.reject(error));");
        console.log(Promise.reject(error));
        return Promise.reject(error)
    })

export default request