import "./App.css";
import React, { useState, useEffect } from "react";


function App() {
  const services = [
    { id: "walk30", name: "Dog Walk – 30 min", unitPrice: 18.0 },
    { id: "walk60", name: "Dog Walk – 60 min", unitPrice: 30.0 },
    { id: "dropin", name: "Drop-in Visit", unitPrice: 22.5 },
    { id: "boarding", name: "Overnight Boarding (per night)", unitPrice: 65.0 }
  ];
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('invoiceCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('invoiceCart');
      }
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('invoiceCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = () => {
    if (!selectedService || quantity <= 0) return;
    
    const service = services.find((service) => service.id === selectedService);
    const existingItem = cartItems.find(item => item.serviceId === selectedService);
    
    if (existingItem) {
      const updatedItems = cartItems.map(item => 
        item.serviceId === selectedService 
          ? { 
              ...item, 
              quantity: item.quantity + parseInt(quantity),
              lineTotal: (item.unitPrice * (item.quantity + parseInt(quantity)))
            } 
          : item
      );
      setCartItems(updatedItems);
    } else {
      const newItem = {
        id: Date.now(),
        serviceId: selectedService,
        service: service.name,
        quantity: parseInt(quantity),
        unitPrice: service.unitPrice,
        lineTotal: (service.unitPrice * parseInt(quantity)),
      };
      setCartItems([...cartItems, newItem]);
    }
    
    setQuantity(1);
    setSelectedService("");
  };
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('invoiceCart');
  };

  return (
    <div className="App">
      <h1>Invoice Builder</h1>
      <div className="service-list">
        <h2>Select Service</h2>
        <div className="service-controls">
          <select onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
          <span>
            Unit Price: $
            {services
              .find((service) => service.id === selectedService)
              ?.unitPrice.toFixed(2) || '0.00'}
          </span>
          <button onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
      
      <div className="cart-items">
        <h2>Cart Items</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.service} - Qty: {item.quantity} - ${item.unitPrice.toFixed(2)} - Total: ${item.lineTotal.toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
            <button onClick={clearCart}>Clear All Items</button>
          </div>
        )}
      </div>
      
      <div className="invoice-total">
        <h2>Invoice Total</h2>
        <p>Subtotal: ${cartItems.reduce((total, item) => total + item.lineTotal, 0).toFixed(2)}</p>
        <p>Tax (8%): ${(cartItems.reduce((total, item) => total + item.lineTotal, 0) * 0.08).toFixed(2)}</p>
        <p><strong>Total: ${(cartItems.reduce((total, item) => total + item.lineTotal, 0) * 1.08).toFixed(2)}</strong></p>
      </div>
    </div>
  );
}

export default App;
