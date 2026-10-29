import axiosClient from "./AxiosClient";

const PRODUCT_SALES_ENDPOINT = "/product_sales";
const ADMIN_PRODUCT_SALES_ENDPOINT = "/product_sales/admin";

// CREATE A PRODUCE SALE REQUEST
export const createProductSale = (saleData) =>axiosClient.post(PRODUCT_SALES_ENDPOINT, saleData);

// FETCH ADMIN PRODUCE SALE REQUESTS
export const getAdminProductSales = (params = {}) =>axiosClient.get(ADMIN_PRODUCT_SALES_ENDPOINT, { params });

// UPDATE PRODUCE SALE STATUS
export const ChangeStatus = (saleData, saleID) =>axiosClient.patch(`${PRODUCT_SALES_ENDPOINT}/${saleID}`,saleData);
