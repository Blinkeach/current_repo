import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductGrid from '@/components/shop/ProductGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

const CategoryProductsSection: React.FC = () => {
  // Fetch all products
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      return response.json();
    }
  });

  return (
    <section className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center">
          <div className="p-1.5 sm:p-2 rounded-md mr-2 sm:mr-3 bg-primary/10">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center">
              All Products
              <div className="h-0.5 sm:h-1 w-8 sm:w-10 ml-2 sm:ml-3 rounded-full bg-primary"></div>
            </h2>
          </div>
        </div>
        <Link href="/shop">
          <div className="group flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
            <span className="text-xs sm:text-sm font-medium mr-1 sm:mr-2">View All</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
      
      <ProductGrid 
        products={products || []} 
        isLoading={isLoading}
        gridCols={4}
      />
    </section>
  );
};

export default CategoryProductsSection;