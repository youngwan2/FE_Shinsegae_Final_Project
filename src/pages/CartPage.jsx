import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // 스타일 적용
import "./CartPage.css"; // 추가 스타일

function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    loadCart(); // 로컬 스토리지에서 장바구니 불러오기
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/user-info", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("로그인 정보 조회 실패");
      }

      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error.message);
    }
  };

  const loadCart = () => {
    const storedCart = localStorage.getItem("cart");
    console.log("저장된 장바구니:", storedCart); // 저장된 장바구니 출력
    
    if (storedCart) {
      const items = JSON.parse(storedCart);
      console.log("파싱된 장바구니 아이템:", items); // 파싱된 아이템 출력
      const mergedItems = mergeCartItems(items);
      setCartItems(mergedItems);
    }
  };
  
  const mergeCartItems = (items) => {
    const merged = {};
    items.forEach((item) => {
      if (merged[item.productId]) {
        merged[item.productId].quantity += item.quantity; // 기존 수량에 더하기
      } else {
        merged[item.productId] = { ...item }; // 새로운 상품 추가 (수량은 이미 아이템에 있음)
      }
    });
    return Object.values(merged);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  const removeItemFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 장바구니</h2>
      {userId && userName ? (
        <p className="user-info">현재 로그인된 사용자: {userName} (ID: {userId})</p>
      ) : (
        <p className="login-prompt">로그인이 필요합니다.</p>
      )}

      <table className="cartTable">
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>총가격</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody id="cartTable-sku" className="cart-bundle-list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.productId} className="cart-deal-item">
                <td className="product-box">{item.name}</td>
                <td className="option-price-part">{item.price}원</td>
                <td>{item.quantity}</td>
                <td>{item.price * item.quantity}원</td>
                <td>
                  <button className="remove-item-btn" onClick={() => removeItemFromCart(item.productId)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">장바구니가 비어 있습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="cart-actions">
        <button className="clear-cart-btn" onClick={clearCart}>
          장바구니 비우기
        </button>
        <button className="back-btn" onClick={() => navigate("/")}>
          홈으로 돌아가기
        </button>
        <button >
          결제
        </button>
      </div>
    </div>
  );
}

export default CartPage;
