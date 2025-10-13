import React from "react";
import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Truck className="h-8 w-8 text-secondary" />,
    title: "Free Shipping",
    description: "On orders above ₹1",
  },
  {
    icon: <RefreshCcw className="h-8 w-8 text-secondary" />,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-secondary" />,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: <Headphones className="h-8 w-8 text-secondary" />,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto bg-white rounded-lg shadow-sm my-4 sm:my-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-2 sm:p-3 md:p-4 transition-all duration-300 hover:scale-105"
          >
            <div className="mb-2 sm:mb-3 transition-transform duration-300 hover:scale-110">
              {React.cloneElement(feature.icon as React.ReactElement, {
                className: "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-secondary"
              })}
            </div>
            <h3 className="font-medium text-neutral-800 mb-1 text-xs sm:text-sm md:text-base">
              {feature.title}
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-600 leading-tight">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
