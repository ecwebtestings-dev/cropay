
import axiosClient from "./AxiosClient";

const PRODUCTS_ENDPOINT = "/products";

// FETCH ALL PRODUCTS
export const getProducts = (params = {}) =>axiosClient.get(PRODUCTS_ENDPOINT, { params });

// CREATE A PRODUCT
export const createProduct = (productData) =>axiosClient.post(PRODUCTS_ENDPOINT, productData);

// UPDATE AN EXISTING PRODUCT
export const updateProduct = (productId, productData) =>axiosClient.patch(`${PRODUCTS_ENDPOINT}/${productId}`, productData);

// DELETE A PRODUCT
export const deleteProduct = (productId) =>axiosClient.delete(`${PRODUCTS_ENDPOINT}/${productId}`);
