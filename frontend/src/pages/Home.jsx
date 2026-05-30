import HeroSection from '../components/home/HeroSection'
import CategoryShowcase from '../components/home/CategoryShowcase'
import FeaturedProducts from '../components/home/FeaturedProducts'
import OfferBanner from '../components/home/OfferBanner'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <OfferBanner />
      <FeaturedProducts />
    </div>
  )
}
