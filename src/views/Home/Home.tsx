import React, { useEffect, useState, useCallback, useMemo } from "react"
import { getAllProducts } from "../../actions/products"
import {
  Button,
  Col,
  Divider,
  Drawer,
  message,
  Pagination,
  Row,
  Select,
  Skeleton,
  Typography,
} from "antd"
import { useAppDispatch, useAppSelector } from "../../stores/hooks"
import {
  getCurrentCountFilterApply,
  getIsShowFilterDrawer,
  selectSortedFilteredProducts,
  setIsShowFilterDrawer,
  setProducts,
  setSorting,
} from "../../reducers/productSlice"
import { SortEnum, sortOptions, type Product } from "../../types/common.types"
import ProductComponent from "../../components/ProductComponent/ProductComponent"
import styles from "./Home.module.css"
import { FilterOutlined } from "@ant-design/icons"
import FilterComponent from "../../components/FilterComponent/FilterComponent"

/**
 * Home Component
 * A React component for displaying a list of products with sorting, filtering, and pagination functionality.
 * Fetches and displays products in a paginated view, supports a drawer for filter options,
 * and allows sorting products by name or price.
 *
 * @component
 * @returns {JSX.Element} - The rendered Home component
 */
const Home: React.FC = () => {
  const [_, contextHolder] = message.useMessage()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const sortedFilteredProducts = useAppSelector(selectSortedFilteredProducts)
  const currentCountFilterApply = useAppSelector(getCurrentCountFilterApply)
  const isShowFilterDrawer = useAppSelector(getIsShowFilterDrawer)
  const [isCurrentLoading, setIsCurrentLoading] = useState(false)
  const dispatch = useAppDispatch()

  /**
   * Fetches all products from the server and updates the Redux store.
   * Displays an error message if the fetch fails.
   */
  const callGetProduct = useCallback(async () => {
    const productsRes = await getAllProducts()
    setIsCurrentLoading(false)
    if (!productsRes.success) {
      message.error(productsRes.message)
      return
    }
    dispatch(setProducts(productsRes.data as Product[]))
  }, [dispatch])

  useEffect(() => {
    setIsCurrentLoading(true)
    callGetProduct()
  }, [callGetProduct])

  /**
   * Adjusts the page size based on the current screen width.
   * This helps to display a responsive number of items per row in the grid.
   */
  const calculatePageSize = useCallback(() => {
    const width = window.innerWidth
    let itemsPerRow
    if (width < 576)
      itemsPerRow = 1 * 8 // xs
    else if (width < 768)
      itemsPerRow = 2 * 4 // sm
    else if (width < 992)
      itemsPerRow = 2 * 4 // md
    else if (width < 1200)
      itemsPerRow = 3 * 2 // lg
    else itemsPerRow = 4 * 2 // xl, xxl
    setPageSize(itemsPerRow)
  }, [])

  useEffect(() => {
    calculatePageSize()
    window.addEventListener("resize", calculatePageSize)
    return () => window.removeEventListener("resize", calculatePageSize)
  }, [calculatePageSize])

  /**
   * Handles page change in pagination.
   * @param {number} page - The page number to set
   * @param {number} [size] - The page size to set
   */
  const handlePageChange = useCallback((page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
  }, [])

  /**
   * Dispatches a sort action to update sorting criteria in Redux store.
   * @param {SortEnum} value - The selected sorting criteria
   */
  const handleChangeSorting = useCallback(
    (value: SortEnum) => {
      dispatch(setSorting(value))
    },
    [dispatch],
  )

  /**
   * Computes the list of products to display based on the current page and page size.
   * @returns {Product[]} - Array of products to display on the current page
   */
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedFilteredProducts.slice(startIndex, startIndex + pageSize)
  }, [sortedFilteredProducts, currentPage, pageSize])

  return (
    <div>
      {contextHolder}

      {/* Sorting and Filter Button Row */}
      <Row justify={"end"} align={"middle"} className={styles.sortFilterRow}>
        <Col xs={16} sm={17} md={24} lg={24} xl={24} xxl={24}>
          <Select
            defaultValue={SortEnum.NameAsc}
            style={{ minWidth: 220 }}
            onChange={handleChangeSorting}
            data-testid="sortDropdown"
          >
            {sortOptions.map(option => (
              <Select.Option
                key={option.value}
                value={option.value}
                data-testid={`sort-option-${option.value}`}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={8} sm={7} md={0} lg={0} xl={0} xxl={0}>
          <Button
            className={
              currentCountFilterApply
                ? styles.filterApplyBtn
                : styles.notFilterApplyBtn
            }
            onClick={() => dispatch(setIsShowFilterDrawer(true))}
          >
            <FilterOutlined style={{ fontSize: "24px" }} />
            <Typography>
              {currentCountFilterApply
                ? `Filter (${currentCountFilterApply})`
                : `Filter`}
            </Typography>
          </Button>
        </Col>
      </Row>

      {/* Product Display Grid */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={0} sm={0} md={8} lg={6} xl={5} xxl={5}>
          <FilterComponent />
        </Col>
        <Col xs={24} sm={24} md={16} lg={18} xl={19} xxl={19}>
          {isCurrentLoading ? (
            <Skeleton />
          ) : (
            <div>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                justify={"start"}
                align="stretch"
              >
                {paginatedProducts && paginatedProducts.length > 0 ? (
                  paginatedProducts.map(product => (
                    <Col
                      xs={24}
                      sm={12}
                      md={12}
                      lg={8}
                      xl={6}
                      xxl={6}
                      key={"product-" + product.id}
                      className={styles.productCol}
                    >
                      <ProductComponent {...product} />
                    </Col>
                  ))
                ) : (
                  <div>Empty List</div>
                )}
              </Row>

              {/* Pagination Component */}
              <Divider style={{ margin: "10px 0px" }} />
              <Row justify={"center"}>
                <Pagination
                  align={"center"}
                  current={currentPage}
                  pageSize={pageSize}
                  total={sortedFilteredProducts.length}
                  onChange={handlePageChange}
                  showSizeChanger
                  onShowSizeChange={handlePageChange}
                  pageSizeOptions={[8]}
                />
              </Row>
            </div>
          )}
        </Col>
      </Row>

      {/* Filter Drawer for Small Screens */}
      <Drawer
        title="KVY Homework"
        placement="right"
        closable
        onClose={() => dispatch(setIsShowFilterDrawer(false))}
        open={isShowFilterDrawer}
      >
        <FilterComponent />
      </Drawer>
    </div>
  )
}

export default React.memo(Home)
