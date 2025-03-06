import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 스타일 적용
import './CartPage.css'; // 추가 스타일

function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('로그인 정보 조회 실패');
      }

      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);
      loadCart(data.userId); // 사용자 ID를 전달하여 장바구니 로드
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
    }
  };

  const loadCart = async (userId) => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/cart?userId=${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('장바구니 조회 실패');
        }

        const data = await response.json();
        setCartItems(data.cartItems || []); // 응답에서 cartItems를 설정합니다.
      } catch (error) {
        console.error('장바구니 조회 오류:', error.message);
      }
    } else {
      console.log('사용자 ID가 없습니다. 장바구니를 조회할 수 없습니다.');
    }
  };

  const clearCart = async () => {
    try {
      // 서버에 장바구니 비우기 요청 추가 (필요 시)
      const response = await fetch(`http://localhost:5000/cart/clear?userId=${userId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('장바구니 비우기 실패');
      }

      // 상태 업데이트
      setCartItems([]);
    } catch (error) {
      console.error('장바구니 비우기 오류:', error.message);
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      // 서버에서 아이템 삭제 요청 (필요 시)
      const response = await fetch(
        `http://localhost:5000/cart/remove?productId=${productId}&userId=${userId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('장바구니에서 아이템 삭제 실패');
      }

      // 상태 업데이트
      const updatedCart = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('아이템 삭제 오류:', error.message);
    }
  };

  return (
    <div className='cart-container'>
      <h2 className='cart-title'>🛒 장바구니</h2>
      {userId && userName ? (
        <p className='user-info'>
          현재 로그인된 사용자: {userName} (ID: {userId})
        </p>
      ) : (
        <p className='login-prompt'>로그인이 필요합니다.</p>
      )}

      <table className='cartTable'>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>총가격</th>
            <th>삭제</th>
            <th>장바구니 ID</th>
          </tr>
        </thead>

        <tbody id='cartTable-sku' className='cart-bundle-list'>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.cartId} className='cart-deal-item'>
                <td className='product-box'>{item.name}</td>
                <td className='option-price-part'>{item.price}원</td>
                <td>{item.quantity}</td>
                <td>{item.price * item.quantity}원</td>
                <td>
                  <button
                    className='remove-item-btn'
                    onClick={() => removeItemFromCart(item.productId)}
                  >
                    삭제
                  </button>
                </td>
                <td>{item.cartId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6'>장바구니가 비어 있습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='cart-actions'>
        <button className='clear-cart-btn' onClick={clearCart}>
          장바구니 비우기
        </button>
        <button className='back-btn' onClick={() => navigate('/')}>
          홈으로 돌아가기
        </button>
        <button>결제</button>
      </div>
    </div>
  );
}

export default CartPage;
