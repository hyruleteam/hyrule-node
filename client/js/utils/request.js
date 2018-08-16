axios.defaults.timeout = 15000

// respone拦截器
axios
    .interceptors
    .response
    .use(response => {
        if(response.data.code === -1){
            console.error(response.data.msg)
            // vant.Toast(response.data.msg)
        }

        if(response.data.code !== 0){ // 业务错误
            return Promise.reject(response.data.msg)
        }

        return response.data
    }, error => {
        return Promise.reject(error)
    })

export default axios
