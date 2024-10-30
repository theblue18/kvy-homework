import { getAllCategoriesApi } from "../apis/data"

/**
 * Fetches the initial data required for the application, specifically the categories.
 *
 * @returns {Promise<APIResponse>} - A promise resolving to the API response containing the list of categories.
 */
export async function getInitData() {
  let categoriesData = await getAllCategoriesApi()
  return categoriesData
}
