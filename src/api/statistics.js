import axiosClient from './AxiosClient'

export const getDashboardstatistics = ()=>axiosClient.get('/admin/stats');