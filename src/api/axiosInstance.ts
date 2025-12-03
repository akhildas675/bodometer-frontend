import axios, { type AxiosInstance } from "axios";
import { baseUrl } from "./baseUrl";



export type Role = "user" 

const roleToTokenKey:Record<Role,string>={
    user:"userAccessToken"
}

const roleToRedirectPath:Record<Role,string>={
    user: "/user/login",
}



//custom axios clients with specific config per role

export function createAxiosInstance(role:Role):AxiosInstance{
    const instance = axios.create({
        baseURL:`${baseUrl}/api/${role}`,
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        },
    });

    instance.interceptors.request.use((config)=>{
        const tokenKey = roleToTokenKey[role];
        const token = localStorage.getItem(tokenKey);

        if(token){
            config.headers = config.headers || {};
            config.headers["Authorization"]=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
);


instance.interceptors.response.use((response)=>response,(error)=>{
    if(error.response?.status===401){
        window.location.href=roleToRedirectPath[role];
    }
    return Promise.reject(error);
})

return instance

}

export const userInstance = createAxiosInstance("user")
