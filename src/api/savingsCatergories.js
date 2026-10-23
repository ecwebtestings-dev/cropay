import axiosClient from './AxiosClient'

const CATEGORY_ENDPOINT='/saving_category';

//GET CATERGORIES
export const GetCategory=()=>axiosClient.get(CATEGORY_ENDPOINT);
//CREATE CATEGORY
export const CreateSavingsCatergory =(Data)=>axiosClient.post(CATEGORY_ENDPOINT,Data);
//UPDATE CATEGORY
export const UpdateCatergory=(CategoryID,Data)=>axiosClient.patch(`${CATEGORY_ENDPOINT}/${CategoryID}`,Data);
//DELETE CATEGORY
export const DeleteCatergory = (CategoryID) =>axiosClient.delete(`${CATEGORY_ENDPOINT}/${CategoryID}`);
