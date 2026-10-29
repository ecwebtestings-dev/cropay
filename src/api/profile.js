import axiosClient from './AxiosClient'

const USER_PROFILE ="/user_profile"

//GET USER PROFILE
export const UserProfile =()=>axiosClient.get(`${USER_PROFILE}`)

//UPDATE USER PROFILE
export const updateUserProfile =(userData)=>axiosClient.patch(`${USER_PROFILE}`,userData)