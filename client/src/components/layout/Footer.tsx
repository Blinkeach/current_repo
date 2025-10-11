import React from "react";
import { Link } from "wouter";
import Logo from "@/components/icons/Logo";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-12 pb-6 gpu-accelerated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="animate-fade-in">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-accent">
              {t("about blinkeach")}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
              India's favorite shopping destination with quality products and
              great deals.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/blinkeach"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-secondary w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://www.instagram.com/blinkeach?igsh=OGVoOGdzOXozYzlv"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-primary w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://youtube.com/@blinkeach?si=ca2yu6oX5L7GYxiJ"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-primary w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://wa.me/message/IX5645WNYBGHK1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-green-600 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-accent">{t("quick links")}</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link href="/about-us">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("about_us")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("contact_us")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("legal.terms_conditions.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("legal.privacy_policy.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("legal.shipping.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("legal.return_refund.title")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-accent">
              {t("customer service")}
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link href="/profile">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("myAccount")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/track-order">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("common.track_order")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/tracking">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    Track Shipment
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/wishlist">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("wishlist.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cart">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("cart.title")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/help-faq">
                  <span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer">
                    {t("help faq")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-accent">{t("contact.title")}</h3>
            <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 text-accent mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  WARD NO. 07, KB LANE, NEAR CHAURAHA MASJID, PANCHAYATI AKHARA
                  Gaya BIHAR 823001
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 text-accent mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+918274019912" className="hover:text-primary transition-colors">+91 8274019912</a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 text-accent mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:support@blinkeach.com" className="hover:text-primary transition-colors">support@blinkeach.com</a>
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-3 font-bold">GST:</span>
                <span>10AABCP1234B1Z5</span>
              </li>
            </ul>

            <h3 className="text-lg sm:text-xl font-bold mt-6 mb-3 text-accent">
              {t("checkout.payment_methods")}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png"
                alt="Paytm"
                className="h-6 sm:h-7 bg-white rounded p-0.5 hover:scale-110 transition-transform"
                loading="lazy"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                alt="Mastercard"
                className="h-6 sm:h-7 bg-white rounded p-0.5 hover:scale-110 transition-transform"
                loading="lazy"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                alt="Visa"
                className="h-6 sm:h-7 bg-white rounded p-0.5 hover:scale-110 transition-transform"
                loading="lazy"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                alt="American Express"
                className="h-6 sm:h-7 bg-white rounded p-0.5 hover:scale-110 transition-transform"
                loading="lazy"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png"
                alt="PayPal"
                className="h-6 sm:h-7 bg-white rounded p-0.5 hover:scale-110 transition-transform"
                loading="lazy"
              />
              <img
                src="https://razorpay.com/favicon.png"
                alt="Razorpay"
                className="h-6 sm:h-7 bg-white rounded p-0.5 hover:scale-110 transition-transform"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm sm:text-base text-center md:text-left">
            © {currentYear} <span className="text-accent font-semibold">Blinkeach</span>. {t("footer.all_rights_reserved")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-400">
            <Link href="/terms-and-conditions">
              <span className="hover:text-primary transition-colors cursor-pointer">
                {t("legal.terms_short")}
              </span>
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy-policy">
              <span className="hover:text-primary transition-colors cursor-pointer">
                {t("legal.privacy_short")}
              </span>
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/help-faq">
              <span className="hover:text-primary transition-colors cursor-pointer">
                {t("common.help")}
              </span>
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/contact-us">
              <span className="hover:text-primary transition-colors cursor-pointer">
                {t("contact_us")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
