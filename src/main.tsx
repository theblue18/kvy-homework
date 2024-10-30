import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./stores/store"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { ConfigProvider } from 'antd';
const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
   // <React.StrictMode>
      <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </ConfigProvider>
      </Provider>
   //</React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
