import type { PayloadAction } from "@reduxjs/toolkit"
import { createSelector, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../stores/store"
import { SortEnum } from "../types/common.types"
import type { PriceRangeFilter, Product } from "../types/common.types"

/**
 * Defines the structure of the product-related state within the application.
 * 
 * @typedef {Object} ProductState
 * @property {Product[]} products - An array of all products.
 * @property {string} categoriesFilter - The currently applied category filter.
 * @property {PriceRangeFilter} priceRangeFilter - The selected price range filter.
 * @property {number} ratingFilter - The minimum rating filter.
 * @property {SortEnum} sortBy - The current sorting method.
 * @property {boolean} isShowFilterDrawer - Boolean to control filter drawer visibility.
 */
interface ProductState {
  products: Product[]
  categoriesFilter: string
  priceRangeFilter: PriceRangeFilter
  ratingFilter: number
  sortBy: SortEnum
  isShowFilterDrawer: boolean
}

// Define the initial state for the product slice
const initialState: ProductState = {
  products: [],
  categoriesFilter: "All",
  priceRangeFilter: {
    lower:  0,
    upper:  500,
  },
  ratingFilter:  0,
  sortBy: SortEnum.NameAsc,
  isShowFilterDrawer: false,
}

/**
 * Product slice for managing product-related state, including reducers for setting,
 * filtering, and sorting products, as well as controlling UI elements like the filter drawer.
 */
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    /**
     * Sets the entire product list.
     * 
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<Product[]>} action - Action payload containing the array of products.
     */
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },

    /**
     * Adds new products to the existing list.
     *
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<Product[]>} action - Action payload containing the array of new products to add.
     */
    addProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = [...state.products, ...action.payload]
    },

    /**
     * Sets the selected category filter.
     *
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<string>} action - Action payload containing the selected category.
     */
    setCategoriesFilter: (state, action: PayloadAction<string>) => {
      state.categoriesFilter = action.payload
    },

    /**
     * Updates the selected price range filter.
     *
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<{ lower: number; upper: number }>} action - Action payload containing lower and upper bounds.
     */
    setPriceRangeFilter: (
      state,
      action: PayloadAction<{ lower: number; upper: number }>,
    ) => {
      state.priceRangeFilter.lower = action.payload.lower
      state.priceRangeFilter.upper = action.payload.upper
    },

    /**
     * Sets the minimum rating filter.
     *
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<number>} action - Action payload containing the rating filter.
     */
    setRatingFilter: (state, action: PayloadAction<number>) => {
      state.ratingFilter = action.payload
    },

    /**
     * Sets the current sorting option.
     *
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<SortEnum>} action - Action payload containing the selected sorting method.
     */
    setSorting: (state, action: PayloadAction<SortEnum>) => {
      state.sortBy = action.payload
    },

    /**
     * Resets all filters to their default values.
     *
     * @param {ProductState} state - The current product state.
     */
    resetFilter: state => {
      state.priceRangeFilter.lower = 0
      state.priceRangeFilter.upper = 500
      state.ratingFilter = 0
      state.categoriesFilter = "All"
    },

    /**
     * Controls the visibility of the filter drawer.
     *
     * @param {ProductState} state - The current product state.
     * @param {PayloadAction<boolean>} action - Action payload to show or hide the drawer.
     */
    setIsShowFilterDrawer: (state, action: PayloadAction<boolean>) => {
      state.isShowFilterDrawer = action.payload
    },
  },
})

export const {
  setProducts,
  addProducts,
  setCategoriesFilter,
  setPriceRangeFilter,
  setRatingFilter,
  setSorting,
  resetFilter,
  setIsShowFilterDrawer,
} = productSlice.actions

// Selectors
/**
 * Selector to get all products.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {Product[]} - The array of products.
 */
export const getProducts = (state: RootState) => state.product.products

/**
 * Selector to get the current category filter.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {string} - The category filter.
 */
export const getCategoriesFilter = (state: RootState) => state.product.categoriesFilter

/**
 * Selector to get the current price range filter.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {PriceRangeFilter} - The price range filter.
 */
export const getPriceRangeFilter = (state: RootState) => state.product.priceRangeFilter

/**
 * Selector to get the current rating filter.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {number} - The rating filter.
 */
export const getRatingFilter = (state: RootState) => state.product.ratingFilter

/**
 * Selector to check if the filter drawer is visible.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {boolean} - True if the filter drawer is visible, false otherwise.
 */
export const getIsShowFilterDrawer = (state: RootState) => state.product.isShowFilterDrawer

/**
 * Selector to count the number of applied filters.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {number} - The count of active filters.
 */
export const getCurrentCountFilterApply = createSelector(
  [getCategoriesFilter, getPriceRangeFilter, getRatingFilter],
  (categoriesFilter, priceRangeFilter, ratingFilter) => {
    let count = 0
    if (categoriesFilter !== "All") count++
    if (priceRangeFilter.lower !== 0 || priceRangeFilter.upper !== 500) count++
    if (ratingFilter !== 0) count++
    return count
  },
)

/**
 * Selector to get the sorted and filtered list of products based on the active filters.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {Product[]} - The array of filtered and sorted products.
 */
export const selectSortedFilteredProducts = createSelector(
  [
    getProducts,
    getCategoriesFilter,
    getPriceRangeFilter,
    getRatingFilter,
    (state: RootState) => state.product.sortBy,
  ],
  (products, categoriesFilter, priceRangeFilter, ratingFilter, sortBy) => {
    const filteredProducts =
      categoriesFilter === "All" &&
      priceRangeFilter.lower === 0 &&
      priceRangeFilter.upper === 500 &&
      ratingFilter === 0
        ? products
        : products.filter(product => {
            const matchesCategory =
              categoriesFilter === "All" ||
              product.category === categoriesFilter
            const matchesPriceRange =
              product.price >= priceRangeFilter.lower &&
              (priceRangeFilter.upper !== 500
                ? product.price <= priceRangeFilter.upper
                : true)
            const matchesRating = product.rating.rate >= ratingFilter
            return matchesCategory && matchesPriceRange && matchesRating
          })
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case SortEnum.NameAsc:
          return a.title.localeCompare(b.title)
        case SortEnum.NameDesc:
          return b.title.localeCompare(a.title)
        case SortEnum.PriceAsc:
          return a.price - b.price
        case SortEnum.PriceDesc:
          return b.price - a.price
        case SortEnum.RatingDesc:
          return b.rating.rate - a.rating.rate
        default:
          return 0
      }
    })
  },
)

export default productSlice.reducer
