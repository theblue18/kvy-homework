import React, { useMemo, useCallback } from "react"
import { Button, Layout, Row, Space, Typography } from "antd"
import { Outlet, useNavigate } from "react-router-dom"
import { ShoppingCartOutlined } from "@ant-design/icons"
import styles from "./LayoutKVY.module.css"
import { useAppSelector } from "../stores/hooks"
import { getProductsInCart } from "../reducers/cartSlice"

const { Header, Content } = Layout

/**
 * LayoutKVY Component
 * Provides a layout structure for the application with a header and main content area.
 * Displays the application logo and a shopping cart icon with the total item count.
 *
 * @component
 * @returns {JSX.Element} - The rendered LayoutKVY component
 */
const LayoutKVY: React.FC = React.memo(() => {
  const productsInCart = useAppSelector(getProductsInCart)
  const navigate = useNavigate()

  /**
   * Calculates the total number of items in the cart.
   * This value is memoized and recalculated only when the `productsInCart` array changes.
   *
   * @returns {number} - The total quantity of items in the cart
   */
  const totalItemInCart = useMemo(() => {
    return productsInCart.reduce((total, item) => total + item.quantity, 0)
  }, [productsInCart])

  /**
   * Navigates to the homepage when the logo is clicked.
   */
  const handleLogoClick = useCallback(() => navigate(`/`), [navigate])

  /**
   * Navigates to the shopping cart page when the cart icon is clicked.
   */
  const handleCartClick = useCallback(() => navigate(`/my-cart`), [navigate])

  return (
    <Layout className={styles.mainLayoutContainer}>
      <Header className={styles.headerKVY}>
        <Row justify="space-between" align="middle">
          <Typography.Title
            level={3}
            className={styles.textLogo}
            onClick={handleLogoClick}
          >
            KVY Homework
          </Typography.Title>
          <Button
            type="text"
            className={totalItemInCart ? styles.activeCartBtn : styles.normalCartBtn}
            onClick={handleCartClick}
          >
            <Space direction="horizontal">
              <ShoppingCartOutlined  style ={{fontSize: "24px", color: "#FFC03F"}}/>
              {totalItemInCart > 0 && (
                <Typography.Text className={styles.cartLabel}>
                  ({totalItemInCart})
                </Typography.Text>
              )}
            </Space>
          </Button>
        </Row>
      </Header>

      <Layout>
        <Content className={styles.mainContent} >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
})

export default LayoutKVY
