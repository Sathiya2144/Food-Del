import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);

  const url = "http://localhost:4000";

  // ✅ Add to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, {
          headers: { token },
        });
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  // ✅ Remove from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const currentCount = prev[itemId] || 0;
      const newCart = { ...prev };

      if (currentCount <= 1) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = currentCount - 1;
      }

      return newCart;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, {
          headers: { token },
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  // ✅ Get total price
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const product = food_list.find((item) => item._id === itemId);
      if (product) {
        total += product.price * cartItems[itemId];
      }
      return total;
    }, 0);
  };

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ✅ Load cart data after login
  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { token: userToken },
      });
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // 🔄 Initial data load
  useEffect(() => {
    fetchFoodList();
  }, []);

  // 🔄 Token change effect
  useEffect(() => {
    const handleTokenUpdate = async () => {
      if (token) {
        localStorage.setItem("token", token);
        await loadCartData(token); // ✅ Load user's cart when logged in
      } else {
        localStorage.removeItem("token");
        setCartItems({}); // Clear cart if not logged in
      }
    };

    handleTokenUpdate();
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
