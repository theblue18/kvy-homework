import React, { useCallback } from "react"
import {
  Row,
  Typography,
  Image,
  Tag,
  Button,
  Divider,
  Rate,
  Col,
  message,
} from "antd"
import styles from "./ProductComponent.module.css"
import type { Product } from "../../types/common.types"
import { getColorFromCategories } from "../../utils/utils"
import { ShoppingCartOutlined } from "@ant-design/icons"
import { useAppDispatch } from "../../stores/hooks"
import { addAnItemToCart } from "../../reducers/cartSlice"

/**
 * ProductComponent
 * A React component to display product details in a card format, including image, title, category, price, and rating.
 * Allows users to add the product to the cart and displays relevant product information.
 *
 * @component
 * @param {Product} props - Product properties including id, image, title, category, price, and rating
 * @returns {JSX.Element} - The rendered product card component
 */
const ProductComponent: React.FC<Product> = React.memo((props) => {
  const dispatch = useAppDispatch()

  /**
   * Adds the current product to the shopping cart when the button is clicked.
   * Shows a success message upon successful addition.
   */
  const addToCart = useCallback(() => {
    dispatch(addAnItemToCart(props.id))
    message.success("Add item to cart success")
  }, [dispatch, props.id])

  return (
    <div className={styles.productCard}>
      <div className={styles.productCardContainer}>
        <div className={styles.productInfo}>
          
          {/* Product Image */}
          <Row justify="center" className={styles.productInfoRow}>
            <Image
              width={"100px"}
              height={"100px"}
              src={props.image}
              preview={false}
            />
          </Row>
          <Divider style={{ margin: "10px 0px" }} />

          {/* Product Title */}
          <Row justify={"center"} className={styles.productInfoRow}>
            <Typography.Text className={styles.titleProduct}>
              {props.title}
            </Typography.Text>
          </Row>

          {/* Product Category Tag */}
          <Row justify={"center"} className={styles.productInfoRow}>
            <Tag color={getColorFromCategories(props.category)}>
              {props.category}
            </Tag>
          </Row>

          {/* Product Rating */}
          <Row justify={"center"} className={styles.productInfoRow} gutter={10}>
            <Rate allowHalf defaultValue={props.rating.rate} />
            <Typography.Text>{` (${props.rating.rate})`}</Typography.Text>
          </Row>

          {/* Product Rating Review Count */}
          <Row justify={"center"} className={styles.productInfoRow} gutter={10}>
            <Typography.Text> Rating Review: </Typography.Text>
            <Typography.Text>{` (${props.rating.count})`}</Typography.Text>
          </Row>

          
        </div>

        <div className={styles.productFooter}>
          <Divider style={{ margin: "10px 0px" }} />
          
          {/* Product Price and Add to Cart Button */}
          <Row justify="space-around" className={styles.productInfoRow}>
            <Col>
              <Typography.Text
                className={styles.priceProduct}
              >{`$${props.price}`}</Typography.Text>
            </Col>
            <Col>
              <Row>
                <Button className={styles.addToCartBtn} onClick={addToCart}>
                  <ShoppingCartOutlined />
                  Add to cart
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
})

export default ProductComponent
