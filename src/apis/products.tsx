import axios from "axios"
import type { APIResponse } from "../types/api.types"

/**
 * Fetches all products from the Fake Store API.
 *
 * @async
 * @function getAllProductsApi
 * @returns {Promise<APIResponse>} - The response object containing success status and data or error message.
 */
export async function getAllProductsApi(): Promise<APIResponse> {
  return axios
    .get("https://fakestoreapi.com/products")
    .then(function (response) {
      if (!response.data) {
        return {
          error: "No data response",
          success: false,
        } as APIResponse
      }
      return {
        success: true,
        data: response.data,
      } as APIResponse
    })
    .catch(function (error) {
      return {
        error: error.message,
        success: false,
      } as APIResponse
    })
}

/**
 * Fetches a single product by ID from the Fake Store API.
 *
 * @async
 * @function getSingleProductApi
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<APIResponse>} - The response object containing success status and product data or error message.
 */
export async function getSingleProductApi(id: number): Promise<APIResponse> {
  return axios
    .get(`https://fakestoreapi.com/products/${id}`)
    .then(function (response) {
      if (!response.data) {
        return {
          error: "No data response",
          success: false,
        } as APIResponse
      }
      return {
        success: true,
        data: response.data,
      } as APIResponse
    })
    .catch(function (error) {
      return {
        error: error.message,
        success: false,
      } as APIResponse
    })
}
