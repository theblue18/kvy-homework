// ProductCartComponent.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import ProductCartComponent from "./ProductCartComponent"
import { addAnItemToCart, removeOneQuantityFromCart} from "../../reducers/cartSlice"
import "@testing-library/jest-dom"
import type { Product } from "../../types/common.types"

const mockStore = configureStore([])
const mockProduct = {
  product: {
    id: 1,
    title: "Sample Product",
    category: "Sample Category",
    price: 25.23,
    image: "sample-image.jpg",
  } as Product,
  quantity: 2,
}

describe("ProductCartComponent", () => {
  let store: any
  let onRemoveItem: jest.Mock

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = vi.fn()
   
  })

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <ProductCartComponent
          shoppingCartProduct={mockProduct}
          onRemoveItem={onRemoveItem}
        />
      </Provider>
    )

  test("renders product details correctly", () => {
    renderComponent()

    // Check product title, category, image, and quantity
    expect(screen.getByText("Sample Product")).toBeInTheDocument()
    expect(screen.getByText("Sample Category")).toBeInTheDocument()
    expect(screen.getByDisplayValue("2")).toBeInTheDocument()

    // Check product price and total
    expect(screen.getByText("$50.46")).toBeInTheDocument()
   
  })

  
  test("increments product quantity when add button is clicked", () => {
    renderComponent()

    const incrementIcon = screen.getByTestId("increment-icon")
    fireEvent.click(incrementIcon)

    // Expect dispatch to be called with addAnItemToCart action
    expect(store.dispatch).toHaveBeenCalledWith(
      addAnItemToCart(mockProduct.product.id)
    )
  })

  test("decrements product quantity when remove button is clicked", () => {
    renderComponent()

    const decrementIcon = screen.getByTestId("decrement-icon")
    fireEvent.click(decrementIcon)

    // Expect dispatch to be called with removeOneQuantityFromCart if quantity > 1
    expect(store.dispatch).toHaveBeenCalledWith(
      removeOneQuantityFromCart(mockProduct.product.id)
    )
  })

  
})
