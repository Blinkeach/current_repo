import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import TransitionLink from "./TransitionLink";
import Logo from "@/components/icons/Logo";
import SearchWithAutocomplete from "@/components/search/SearchWithAutocomplete";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  Phone,
  ShirtIcon,
  Tv,
  Home as HomeIcon,
  Building2,
  Palette,
  Zap,
  Baby,
  Utensils,
  Gamepad2,
  Heart,
  LogOut,
  Settings,
  Package,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { LanguageSelectorWithFlags } from "@/components/language/LanguageSelectorWithFlags";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    {
      name: "Home",
      translationKey: "common.home",
      icon: <HomeIcon className="h-5 w-5" />,
      href: "/",
    },
    {
      name: "Home & Office",
      translationKey: "common.home_office",
      icon: <Building2 className="h-5 w-5" />,
      href: "/shop/home-office",
    },
    {
      name: "Arts & Craft",
      translationKey: "common.arts_craft",
      icon: <Palette className="h-5 w-5" />,
      href: "/shop/arts-craft",
    },
    {
      name: "Electronics",
      translationKey: "common.electronics",
      icon: <Tv className="h-5 w-5" />,
      href: "/shop/electronics",
    },
    {
      name: "Fashion",
      translationKey: "common.fashion",
      icon: <ShirtIcon className="h-5 w-5" />,
      href: "/shop/fashion",
    },
    {
      name: "Appliances",
      translationKey: "common.appliances",
      icon: <Zap className="h-5 w-5" />,
      href: "/shop/appliances",
    },
    {
      name: "Toy",
      translationKey: "common.toy",
      icon: <Baby className="h-5 w-5" />,
      href: "/shop/toy",
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullName) return "U";

    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md gpu-accelerated">
      <div className="max-w-7xl mx-auto">
        {/* Top bar with brand gradient */}
        <div className="bg-brand-gradient p-1.5 flex justify-between text-white text-xs px-4 md:px-6">
          <p className="hidden sm:block font-medium">
            {t("common.welcome")} - {t("home.favorite_shopping")}
          </p>
          <div className="flex space-x-3 md:space-x-4">
            <a href="#" className="hover:underline transition-all">
              {t("common.sell_on_blinkeach")}
            </a>
            <TransitionLink
              href="/help-faq"
              className="hover:underline hidden sm:block transition-all"
            >
              {t("common.customer_service")}
            </TransitionLink>
            <button
              onClick={() => {
                if (user) {
                  window.location.href = "/orders";
                } else {
                  window.location.href = "/login?redirect=/orders";
                }
              }}
              className="hover:underline hidden sm:block text-white bg-transparent border-0 p-0 text-xs cursor-pointer transition-all"
            >
              {t("common.track_order")}
            </button>
          </div>
        </div>

        {/* Main header - Responsive and optimized */}
        <div className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <TransitionLink href="/">
              <div className="flex items-center hover-lift">
                <Logo size="small" />
              </div>
            </TransitionLink>
          </div>

          {/* Search - Responsive */}
          <div className="hidden md:flex flex-1 mx-4 lg:mx-6 max-w-2xl">
            <SearchWithAutocomplete 
              className="w-full"
              placeholder={t("common.search")}
            />
          </div>

          {/* Nav Icons - Responsive spacing */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
            {/* Language Selector */}
            <LanguageSelectorWithFlags />

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.profilePicture || ""}
                        alt={user.fullName}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <TransitionLink href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("account.profile")}</span>
                      </DropdownMenuItem>
                    </TransitionLink>
                    <TransitionLink href="/orders">
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        <span>{t("orders")}</span>
                      </DropdownMenuItem>
                    </TransitionLink>
                    <TransitionLink href="/wishlist">
                      <DropdownMenuItem>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Wishlists</span>
                      </DropdownMenuItem>
                    </TransitionLink>
                    {user.isAdmin && (
                      <TransitionLink href="/admin">
                        <DropdownMenuItem>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>{t("admin.dashboard")}</span>
                        </DropdownMenuItem>
                      </TransitionLink>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                      {logoutMutation.isPending
                        ? t("common.logging_out")
                        : t("common.logout")}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="relative cursor-pointer group">
                <TransitionLink href="/login">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-neutral-700" />
                    <span className="ml-1 hidden md:inline">
                      {t("common.login")}
                    </span>
                  </div>
                </TransitionLink>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-56 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                  <div className="p-4 border-b">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {t("auth.dontHaveAccount")}
                      </h3>
                      <span className="text-secondary hover:underline">
                        <TransitionLink href="/register">
                          {t("auth.register")}
                        </TransitionLink>
                      </span>
                    </div>
                  </div>
                  <ul className="py-2">
                    <li>
                      <TransitionLink href="/login">
                        <div className="block px-4 py-2 hover:bg-neutral-100">
                          {t("auth.login")}
                        </div>
                      </TransitionLink>
                    </li>
                    <li>
                      <TransitionLink href="/register">
                        <div className="block px-4 py-2 hover:bg-neutral-100">
                          {t("auth.register")}
                        </div>
                      </TransitionLink>
                    </li>
                    <li>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (user) {
                            window.location.href = "/orders";
                          } else {
                            window.location.href = "/login?redirect=/orders";
                          }
                        }}
                        className="block px-4 py-2 hover:bg-neutral-100 w-full text-left"
                      >
                        {t("common.track_order")}
                      </button>
                    </li>
                    <li>
                      <TransitionLink href="/help-faq">
                        <div className="block px-4 py-2 hover:bg-neutral-100">
                          {t("common.help")}
                        </div>
                      </TransitionLink>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="cursor-pointer relative">
              <TransitionLink href="/cart">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-neutral-700" />
                  <span className="ml-1 hidden md:inline">
                    {t("common.cart")}
                  </span>
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
              </TransitionLink>
            </div>

            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setShowMobileMenu(true)}
              size="icon"
            >
              <Menu className="h-5 w-5 text-neutral-700" />
            </Button>
          </div>
        </div>

        {/* Mobile search - Responsive */}
        <div className="md:hidden px-3 sm:px-4 pb-2 sm:pb-3">
          <SearchWithAutocomplete 
            className="w-full"
            placeholder={t("common.search")}
          />
        </div>

        {/* Categories Nav - Enhanced with brand colors and responsive */}
        <nav className="bg-gradient-to-r from-white via-gray-50 to-white border-t border-neutral-200 overflow-x-auto no-scrollbar">
          <div className="flex px-3 sm:px-4 py-2 space-x-4 sm:space-x-6 md:justify-center text-xs sm:text-sm">
            {categories.map((category, index) => (
              <TransitionLink
                key={index}
                href={
                  category.href ||
                  `/shop/${category.translationKey.split(".")[1].toLowerCase()}`
                }
              >
                <div className="flex flex-col items-center text-neutral-700 hover:text-primary smooth-transition min-w-fit group">
                  <div className="text-base sm:text-lg mb-0.5 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <span className="leading-tight font-medium">{t(category.translationKey)}</span>
                </div>
              </TransitionLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />
    </header>
  );
};

export default Header;
