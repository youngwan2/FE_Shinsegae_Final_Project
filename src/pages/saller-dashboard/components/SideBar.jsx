import { NavLink } from 'react-router';
import {
  IoLogOutOutline,
  IoBarChartOutline,
  IoBriefcaseOutline,
  IoCartOutline,
  IoCarOutline,
  IoStorefrontOutline,
  IoPersonOutline,
  IoCardOutline,
} from 'react-icons/io5';
import styles from '../styles/page.module.css';

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <div>
        <h2 className={styles['sidebar-title']}>
          <IoStorefrontOutline /> 판매자 대시보드
        </h2>
        <hr />

        {/* 네비게이션 */}
        <div className={styles['sidebar-navigation']}>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/dashboard'}
          >
            <IoBarChartOutline /> 대시보드
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/product'}
          >
            <IoBriefcaseOutline /> 상품관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/order'}
          >
            <IoCartOutline /> 주문관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/inventory'}
          >
            <IoCarOutline /> 재고관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/income'}
          >
            <IoCardOutline /> 매출 및 정산
          </NavLink>
          <hr />
        </div>
      </div>
      {/* 판매자 프로필 */}
      <div className={styles['sidebar-profile']}>
        <IoPersonOutline className={styles['seller-icon']} />
        <div className={styles['profile-contents']}>
          <p className={styles['seller-name']}>홍길동 점주님</p>
          <span className={styles['placename']}>부산점</span>
        </div>
        <button className={styles['logout-button']} title='로그아웃'>
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}

export default SideBar;
