/**
 * Represents a product in the store.
 *
 * @property {string} category - The category the product belongs to.
 * @property {string} description - A description of the product.
 * @property {number} id - Unique identifier for the product.
 * @property {string} image - URL to the product's image.
 * @property {number} price - Price of the product.
 * @property {Rating} rating - Rating details for the product.
 * @property {string} title - Name/title of the product.
 */
export type Product = {
  category: string
  description: string
  id: number
  image: string
  price: number
  rating: Rating
  title: string
}

/**
 * Represents the rating of a product.
 *
 * @property {number} rate - The average rating score.
 * @property {number} count - Total number of ratings.
 */
export type Rating = {
  rate: number
  count: number
}

/**
 * Represents an item in the shopping cart by product ID and quantity.
 *
 * @property {number} productId - Unique identifier for the product.
 * @property {number} quantity - Number of units of the product in the cart.
 */
export type ProductInCart = {
  productId: number
  quantity: number
}

/**
 * Represents a detailed product entry in the shopping cart, including product details.
 *
 * @property {Product} product - The product details.
 * @property {number} quantity - Number of units of the product in the cart.
 */
export type ShoppingCartProduct = {
  product: Product
  quantity: number
}

/**
 * Defines the range for price filtering.
 *
 * @property {number} lower - The minimum price in the filter.
 * @property {number} upper - The maximum price in the filter.
 */
export type PriceRangeFilter =  {
  lower: number, 
  upper: number
}

/**
 * Properties required for rendering a product cart component.
 *
 * @property {function} onRemoveItem - Callback to remove a product from the cart.
 * @property {ShoppingCartProduct} shoppingCartProduct - Product details for the item in the cart.
 */
export type ProductCartComponentProps = {
  onRemoveItem: (productId: number) => void; 
  shoppingCartProduct: ShoppingCartProduct
};

/**
 * Enumeration for sorting options.
 *
 * @enum {string}
 * @property {string} NameAsc - Sort by name in ascending order (A-Z).
 * @property {string} NameDesc - Sort by name in descending order (Z-A).
 * @property {string} PriceAsc - Sort by price from low to high.
 * @property {string} PriceDesc - Sort by price from high to low.
 * @property {string} RatingDesc - Sort by rating from high to low.
 */
export enum SortEnum {
  NameAsc = 'nameASC',
  NameDesc = 'nameDES',
  PriceAsc = 'priceASC',
  PriceDesc = 'priceDES',
  RatingDesc = 'ratingDES',
}

/**
 * Array of sorting options with labels for display.
 *
 * @const {Array<{value: SortEnum, label: string}>}
 */
export const sortOptions = [
  { value: SortEnum.NameAsc, label: 'Sort by Name (A->Z)' },
  { value: SortEnum.NameDesc, label: 'Sort by Name (Z->A)' },
  { value: SortEnum.PriceAsc, label: 'Sort by Price (low to high)' },
  { value: SortEnum.PriceDesc, label: 'Sort by Price (high to low)' },
  { value: SortEnum.RatingDesc, label: 'Sort by Rating (high to low)' },
];
