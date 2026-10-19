
import axiosClient from "./AxiosClient";

const PRODUCT_SALES_ENDPOINT = "/product_sales";
// Create a produce sale
export const createProductSale = (saleData) =>axiosClient.post(PRODUCT_SALES_ENDPOINT, saleData);
// Get product Sales
export const getProductSales = () =>axiosClient.get(PRODUCT_SALES_ENDPOINT);
// Get product Sales
export const getAdminProductSales = () =>axiosClient.get("/v1/admin/product_sales");
