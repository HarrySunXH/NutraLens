"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Fitness Enthusiast",
    image: "👩‍💼",
    quote:
      "NutraLens helped me identify dangerous interactions I never knew about. My energy levels are up 40% and I'm finally seeing results!",
    rating: 5,
    result: "+40% Energy",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    image: "👨‍💻",
    quote:
      "As someone who sits all day, I was taking the wrong supplements. The AI analysis completely changed my approach to wellness.",
    rating: 5,
    result: "Better Focus",
  },
  {
    name: "Emily Rodriguez",
    role: "Nutrition Coach",
    image: "👩‍⚕️",
    quote:
      "I recommend NutraLens to all my clients. The personalization is incredible, and it saves me hours of research for each person.",
    rating: 5,
    result: "Time Saved",
  },
  {
    name: "David Thompson",
    role: "Marathon Runner",
    image: "🏃‍♂️",
    quote:
      "The interaction checker caught a serious issue with my pre-workout stack. This platform literally saved my health.",
    rating: 5,
    result: "Health Saved",
  },
  {
    name: "Jessica Park",
    role: "Busy Mom",
    image: "👩‍👧",
    quote:
      "No more guesswork! NutraLens gave me clarity on what I actually need for my hormonal health. Game changer for working moms.",
    rating: 5,
    result: "Hormonal Balance",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real people, real results, real transformations
          </p>
        </motion.div>

        {/* Testimonials Scroll Container */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Gradient Overlays for Scroll Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />

          {/* Scrollable Container */}
          <div className="overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex gap-6 min-w-max px-4 md:px-0">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group w-80 flex-shrink-0"
                >
                  <div className="glass-strong rounded-3xl p-8 h-full relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                      <Quote className="w-16 h-16 text-emerald-600" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-4 mt-auto">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl">
                        {testimonial.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Result Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-700">
                          {testimonial.result}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "98%", label: "Satisfaction" },
            { value: "1M+", label: "Analyses Done" },
            { value: "4.9/5", label: "Average Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
