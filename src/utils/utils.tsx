import type { RcFile } from "antd/es/upload/interface"
import { message } from "antd"
//import dayjs from "dayjs";

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

export const getColorFromCategories = (category: string) => {
 
    switch (category) {
      case "electronics":
        return "red"
      case "women's clothing":
        return "green"
         case "men's clothing":
        return "blue"
      case "jewelery":
        return "orange"
      default:
        return "pink"
  
  
  }
}
export const capitalizeFirstLetter = (text: string) => {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}
export const formatNumber = (num: number) => {
  return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}


