import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../stores/store"

/**
 * Represents the state structure for data within the application.
 * 
 * @typedef {Object} DataState
 * @property {string[] | undefined} categories - An optional array of category names.
 */
interface DataState {
  categories?: string[]
}

// Define the initial state using the DataState type
const initialState: DataState = {
  categories: undefined,
}

/**
 * Slice for managing data-related state, specifically product categories.
 * Contains actions and reducers for modifying the data slice of the state.
 */
export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    /**
     * Sets the categories in the state.
     * 
     * @param {DataState} state - The current state of the data slice.
     * @param {PayloadAction<string[]>} action - The action payload containing an array of category names.
     */
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
    },
  },
})

// Exporting the setCategories action for dispatching to update the state
export const { setCategories } = dataSlice.actions

/**
 * Selector to retrieve the categories from the data state.
 * 
 * @param {RootState} state - The root state of the Redux store.
 * @returns {string[] | undefined} - The array of categories or undefined if not set.
 */
export const getCategories = (state: RootState) => state.data.categories

export default dataSlice.reducer
