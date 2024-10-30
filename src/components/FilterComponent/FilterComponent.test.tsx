import { render, screen, fireEvent, within } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import FilterComponent from "./FilterComponent"
import "@testing-library/jest-dom"

// Initialize mock store
const mockStore = configureStore([])

describe("FilterComponent", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({
      data: {
        categories: ["Electronics", "Men's clothing", "Women's clothing"],
      },
      product: {
        categoriesFilter: "All",
        priceRangeFilter: { lower: 0, upper: 500 },
        ratingFilter: 0,
      },
    })
    store.dispatch = vi.fn()
  })

  test("renders category, price range, and rating filters", () => {
    render(
      <Provider store={store}>
        <FilterComponent />
      </Provider>
    )

   // Check that category dropdown renders correctly
   expect(screen.getByText("Category")).toBeInTheDocument()
   const categoryDropdown = screen.getByRole("combobox")
   fireEvent.mouseDown(categoryDropdown)
   
   const dropdownOptions = within(screen.getByRole("listbox"))
   expect(dropdownOptions.getByRole("option", { name: "Electronics" })).toBeInTheDocument()


   expect(screen.getByText("Price Range")).toBeInTheDocument()
   const sliders = screen.getAllByRole("slider")
   expect(sliders.length).toBeGreaterThan(0) // Expect at least one slider in the component
   expect(screen.getByText("Rating")).toBeInTheDocument()
  })

 
})
