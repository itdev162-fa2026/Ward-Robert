import { useState, useEffect,  } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../services/api";
import "./OrderSuccess.css";

/*
useSearchParams: Extracts orderId from URL query string (?orderId=123)

useEffect: Fetches order data when component mounts

Loading States: Shows "Loading..." while fetching data

Error Handling: Handles missing orderId, failed API calls, missing order

Status Badge: Displays color-coded status based on enum value

Nested Data: Displays order.orderItems array

*/ 

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        setError(null);
        } catch (err) {
        setError("Failed to fetch order details. Please try again or contact support if issues persist.");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchOrder();
  }, [searchParams]);

    if (loading) {
    return (
        <div className = "order-success-container">
            <div className = "Loading">Loading order details...

            </div>
        </div>
    );
    }

    if (error || !order) {
        return (
      <div className="order-success-container">
        <div className="error-state">
          <h2> Unable to Load Order</h2>
          <p>{error || "Order not found"}</p>
          <button onClick={() => navigate("/")} className="home-button">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

    const getStatusBadge = (status) => {
    switch (status) {
      case 1: // Completed
        return <span className="status-badge status-completed">Completed</span>;
      case 0: // Pending
        return <span className="status-badge status-pending">Pending</span>;
      case 2: // Failed
        return <span className="status-badge status-failed">Failed</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

     return (
    <div className="order-success-container">
      <div className="success-content">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order. A confirmation email has been sent to{" "}
            <strong>{order.customerEmail}</strong>
          </p>
        </div>

        <div className="order-details">
          <h2>Order Details</h2>
          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label">Order ID:</span>
              <span className="info-value">#{order.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">{getStatusBadge(order.status)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order Date:</span>
              <span className="info-value">
                {new Date(order.createdDate).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Amount:</span>
              <span className="info-value total">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="order-items">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <h4>{item.productName}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-pricing">
                  <span className="item-price">
                    ${item.priceAtPurchase.toFixed(2)} each
                  </span>
                  <span className="item-subtotal">
                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="next-steps">
          <p className="next-activity-note">
             Note: In Activities 11-12, we'll add Stripe payment processing so
            orders require actual payment before completion.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="continue-shopping-button"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;