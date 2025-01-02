import axios from 'axios';

import { layer } from '@layui/layui-vue';

export const config= {
    baseURL :"http://127.0.0.1:7083",
    timeout :10000
}
export var showSet=false;


class Http {
    service;
    constructor(config) {
        this.service = axios.create(config)
        /* 请求拦截 */
      
        

        /* 响应拦截 */
        this.service.interceptors.response.use(
            response => {
                const strMsg="请求失败,状态码："+response.status.toString()
            switch (response.status) {
                case 200:
                    return response.data;
                default:
                    layer.msg(strMsg,{icon:2})
                    break;
            }
        },error=>{
            const strMsg="服务器异常:"+error.message
            layer.msg(strMsg,{icon:2})
        }
        )
    }

    /* GET 方法 */
    get(url, params, _object = {}) {
        
        return this.service.get(url, { params, ..._object })
    }
    /* POST 方法 */
    post(url, params, _object = {}) {
        return this.service.post(url, params, _object)
    }
    /* PUT 方法 */
    put(url, params, _object = {}) {
        return this.service.put(url, params, _object)
    }
    /* DELETE 方法 */
    delete(url,params, _object = {}) {
        return this.service.delete(url, { params, ..._object })
    }
    RefreshUrl(){
        this.service = axios.create(config)
        this.service.interceptors.response.use(
            response => {
                const strMsg="请求失败,状态码："+response.status.toString()
            switch (response.status) {
                case 200:
                    return response.data;
                default:
                    layer.msg(strMsg,{icon:2})
                    break;
            }
        },error=>{
            const strMsg="服务器异常:"+error.message
            layer.msg(strMsg,{icon:2})
        }
        )
    }
}

export default new Http(config)
