// MyCart.test.tsx
import { render, screen, within } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import MyCart from "./MyCart"
import { BrowserRouter as Router } from "react-router-dom"

import "@testing-library/jest-dom"

const mockStore = configureStore([])

describe("MyCart Component", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({
      cart: {
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
        confirmRemoveItemModal: false,
      },
      product: {
        products: [
          {
            id: 1,
            title: "Product 1",
            price: 10.5,
            description: "Product 1 description",
            category: "Electronics",
          },
          {
            id: 2,
            title: "Product 2",
            price: 20.22,
            description: "Product 2 description",
            category: "Books",
          },
        ],
      },
    })
    store.dispatch = vi.fn()
  })

  test("renders cart items and calculates total price", async () => {
    render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>,
    )

    // Check if cart items are rendered
    expect(await screen.findByText("Product 1")).toBeInTheDocument()
    expect(await screen.findByText("Product 2")).toBeInTheDocument()

  })
})
