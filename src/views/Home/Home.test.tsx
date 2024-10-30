// Home.test.tsx
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import Home from "./Home"
import { getAllProducts } from "../../actions/products"
import "@testing-library/jest-dom"


vi.mock("../../actions/products", () => ({
  getAllProducts: vi.fn(),
}))

const mockStore = configureStore([])
const mockProductData = [
  {
    id: 1,
    title: "Product 1",
    category: "electronics",
    price: 10,
    rating: { rate: 4.5, count: 10 },
    image: "image1.jpg",
    description: "Description for Product 1",
  },
  {
    id: 2,
    title: "Product 2",
    category: "women's clothing",
    price: 20,
    rating: { rate: 3.5, count: 8 },
    image: "image2.jpg",
    description: "Description for Product 2",
  },
  {
    id: 3,
    title: "Product 3",
    category: "electronics",
    price: 15,
    rating: { rate: 4.0, count: 12 },
    image: "image3.jpg",
    description: "Description for Product 3",
  },
]

describe("Home Component", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({
      product: {
        products: mockProductData,
        categoriesFilter: "All",
        priceRangeFilter: { lower: 0, upper: 500 },
        ratingFilter: 0,
        sortBy: "NameAsc",
        isShowFilterDrawer: false,
      },
      data: {
        categories: ["electronics", "women's clothing"],
      },
    })
    store.dispatch = vi.fn();
    (getAllProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProductData,
    })
  })

  test("fetches and displays products on load", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument()
      expect(screen.getByText("Product 2")).toBeInTheDocument()
      expect(screen.getByText("Product 3")).toBeInTheDocument()
    })
  })


})
