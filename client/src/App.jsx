import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState,  useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart/Cart';
import CartButton from './components/Cart/CartButton';
import './App.css';
import Checkout from "./components/Checkout/Checkout";
import OrderSuccess from "./components/Checkout/OrderSuccess";

function App() {
//Cart state
const [cartItems, setCartItems] = useState([]);
const [showCart, setShowCart] = useState(false);

//load cart from local storage on mount
useEffect(() => {
  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  } catch (error) {
    console.error("Error loading cart from local storage:", error);
  }
}, []);

//save cart to local storage on change
useEffect(() => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to local storage:", error);
  }
}, [cartItems]);

//Add item to cart or update quantity if it already exists
const addToCart = (product, quantity) => {
  setCartItems(prevItems => {
    const existingItem = prevItems.find(
      (item) => item.product.id === product.id);

    if (existingItem) {
      //update quantity of existing item
      return prevItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      //add new item to cart
      return [...prevItems, { product, quantity }];
    }
  });
};

//Remove item from cart
const removeFromCart = (productId) => {
  setCartItems(prevItems =>
    prevItems.filter((item) => item.product.id !== productId)
  );
};

//update item quantity in cart

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // don't allow less than 1

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  //clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  //calculate cart total (handle sales prices)
  const getCartTotal =() => {
    return cartItems.reduce((total, item) => {
      const price = item.product.isOnSale
        ? item.product.salePrice
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  //Get total number of items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

return (
  <Router>
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>We Sell Stuff I Guess</h1>
            <p>Just Another E-Commerce Solution Selling You Sh*t You Don't Need</p>
          </div>
          <CartButton
            itemCount={getCartItemCount()}
            total={getCartTotal()}
            onClick={() => setShowCart(true)}
          />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route
            path="/products/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route
    path="/checkout"
    element={
      <Checkout
        cartItems={cartItems}
        cartTotal={getCartTotal()}
        clearCart={clearCart}
      />
    }
  />
  <Route path="/order/success" element={<OrderSuccess />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 We Sell Stuff I Guess Store. Built with React & ASP.NET Core</p>
      </footer>

      {showCart && (
        <Cart
          items={cartItems}
          total={getCartTotal()}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  </Router>
);

}

export default App;