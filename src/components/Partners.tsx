"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  {
    name: "CVS",
    logo: "/partners/cvs-logo.png",
    website: "https://www.cvs.com",
    color: "#DA291C", // CVS red
  },
  {
    name: "GNC",
    logo: "/partners/gnc-logo.png",
    website: "https://www.gnc.com",
    color: "#FF6B35", // GNC orange
  },
  {
    name: "Walgreens",
    logo: "/partners/walgreens-logo.jpg",
    website: "https://www.walgreens.com",
    color: "#E31837", // Walgreens red
  },
];

export default function Partners() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Our Partners
          </h2>
          <p className="text-gray-600">
            Trusted retailers for your supplement needs
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {partners.map((partner, index) => (
            <PartnerLogo
              key={partner.name}
              partner={partner}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerLogo({ partner, index }: { partner: typeof partners[0]; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center justify-center h-20 md:h-24 transition-all duration-300 opacity-70 hover:opacity-100"
    >
      <div className="relative w-32 md:w-40 h-16 md:h-20 flex items-center justify-center">
        {!imageError ? (
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            fill
            className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          // Fallback: Text-based logo with brand colors
          <div
            className="text-2xl md:text-3xl font-bold px-4 py-2 rounded-lg"
            style={{ color: partner.color }}
          >
            {partner.name}
          </div>
        )}
      </div>
    </motion.a>
  );
}
