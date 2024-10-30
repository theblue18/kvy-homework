import axios from "axios"
import type { APIResponse } from "../types/api.types"

/**
 * Fetches all product categories from the Fake Store API.
 *
 * @async
 * @function getAllCategoriesApi
 * @returns {Promise<APIResponse>} - The response object containing the success status and categories data or an error message.
 */
export async function getAllCategoriesApi(): Promise<APIResponse> {
  return axios
    .get("https://fakestoreapi.com/products/categories")
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
