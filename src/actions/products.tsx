import {
  getAllProductsApi,
  getSingleProductApi,
} from "../apis/products"
import type { Product } from "../types/common.types"

/**
 * Fetches all products by calling the API and returns the result.
 *
 * @returns {Promise<APIResponse>} - A promise resolving to the API response containing all products data.
 */
export async function getAllProducts() {
  let result = await getAllProductsApi()
  return result
}

/**
 * Fetches details of a single product by its ID.
 *
 * @param {number} productId - The ID of the product to fetch.
 * @returns {Promise<APIResponse>} - A promise resolving to the API response with product details.
 */
export async function getProductDetail(productId: number) {
  return await getSingleProductApi(productId)
}

/**
 * Fetches product details if the product is not present in the existing product list.
 *
 * @param {number} productId - The ID of the product to fetch.
 * @param {Product[]} existingProducts - Array of already fetched products.
 * @returns {Promise<Product | null>} - The product data if successfully fetched, or null if already exists in the list or fetch failed.
 */
export async function fetchProduct(
  productId: number,
  existingProducts: Product[]
): Promise<Product | null> {
  // Check if product exists in the provided list
  const productExists = existingProducts.some((p) => p.id === productId)

  // If product doesn't exist, fetch from API
  if (!productExists) {
    const productRes = await getProductDetail(productId)
    if (productRes.success) {
      return productRes.data as Product
    }
  }

  // Return null if product is already in the list or fetch failed
  return null
}
