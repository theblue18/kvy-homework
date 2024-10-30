import React, { useCallback, useMemo } from "react"
import type { SliderSingleProps } from "antd"
import {
  Row,
  Typography,
  Rate,
  Select,
  Slider,
  Space,
  Divider,
  Button,
  message,
} from "antd"
import styles from "./FilterComponent.module.css"
import { useAppDispatch, useAppSelector } from "../../stores/hooks"
import { getCategories } from "../../reducers/dataSlice"
import { capitalizeFirstLetter } from "../../utils/utils"
import { FilterOutlined } from "@ant-design/icons"
import {
  getCategoriesFilter,
  getPriceRangeFilter,
  getRatingFilter,
  resetFilter,
  setCategoriesFilter,
  setPriceRangeFilter,
  setRatingFilter,
} from "../../reducers/productSlice"
import { debounce } from "lodash"

/**
 * FilterComponent
 * A React component providing filters for category, price range, and rating for products.
 * The component uses Redux for managing filter state and allows users to reset filters as needed.
 *
 * @component
 * @returns {JSX.Element} - Rendered filter component
 */
const FilterComponent: React.FC = React.memo(() => {
  // Retrieve categories and filter values from Redux store
  const categories = useAppSelector(getCategories)
  const categoriesFilter = useAppSelector(getCategoriesFilter)
  const priceRangeFilter = useAppSelector(getPriceRangeFilter)
  const ratingFilter = useAppSelector(getRatingFilter)
  const dispatch = useAppDispatch()

  /**
   * Updates the selected category filter in Redux
   * @param {string} value - The selected category value
   */
  const handleCategoriesChange = useCallback(
    (value: string) => {
      dispatch(setCategoriesFilter(value))
    },
    [dispatch],
  )

  /**
   * Updates the selected price range filter in Redux
   * @param {number[]} value - An array containing lower and upper values for price range
   */
  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      if (value.length === 2) {
        dispatch(setPriceRangeFilter({ lower: value[0], upper: value[1] }))
      }
    },
    [dispatch],
  )

  /**
   * Debounced function to handle price range changes more smoothly
   * Uses debounce to limit the frequency of Redux updates as user adjusts the slider
   */
  const debouncedHandlePriceRangeChange = useMemo(
    () => debounce(handlePriceRangeChange, 100),
    [handlePriceRangeChange],
  )

  /**
   * Updates the selected rating filter in Redux
   * @param {number} value - The selected rating value
   */
  const handleRatingChange = useCallback(
    (value: number) => {
      dispatch(setRatingFilter(value))
    },
    [dispatch],
  )

  /**
   * Determines if the reset filter button should be disabled
   * @returns {boolean} - Returns true if no filters have been applied
   */
  const isDisableResetFilter = useMemo(() => {
    return (
      categoriesFilter === "All" &&
      priceRangeFilter.lower === 0 &&
      priceRangeFilter.upper === 500 &&
      ratingFilter === 0
    )
  }, [categoriesFilter, priceRangeFilter, ratingFilter])

  /**
   * Resets all filter values to their default states in Redux
   * Displays a success message upon successful reset
   */
  const callResetFilter = useCallback(() => {
    dispatch(resetFilter())
    message.success("Reset filter success")
  }, [dispatch])

  /**
   * Defines marks for the price range slider
   * Shows $0 and $500+ labels at the ends of the slider
   */
  const marks: SliderSingleProps["marks"] = useMemo(
    () => ({
      0: {
        style: {
          marginTop: 10,
        },
        label: <strong>$0</strong>,
      },
      500: {
        style: {
          marginTop: 10,
        },
        label: <strong>$500+</strong>,
      },
    }),
    [],
  )

  return (
    <div className={styles.filterContainer}>
      {/* Filter Header */}
      <Row justify={"start"} align={"middle"} className={styles.titleFilter}>
        <Space>
          <FilterOutlined style={{ fontSize: "16px" }} />
          <Typography.Text className={styles.titleFilter}>
            FILTER
          </Typography.Text>
        </Space>
      </Row>
      <Divider style={{ margin: "10px 0px" }} />

      {/* Category Filter */}
      <Row>
        <Typography.Text className={styles.typeOfFilter}>
          Category
        </Typography.Text>
      </Row>
      <Row>
      
          <Select
        
            onChange={handleCategoriesChange}
            value={categoriesFilter}
            className={styles.categoryFilter}
            data-testid="categoryFilter"
          >
            <Select.Option key={"All"} value={"All"} data-testid={`category-option-all`}>
              ALL
            </Select.Option>
            {categories?.map(category => (
              <Select.Option key={category} value={category}  data-testid={`category-option-${category}`}>
                {capitalizeFirstLetter(category)}
              </Select.Option>
            ))}
          </Select>
   
      </Row>

      <Divider style={{ margin: "10px 0px" }} />

      {/* Price Range Filter */}
      <Row>
        <Typography.Text className={styles.typeOfFilter}>
          Price Range
        </Typography.Text>
      </Row>
      <Row>
        <div className={styles.sliderContainer}>
          <Slider
            marks={marks}
            range
            value={[priceRangeFilter.lower, priceRangeFilter.upper]}
            min={0}
            max={500}
            onChange={debouncedHandlePriceRangeChange}
          />
        </div>
      </Row>

      <Divider style={{ margin: "10px 0px" }} />

      {/* Rating Filter */}
      <Row>
        <Typography.Text className={styles.typeOfFilter}>
          Rating
        </Typography.Text>
      </Row>
      <Row>
        <Space>
          <Typography.Text>From</Typography.Text>
          <Rate allowHalf value={ratingFilter} onChange={handleRatingChange} />
        </Space>
      </Row>

      <Divider style={{ margin: "20px 0px" }} />

      {/* Reset Filter Button */}
      <Row>
        <Button
          block
          className={styles.resetBtn}
          disabled={isDisableResetFilter}
          onClick={callResetFilter}
        >
          Reset Filter
        </Button>
      </Row>
    </div>
  )
})

export default FilterComponent
