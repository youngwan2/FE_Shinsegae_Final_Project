import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './App.css';

function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsIconClicked((prev) => !prev);
  };

  const handleMouseEnter = (menu) => {
    setOpenSubMenu(menu);
  };

  const handleMouseLeave = () => {
    setOpenSubMenu(null);
  };

  useEffect(() => {
    setIsMenuOpen(false); // 라우트 변경 감지 시 메뉴 닫기
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
          연락처
        </Link>
        <Link to='/event' className='menu-link'>
          이벤트상품
        </Link>
        {[
          {
            name: '식품',
            links: [
              { path: '/food/snacks', label: '과자류' },
              { path: '/food/instant', label: '즉석식품' },
              { path: '/food/dessert', label: '디저트' },
            ],
          },
          {
            name: '생활용품',
            links: [
              { path: '/living/hygiene', label: '위생용품' },
              { path: '/living/cleaning', label: '청소용품' },
            ],
          },
          {
            name: '전자제품',
            links: [
              { path: '/electronics/charger', label: '충전기' },
              { path: '/electronics/battery', label: '배터리' },
            ],
          },
          {
            name: '문구',
            links: [
              { path: '/stationery/pens', label: '필기구' },
              { path: '/stationery/notebooks', label: '노트' },
            ],
          },
          {
            name: '패션',
            links: [
              { path: '/fashion/clothing', label: '의류' },
              { path: '/fashion/accessories', label: '악세서리' },
            ],
          },
          {
            name: '스포츠',
            links: [
              { path: '/sports/wear', label: '운동복' },
              { path: '/sports/equipment', label: '운동기구' },
            ],
          },
        ].map((menu) => (
          <div
            key={menu.name}
            className='menu-item'
            onMouseEnter={() => handleMouseEnter(menu.name)}
            onMouseLeave={handleMouseLeave}
          >
            <span className='menu-link'>{menu.name}</span>
            {openSubMenu === menu.name && (
              <div className='submenu'>
                {menu.links.map((link) => (
                  <Link key={link.path} to={link.path} className='submenu-link'>
                    {link.label}
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
