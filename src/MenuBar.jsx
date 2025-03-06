import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios'; // Spring Boot API 요청을 위한 axios 추가
import './App.css';

function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const [categories, setCategories] = useState([]); // API에서 가져온 카테고리 데이터 저장
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Spring Boot에서 카테고리 데이터 가져오기
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category/root'); // 루트 카테고리 가져오기
        console.log('Fetched Categories:', response.data); // 👉 데이터 확인 로그 추가
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsIconClicked((prev) => !prev);
  };

  const handleMouseEnter = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/category/${categoryId}/subcategories`,
      );
      setOpenSubMenu({ id: categoryId, subcategories: response.data });
    } catch (error) {
      console.error('서브카테고리를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    setIsMenuOpen(false); // 라우트 변경 시 메뉴 닫기
    setIsIconClicked(false);
  }, [location.pathname]);

  return (
    <>
      <div className='menu-icon' onClick={toggleMenu}>
        {isIconClicked ? <FaTimes className='icon-change' /> : <FaBars className='icon-change' />}
      </div>

      <div className={`menu-bar ${isMenuOpen ? 'open' : 'closed'}`}>
        <Link to='/' className='menu-link'>
          홈
        </Link>
        <Link to='/about' className='menu-link'>
          소개
        </Link>
        <Link to='/contact' className='menu-link'>
          FAQ
        </Link>
        <Link to='/event' className='menu-link'>
          이벤트상품
        </Link>

        {categories.map((category) => (
          <div
            key={category.id}
            className='menu-item'
            onMouseEnter={() => handleMouseEnter(category.id)}
          >
            <Link to={`/category/${category.id}`} className='menu-link'>
              {category.name}
            </Link>
            {openSubMenu?.id === category.id && (
              <div className='submenu'>
                {openSubMenu.subcategories.map((sub) => (
                  <Link key={sub.id} to={`/category/${sub.id}`} className='submenu-link'>
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <Link to='/FaceSetDetail' className='menu-link'>
          등록된 얼굴 목록
        </Link>
      </div>
    </>
  );
}

export default MenuBar;
