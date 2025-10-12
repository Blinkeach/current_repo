import React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Home as HomeIcon,
  Building2,
  Palette,
  Tv,
  ShirtIcon,
  Zap,
  Baby,
} from "lucide-react";

interface Category {
  id: number;
  translationKey: string;
  icon: React.ReactNode;
  link: string;
}

const CategorySection: React.FC = () => {
  const { t } = useTranslation();

  const categories: Category[] = [
    {
      id: 1,
      translationKey: "categories.home",
      icon: <HomeIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/",
    },
    {
      id: 2,
      translationKey: "categories.home_office",
      icon: <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/shop/home-office",
    },
    {
      id: 3,
      translationKey: "categories.arts_craft",
      icon: <Palette className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/shop/arts-craft",
    },
    {
      id: 4,
      translationKey: "categories.electronics",
      icon: <Tv className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/shop/electronics",
    },
    {
      id: 5,
      translationKey: "categories.fashion",
      icon: <ShirtIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/shop/fashion",
    },
    {
      id: 6,
      translationKey: "categories.appliances",
      icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/shop/appliances",
    },
    {
      id: 7,
      translationKey: "categories.toys",
      icon: <Baby className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-secondary" />,
      link: "/shop/toy",
    },
  ];

  return (
    <section className="w-full py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 mb-4 sm:mb-6 md:mb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6 text-center md:text-left px-1">
          {t("categories.shop_by_category")}
        </h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 lg:gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className="flex flex-col items-center justify-center text-center p-3 sm:p-3 md:p-4 lg:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 min-h-[100px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[130px]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-2 sm:mb-2 md:mb-3 flex-shrink-0">
                  {category.icon}
                </div>
                <span className="text-[10px] xs:text-xs sm:text-sm md:text-base text-neutral-800 font-medium leading-tight text-center break-words w-full px-1">
                  {t(category.translationKey)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
