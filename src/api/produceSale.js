
import axiosClient from "./AxiosClient";

const PRODUCT_SALES_ENDPOINT = "/product_sales";
const ADMIN_PRODUCT_SALES_ENDPOINT = "/admin/product_sales";

// PRODUCE SALE REQUEST
export const createProductSale = (saleData) =>axiosClient.post(PRODUCT_SALES_ENDPOINT, saleData);

// FETCHE PRODUCE SALE REQUESTS
export const getAdminProductSales = (params = {}) =>axiosClient.get(ADMIN_PRODUCT_SALES_ENDPOINT, { params });

