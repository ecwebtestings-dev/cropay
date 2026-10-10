import axios from 'axios'

const axiosClient =axios.create({
    baseURL:import.meta.VITE_API_URL,
    headers:{Accept:'application/json'},

});


//ATTACH TOKEN TO ALL REQUESTs
axiosClient.interceptors.request.use((config)=>{
    const token =localStorage.getItem('Token');
    if (token) config.headers.Authorization=`Bearer ${token}`;
    return config;
})

//SUCESS AND ERROR HANDLER
axiosClient.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status==401 && localStorage.getItem('token')){
            window.dispatchEvent(new Event('auth:Expired'));
        }
        return Promise.reject(error)
    }
)

export default axiosClient