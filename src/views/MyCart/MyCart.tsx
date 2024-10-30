import React, { useEffect, useState, useCallback } from "react"
import {
  Col,
  Divider,
  message,
  Row,
  Typography,
  Button,
  Modal,
  Select,
  Input,
  Skeleton,
  Result,
} from "antd"
import { useAppDispatch, useAppSelector } from "../../stores/hooks"
import {
  fetchProductIfNeeded,
  getConfirmRemoveItemModal,
  getDetailedCartProducts,
  getProductsInCart,
  removeAnItemFromCart,
  setConfirmRemoveItemModal,
} from "../../reducers/cartSlice"
import { useNavigate } from "react-router-dom"
import ProductCartComponent from "../../components/ProductCartComponent/ProductCartComponent"
import { formatNumber } from "../../utils/utils"
import styles from "./MyCart.module.css"

/**
 * MyCart Component
 * A React component that displays the shopping cart page.
 * Shows a list of products in the cart with options to remove or update quantities.
 * Calculates and displays the total price and includes a checkout summary.
 *
 * @component
 * @returns {JSX.Element} - The rendered MyCart component
 */
const MyCart: React.FC = () => {
  const [_, contextHolder] = message.useMessage()
  const productsInCart = useAppSelector(getProductsInCart)
  const detailedCartProducts = useAppSelector(getDetailedCartProducts)
  const [selectedRemoveProductId, setSelectedRemoveProductId] = useState<
    number | null
  >(null)
  const [isCurrentLoading, setIsCurrentLoading] = useState(false)
  const confirmRemoveItemModal = useAppSelector(getConfirmRemoveItemModal)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  /**
   * Triggers the confirmation modal to remove a product from the cart.
   * @param {number} productId - ID of the product to be removed
   */
  const onRemoveItem = useCallback(
    (productId: number) => {
      dispatch(setConfirmRemoveItemModal(true))
      setSelectedRemoveProductId(productId)
    },
    [dispatch],
  )

  /**
   * Handles the confirm action for removing an item from the cart.
   */
  const handleRemoveItemOk = useCallback(() => {
    if (selectedRemoveProductId) {
      dispatch(removeAnItemFromCart(selectedRemoveProductId))
      dispatch(setConfirmRemoveItemModal(false))
    }
  }, [selectedRemoveProductId, dispatch])

  /**
   * Calculates the total price of all items in the cart.
   * @returns {string} - Formatted total price
   */
  const calculateTotalPrice = () => {
    return formatNumber(
      detailedCartProducts.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    )
  }

  /**
   * Fetches product details for each item in the cart if they are not already present in the store.
   * This function only fetches details for products that are not already available.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchPromises = productsInCart.map(item =>
        dispatch(fetchProductIfNeeded(item.productId)),
      )
      await Promise.all(fetchPromises)
      setIsCurrentLoading(false)
    }
    setIsCurrentLoading(true)
    fetchProducts()
  }, [dispatch, productsInCart])

  return (
    <div className={styles.shoppingCartContainer}>
      {contextHolder}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify={"start"}>
        {/* Cart Items Section */}
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={18}
          xl={18}
          xxl={18}
          className={styles.contentCol}
        >
          <Row justify={"space-between"} align={"middle"}>
            <Typography.Title level={4}>Shopping Cart</Typography.Title>
            <Typography.Text>{`${productsInCart.length} items`}</Typography.Text>
          </Row>

          <Divider style={{ margin: "10px 0px" }} />
          {isCurrentLoading ? (
            <Skeleton />
          ) : detailedCartProducts.length > 0 ? (
            detailedCartProducts.map(item => (
              <div key={`cart_item_${item.product.id}`}>
                <ProductCartComponent
                  onRemoveItem={onRemoveItem}
                  shoppingCartProduct={item}
                />
                <Divider style={{ margin: "10px 0px" }} />
              </div>
            ))
          ) : (
            <Row>
              <Result
                status="warning"
                title="Cart is empty! Please turn back to product page and add product to cart"
                
              />
            </Row>
          )}
          <Button type={"text"} onClick={() => navigate(`/`)}>
            {`<- Back to shop`}
          </Button>
        </Col>

        {/* Summary Section */}
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
          xl={6}
          xxl={6}
          className={`${styles.summaryCol} ${styles.contentCol}`}
        >
          <Row>
            <Typography.Title level={4} className={styles.summarizeText}>
              Summary
            </Typography.Title>
          </Row>
          <Divider
            style={{ margin: "10px 0px", backgroundColor: "whitesmoke" }}
          />
          <Row
            className={styles.summarizeRow}
            justify={"space-between"}
            align={"middle"}
          >
            <Typography.Text
              className={styles.summarizeSubtitleText}
            >{`ITEMS: ${productsInCart.length}`}</Typography.Text>
            <Typography.Text
              className={styles.summarizeSubtitleText}
            >{`$${calculateTotalPrice()}`}</Typography.Text>
          </Row>

          {/* Shipping Option */}
          <Row className={styles.summarizeRow}>
            <Typography.Text className={styles.summarizeSubtitleText}>
              SHIPPING
            </Typography.Text>
          </Row>
          <Row className={styles.summarizeRow}>
            <Select
              defaultValue="standard"
              style={{ width: "100%" }}
              options={[
                { value: "standard", label: "Standard Delivery - 5$" },
                { value: "fast", label: "Fast Delivery - 10$" },
              ]}
            />
          </Row>

          {/* Promo Code */}
          <Row className={styles.summarizeRow}>
            <Typography.Text className={styles.summarizeSubtitleText}>
              PROMOTE CODE
            </Typography.Text>
          </Row>
          <Row className={styles.summarizeRow}>
            <Input style={{ width: "100%" }} />
          </Row>
          <Divider
            style={{ margin: "10px 0px", backgroundColor: "whitesmoke" }}
          />
          <Row
            className={styles.summarizeRow}
            justify={"space-between"}
            align={"middle"}
          >
            <Typography.Text className={styles.summarizeSubtitleText}>
              TOTAL
            </Typography.Text>
            <Typography.Text
              className={styles.totalAmountBill}
            >{`$${calculateTotalPrice()}`}</Typography.Text>
          </Row>
          <Row className={styles.summarizeRow}>
            <Button className={styles.checkOutBtn} block>
              CHECKOUT
            </Button>
          </Row>
        </Col>
      </Row>

      {/* Confirm Remove Item Modal */}
      <Modal
        title="Confirm"
        open={confirmRemoveItemModal}
        onOk={handleRemoveItemOk}
        onCancel={() => dispatch(setConfirmRemoveItemModal(false))}
      >
        <Typography.Text>
          Are you sure you want to remove this product from your cart?
        </Typography.Text>
      </Modal>
    </div>
  )
}

export default React.memo(MyCart)
