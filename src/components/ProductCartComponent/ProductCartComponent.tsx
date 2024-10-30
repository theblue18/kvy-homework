import React, { useCallback } from "react"
import { Row, Typography, Image, Col, InputNumber, message } from "antd"
import styles from "./ProductCartComponent.module.css"
import type { ProductCartComponentProps } from "../../types/common.types"
import { useAppDispatch } from "../../stores/hooks"
import {
  addAnItemToCart,
  removeOneQuantityFromCart,
  setConfirmRemoveItemModal,
  updateQuantityFromCart,
} from "../../reducers/cartSlice"
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"
import { formatNumber } from "../../utils/utils"

/**
 * ProductCartComponent
 * A React component to display a product item in the shopping cart with options to adjust quantity.
 * Provides controls to increment, decrement, or set a specific quantity for the product in the cart.
 * 
 * @component
 * @param {ProductCartComponentProps} props - Properties passed to the component
 * @returns {JSX.Element} - Rendered product item in the shopping cart
 */
const ProductCartComponent: React.FC<ProductCartComponentProps> = React.memo(({
  onRemoveItem,
  shoppingCartProduct,
}) => {
  const dispatch = useAppDispatch()

  /**
   * Handles the removal of one quantity from the product in the cart.
   * If the quantity becomes zero, triggers a confirmation modal to remove the item entirely.
   */
  const onRemoveOneQuantity = useCallback(() => {
    if (shoppingCartProduct.quantity > 1) {
      dispatch(removeOneQuantityFromCart(shoppingCartProduct.product.id))
    } else {
      onRemoveItem(shoppingCartProduct.product.id)
      dispatch(setConfirmRemoveItemModal(true))
    }
  }, [dispatch, onRemoveItem, shoppingCartProduct.quantity, shoppingCartProduct.product.id])

  /**
   * Increments the quantity of the product in the cart by one.
   * Ensures the quantity does not fall below zero.
   */
  const onAddOneQuantity = useCallback(() => {
    if (shoppingCartProduct.quantity >= 0) {
      dispatch(addAnItemToCart(shoppingCartProduct.product.id))
    }
  }, [dispatch, shoppingCartProduct.quantity, shoppingCartProduct.product.id])

  /**
   * Updates the quantity of the product based on the input value.
   * Displays an error message if the quantity input is empty or zero, and triggers item removal if zero.
   * 
   * @param {number | null} value - The new quantity value entered by the user
   */
  const onQuantityChange = useCallback((value: number | null) => {
    if (value === null) {
      message.error("You must fill in the quantity")
      return
    }
    if (value === 0) {
      onRemoveItem(shoppingCartProduct.product.id)
      dispatch(setConfirmRemoveItemModal(true))
      return
    }
    dispatch(
      updateQuantityFromCart({
        productId: shoppingCartProduct.product.id,
        quantity: value,
      })
    )
  }, [dispatch, onRemoveItem, shoppingCartProduct.product.id])

  return (
    <div>
      <Row
        justify={"space-between"}
        align={"middle"}
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      >
        {/* Product Image */}
        <Col xs={8} sm={4} md={4} lg={4} xl={3} xxl={3}>
          <Image
            width="100%"
            height="100%"
            src={shoppingCartProduct.product.image}
            preview={true}
            className={styles.imageProduct}
          />
        </Col>

        {/* Product Category and Title */}
        <Col xs={16} sm={10} md={10} lg={10} xl={11} xxl={11}>
          <Row justify={"start"}>
            <Typography className={styles.categoryProduct}>
              {shoppingCartProduct.product.category}
            </Typography>
          </Row>
          <Row justify={"start"}>
            <Typography className={styles.titleProduct}>
              {shoppingCartProduct.product.title}
            </Typography>
          </Row>
        </Col>

        {/* Quantity Controls */}
        <Col xs={16} sm={6} md={6} lg={6} xl={4} xxl={4}>
          <InputNumber
            min={0}
            max={1000}
            value={shoppingCartProduct.quantity}
            onChange={onQuantityChange}
            controls={false}
            addonBefore={<MinusOutlined onClick={onRemoveOneQuantity} data-testid="decrement-icon"/>}
            addonAfter={<PlusOutlined onClick={onAddOneQuantity} data-testid="increment-icon" />}
          />
        </Col>

        {/* Product Price */}
        <Col xs={8} sm={4} md={2} lg={2} xl={3} xxl={3}>
          <Typography className={styles.priceProduct}>
            {`$${formatNumber(shoppingCartProduct.product.price)}`}
          </Typography>
        </Col>

        {/* Total Price (Price x Quantity) */}
        <Col xs={0} sm={0} md={2} lg={2} xl={3} xxl={3}>
          <Typography className={styles.totalAmount}>
            {`$${formatNumber(shoppingCartProduct.product.price * shoppingCartProduct.quantity)}`}
          </Typography>
        </Col>
      </Row>
    </div>
  )
})

export default ProductCartComponent
