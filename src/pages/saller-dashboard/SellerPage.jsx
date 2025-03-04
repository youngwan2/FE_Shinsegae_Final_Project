import styles from './styles/page.module.css';
import ContentSection from './components/ContentSection';
import Taps from './components/Taps';

function SellerPage() {
  return (
    <section className={styles.layout}>
      <Taps />
      <ContentSection />
    </section>
  );
}

export default SellerPage;
