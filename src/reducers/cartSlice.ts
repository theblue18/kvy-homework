// cartSlice.ts

import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../stores/store"
import type { ProductInCart, ShoppingCartProduct } from "../types/common.types"
import * as R from "ramda"
import { addProducts, getProducts } from "./productSlice"
import { fetchProduct } from "../actions/products"

/**
 * Defines the structure of the cart-related state within the application.
 *
 * @typedef {Object} CartState
 * @property {ProductInCart[]} products - Array of products in the cart with their quantities.
 * @property {boolean} confirmRemoveItemModal - Controls the visibility of the item removal confirmation modal.
 */
interface CartState {
  products: ProductInCart[]
  confirmRemoveItemModal: boolean
}

// Initial state for the cart slice
const initialState: CartState = {
  products: [],
  confirmRemoveItemModal: false,
}

/**
 * Async thunk to fetch product details if not already present in productSlice.
 *
 * @param {number} productId - The ID of the product to fetch.
 */
export const fetchProductIfNeeded = createAsyncThunk<
  void,
  number,
  { state: RootState }
>("cart/fetchProductIfNeeded", async (productId, { getState, dispatch }) => {
  const state = getState()
  const existingProducts = state.product.products

  const fetchedProduct = await fetchProduct(productId, existingProducts)

  if (fetchedProduct) {
    dispatch(addProducts([fetchedProduct])) // Thêm sản phẩm mới vào Redux store nếu cần
  }
})

/**
 * Cart slice to manage the state and actions related to the shopping cart.
 */
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Sets the entire cart product list.
     *
     * @param {CartState} state - The current state of the cart.
     * @param {PayloadAction<ProductInCart[]>} action - Payload containing the array of products.
     */
    setProductsInCart: (state, action: PayloadAction<ProductInCart[]>) => {
      state.products = action.payload
    },

    /**
     * Adds an item to the cart or increases its quantity if already present.
     *
     * @param {CartState} state - The current state of the cart.
     * @param {PayloadAction<number>} action - Payload containing the product ID.
     */
    addAnItemToCart: (state, action: PayloadAction<number>) => {
      let product = R.find(R.propEq(action.payload, "productId"))(state.products) as ProductInCart
      if (!product) {
        state.products.push({ productId: action.payload, quantity: 1 })
      } else {
        product.quantity++
      }
    },

    /**
     * Decreases the quantity of an item in the cart or removes it if the quantity reaches 0.
     *
     * @param {CartState} state - The current state of the cart.
     * @param {PayloadAction<number>} action - Payload containing the product ID.
     */
    removeOneQuantityFromCart: (state, action: PayloadAction<number>) => {
      const productIndex = state.products.findIndex((item) => item.productId === action.payload)
      if (productIndex !== -1) {
        if (state.products[productIndex].quantity > 1) {
          state.products[productIndex].quantity--
        } else {
          state.products.splice(productIndex, 1)
        }
      }
    },

    /**
     * Removes an item from the cart entirely.
     *
     * @param {CartState} state - The current state of the cart.
     * @param {PayloadAction<number>} action - Payload containing the product ID.
     */
    removeAnItemFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((item) => item.productId !== action.payload)
    },

    /**
     * Updates the quantity of a specific product in the cart.
     *
     * @param {CartState} state - The current state of the cart.
     * @param {PayloadAction<{ productId: number; quantity: number }>} action - Payload containing product ID and new quantity.
     */
    updateQuantityFromCart: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const product = state.products.find((item) => item.productId === action.payload.productId)
      if (product) {
        product.quantity = action.payload.quantity
      }
    },

    /**
     * Sets the visibility of the confirmation modal for removing an item.
     *
     * @param {CartState} state - The current state of the cart.
     * @param {PayloadAction<boolean>} action - Payload containing the boolean for modal visibility.
     */
    setConfirmRemoveItemModal: (state, action: PayloadAction<boolean>) => {
      state.confirmRemoveItemModal = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductIfNeeded.fulfilled, (state) => {})
  }
})

export const {
  setProductsInCart,
  addAnItemToCart,
  removeOneQuantityFromCart,
  updateQuantityFromCart,
  removeAnItemFromCart,
  setConfirmRemoveItemModal,
} = cartSlice.actions

// Selectors

/**
 * Selector to retrieve all products in the cart.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {ProductInCart[]} - The list of products in the cart.
 */
export const getProductsInCart = (state: RootState) => state.cart.products

/**
 * Selector to get the visibility status of the confirm-remove-item modal.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {boolean} - True if the modal is visible, false otherwise.
 */
export const getConfirmRemoveItemModal = (state: RootState) => state.cart.confirmRemoveItemModal

/**
 * Selector to combine `ShoppingCartProduct[]` by mapping `productsInCart` with detailed `products` from `productSlice`.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {ShoppingCartProduct[]} - List of detailed products in the cart.
 */
export const getDetailedCartProducts = createSelector(
  [getProducts, getProductsInCart],
  (products, productsInCart) => {
    return productsInCart.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId)
      return product ? { product, quantity: cartItem.quantity } : null
    }).filter(Boolean) as ShoppingCartProduct[]
  }
)

export default cartSlice.reducer
