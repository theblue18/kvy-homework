// ProductComponent.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import ProductComponent from "./ProductComponent"
import { addAnItemToCart } from "../../reducers/cartSlice"
import "@testing-library/jest-dom"

const mockStore = configureStore([])
const mockProduct = {
  id: 1,
  title: "Sample Product",
  category: "Category 1",
  price: 19.99,
  rating: { rate: 4.5, count: 10 },
  image: "sample.jpg",
  description: "Sample Description",
}

describe("ProductComponent", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = vi.fn()
  })

  test("renders product details correctly", () => {
    render(
      <Provider store={store}>
        <ProductComponent {...mockProduct} />
      </Provider>,
    )

    // Product title
    expect(screen.getByText("Sample Product")).toBeInTheDocument()
    // Product category
    expect(screen.getByText("Category 1")).toBeInTheDocument()
    // Product price
    expect(screen.getByText("$19.99")).toBeInTheDocument()
    // Product rating
    expect(screen.getByText("(4.5)")).toBeInTheDocument()
    // Product rating count
    expect(screen.getByText("(10)")).toBeInTheDocument()
  })

  test("dispatches add to cart action on button click", () => {
    render(
      <Provider store={store}>
        <ProductComponent {...mockProduct} />
      </Provider>,
    )

    fireEvent.click(screen.getByRole("button", { name: /Add to cart/i }))
    expect(store.dispatch).toHaveBeenCalledWith(addAnItemToCart(1))
  })
})
