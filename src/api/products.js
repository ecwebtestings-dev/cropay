
import axiosClient from "./AxiosClient";

const PRODUCTS_ENDPOINT = "/products";

// Get all products
export const getProducts = () =>axiosClient.get(PRODUCTS_ENDPOINT);
// Create a produc
export const createProduct = (productData) =>axiosClient.post(PRODUCTS_ENDPOINT, productData);
// Update 
export const updateProduct = (productId, productData) =>axiosClient.patch(`${PRODUCTS_ENDPOINT}/${productId}`,productData);
// Delete 
export const deleteProduct = (productId) =>axiosClient.delete(`${PRODUCTS_ENDPOINT}/${productId}`);
