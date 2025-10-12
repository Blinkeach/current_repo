import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSlider from '@/components/home/HeroSlider';
import CategorySection from '@/components/home/CategorySection';
import PromotionalBanners from '@/components/home/PromotionalBanners';
import FeaturesSection from '@/components/home/FeaturesSection';
import AppDownloadBanner from '@/components/home/AppDownloadBanner';
import CategoryProductsSection from '@/components/home/CategoryProductsSection';
import ProductCarousel from '@/components/home/ProductCarousel';
import RecentlyViewedSection from '@/components/home/RecentlyViewedSection';
import ProductRecommendations from '@/components/recommendations/ProductRecommendations';
import { useAuth } from '@/hooks/use-auth';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Ensure page loads at the top - Multiple approaches for reliability
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Delayed scroll to handle any async content loading
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('welcome')} - Blinkeach</title>
        <meta name="description" content="Shop online for electronics, fashion, home appliances, and more. Great deals, fast delivery, easy returns. India's favorite shopping destination." />
      </Helmet>

      <main className="min-h-screen w-full overflow-x-hidden">
        {/* Hero Slider - Fully Responsive */}
        <div className="w-full">
          <HeroSlider />
        </div>

        {/* Feature Categories - Responsive */}
        <div className="w-full">
          <CategorySection />
        </div>

        {/* Personalized Recommendations - Responsive Container */}
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <ProductRecommendations
            title={t('recommendations')}
            userId={user?.id}
            maxItems={8}
            autoPlay={true}
            showAddToCart={true}
          />
        </section>

        {/* All Products Section - Responsive */}
        <div className="w-full">
          <CategoryProductsSection />
        </div>

        {/* Product Carousel (Deals + Top Selling) - Responsive */}
        <div className="w-full overflow-hidden">
          <ProductCarousel />
        </div>

        {/* Promotional Banners - Responsive */}
        <div className="w-full">
          <PromotionalBanners />
        </div>
        
        {/* Recently Viewed Products - Responsive */}
        <div className="w-full">
          <RecentlyViewedSection />
        </div>

        {/* Fashion Recommendations - Responsive Container */}
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 mb-4 sm:mb-6 md:mb-8">
          <ProductRecommendations
            title="Fashion & Style"
            category="Fashion"
            maxItems={6}
            autoPlay={true}
            showAddToCart={true}
          />
        </section>

        {/* Features - Responsive */}
        <div className="w-full">
          <FeaturesSection />
        </div>

        {/* App Download Banner - Responsive */}
        <div className="w-full">
          <AppDownloadBanner />
        </div>
      </main>
    </>
  );
};

export default HomePage;
