import "./App.css"
import LayoutKVY from "./layout/LayoutKVY"
import { Routes, Route } from "react-router-dom"
import Home from "./views/Home/Home"
import MyCart from "./views/MyCart/MyCart"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./stores/hooks"
import { message } from "antd"
import { getCategories, setCategories } from "./reducers/dataSlice"
import NoMatch from "./views/NoMatch/NoMatch"
import { getInitData } from "./actions/data"

/**
 * App Component
 * Main application component handling routing and initial data fetching.
 *
 * @component
 * @returns {JSX.Element} - The rendered App component
 */
const App = () => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(getCategories)
  
  /**
   * Fetches initial data for the application.
   * If categories data is not available, it fetches it from the API and updates the store.
   * Shows an error message if fetching fails.
   */
  useEffect(() => {
    const callGetInitData = async () => {
      const initDataRes = await getInitData()
      if (!initDataRes.success) {
        message.error(initDataRes.message)
        return
      }
      dispatch(setCategories(initDataRes.data as string[]))
    }

    if (categories === undefined) {
      callGetInitData()
    }
  }, [categories, dispatch])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LayoutKVY />}>
          <Route index element={<Home />} />
          <Route path="/my-cart" element={<MyCart />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}



export default App
