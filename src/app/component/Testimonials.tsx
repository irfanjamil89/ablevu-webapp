"use client";
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    image: "/assets/images/profile.png",
    quote: "AbleVu is such a great accessibility tool, it allows me to see an environment before I go. This is important to me because I am a wheelchair user and it allows me to know that I will be able to get around and access the areas that I need to go and if I do see anything that I might have an issue with I can plan accordingly. I really wish more places had such in-depth visual tours.",
    name: "Joe Rezmer",
    title: "Forward Creative Manager",
    rating: 5
  },
  {
    image: "/assets/images/profile.png",
    quote: "Working with this team has been an absolute game-changer for our business. Their attention to detail and commitment to delivering exceptional results exceeded all our expectations. I highly recommend their services to anyone looking for top-tier digital solutions.",
    name: "Sarah Johnson",
    title: "CEO, Tech Innovations",
    rating: 5
  },
  {
    image: "/assets/images/profile.png",
    quote: "The level of professionalism and expertise demonstrated throughout our project was remarkable. They took the time to understand our unique needs and delivered a solution that perfectly aligned with our vision. Our online presence has never been stronger.",
    name: "Michael Chen",
    title: "Marketing Director, Global Corp",
    rating: 5
  },
  {
    image: "/assets/images/profile.png",
    quote: "From concept to execution, every step of the process was seamless. The creative solutions they provided helped us stand out in a crowded market. Their ongoing support and dedication to our success makes them a true partner in our growth.",
    name: "Emma Williams",
    title: "Founder, Creative Studio",
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="bg-white py-16 relative">
      <div 
        className="max-w-7xl mx-auto text-center px-6 font-['Raleway']"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Testimonial Content */}
        <div 
          className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Testimonial Image */}
          <img
            src={currentTestimonial.image}
            alt={currentTestimonial.name}
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-gray-200"
          />

          {/* Testimonial Text */}
          <p className="text-gray-700 text-lg leading-relaxed mb-8 text-[18px] max-w-4xl mx-auto">
            "{currentTestimonial.quote}"
          </p>

          {/* Name and Title */}
          <h3 className="font-['Montserrat'] text-[18px] font-semibold text-gray-900">
            {currentTestimonial.name}
          </h3>
          <p className="font-['Montserrat'] text-[16px] text-gray-500 my-2">
            {currentTestimonial.title}
          </p>

          {/* Stars */}
          <div className="flex justify-center space-x-1 text-yellow-400 mb-12">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 20.202 4.665 24 6 15.6 0 9.753l8.332-1.735z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center group shadow-lg"
          aria-label="Previous testimonial"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center group shadow-lg"
          aria-label="Next testimonial"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}