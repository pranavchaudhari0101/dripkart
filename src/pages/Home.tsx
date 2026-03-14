import { Hero } from '../components/Hero';
import { Ticker } from '../components/Ticker';
import { ProductGrid } from '../components/ProductGrid';
import { Editorial } from '../components/Editorial';
import { Philosophy } from '../components/Philosophy';

export function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <ProductGrid />
      <Editorial />
      <Philosophy />
    </>
  );
}
