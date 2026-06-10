import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CartPage from "./pages/cart-page";
import HomePage from "./pages/home-page";
import ShopPage from "./pages/shop-page";
import CustomizePage from "./pages/customize-page";
import FaqPage from "./pages/faq-page";
import ProductsPage from "./pages/products-page";
import OrderPage from "./pages/order-page";
import RootLayout from "./root";
import WorkshopPage from "./pages/workshop-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/shop/:id",
        element: <ProductsPage />,
      },
      { path: "/order", element: <OrderPage /> },
        { path: "/cart", element: <CartPage /> },
      {
     
        path: "/customize",
        element: <CustomizePage />,
      },
      {
        path: "/workshop",
        element: <WorkshopPage />,
      },
      {
        path: "/FAQ",
        element: <FaqPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
