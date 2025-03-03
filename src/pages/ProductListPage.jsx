import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // 스타일 적용

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart(); // 로컬 스토리지에서 장바구니 불러오기
    fetchProducts(); // 하드코딩된 상품 목록 불러오기
  }, []);

  // 🔹 하드코딩된 상품 목록 불러오기
  const fetchProducts = () => {
    const hardcodedProducts = [
      { productId: 1, name: "상품 A", price: 10000 },
      { productId: 2, name: "상품 B", price: 20000 },
      { productId: 3, name: "상품 C", price: 30000 },
    ];
    setProducts(hardcodedProducts);
  };

  // 🛒 로컬 스토리지에서 장바구니 불러오기
  const loadCart = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  };

  // 🛒 장바구니에 상품 추가
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.productId);
    let updatedCart;

    if (existingItem) {
      // 기존 상품의 수량을 증가시킴
      updatedCart = cart.map(item => 
        item.productId === product.productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      // 새로운 상품을 추가
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // 로컬 스토리지에 저장
  };

  return (
    <div className="product-container">
      <h2>🛍️ 상품 목록</h2>

      <ul className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.productId} className="product-item">
              <p>상품명: {product.name}</p>
              <p>가격: {product.price}원</p>
              <button onClick={() => addToCart(product)}>장바구니 추가</button>
            </li>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </ul>

      {/* 장바구니 페이지 이동 */}
      <button className="cart-btn" onClick={() => navigate("/cart")}>
        장바구니 보기
      </button>
    </div>
  );
}

export default ProductListPage;
