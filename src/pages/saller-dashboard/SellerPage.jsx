import styles from './styles/page.module.css';
import ContentSection from './components/ContentSection';
import SideBar from './components/SideBar';

function SellerPage() {
  return (
    <section className={styles.layout}>
      <SideBar />
      <ContentSection />
    </section>
  );
}

export default SellerPage;
