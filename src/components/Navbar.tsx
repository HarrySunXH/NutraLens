"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Menu, X, MessageSquare, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { setIsOpen, itemCount } = useCart();

  const navLinks = [
    { href: "#how-it-works", label: "How It Works", id: "how-it-works", isSection: true },
    { href: "#features", label: "Features", id: "features", isSection: true },
    { href: "/chat", label: "AI Chat", id: "chat", isSection: false },
    { href: "/community", label: "Community", id: "community", isSection: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section based on scroll position
      const sections = navLinks.map((link) => {
        const element = document.getElementById(link.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id: link.id,
            top: rect.top,
            bottom: rect.bottom,
          };
        }
        return null;
      }).filter(Boolean) as Array<{ id: string; top: number; bottom: number }>;

      // Find the section currently in view
      const viewportMiddle = window.innerHeight / 2;
      const currentSection = sections.find(
        (section) =>
          section.top <= viewportMiddle + 100 &&
          section.bottom >= viewportMiddle - 100
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      } else if (window.scrollY < 100) {
        // If at top, no active section
        setActiveSection("");
      }
    };

    // Also check on hash change
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && navLinks.some((link) => link.id === hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);
    
    // Initial check
    handleScroll();
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Leaf className="w-8 h-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutraLens
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = link.isSection 
                ? activeSection === link.id 
                : pathname === link.href;
              
              // For section links on the home page
              if (link.isSection) {
                return (
                  <a
                    key={link.href}
                    href={isHomePage ? link.href : `/${link.href}`}
                    onClick={(e) => {
                      if (isHomePage) {
                        e.preventDefault();
                        const element = document.getElementById(link.id);
                        if (element) {
                          const offset = 80;
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                          });
                        }
                      }
                    }}
                    className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </a>
                );
              }

              // For page links (like Chat)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`}
                >
                  {link.id === "chat" && <MessageSquare className="w-4 h-4" />}
                  {link.id === "community" && <Users className="w-4 h-4" />}
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Cart Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer group"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
        >
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = link.isSection 
                ? activeSection === link.id 
                : pathname === link.href;
              
              if (link.isSection) {
                return (
                  <a
                    key={link.href}
                    href={isHomePage ? link.href : `/${link.href}`}
                    onClick={(e) => {
                      if (isHomePage) {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        const element = document.getElementById(link.id);
                        if (element) {
                          const offset = 80;
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                          });
                        }
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`}
                >
                  {link.id === "chat" && <MessageSquare className="w-4 h-4" />}
                  {link.id === "community" && <Users className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsOpen(true);
              }}
              className="w-full mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Shop Our Products
              {itemCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
