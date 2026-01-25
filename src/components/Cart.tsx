"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ExternalLink, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function Cart() {
  const { items, removeFromCart, clearCart, isOpen, setIsOpen, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                  <p className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-500">Add products from the chat to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        {item.source && (
                          <p className="text-xs text-gray-500 mb-2">{item.source}</p>
                        )}
                        {item.price && (
                          <p className="text-sm font-semibold text-emerald-600 mb-2">
                            {item.price}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            View Product
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Items:</span>
                  <span className="text-lg font-bold text-gray-900">{itemCount}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would redirect to checkout
                      alert("Checkout functionality coming soon!");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
                  >
                    Checkout
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Products are purchased from external retailers. NutraLens does not handle transactions.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
