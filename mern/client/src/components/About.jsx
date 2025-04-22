import React, { useState, useRef } from "react";

export default function About() {
  const [tooltip, setTooltip] = useState({ text: "", top: 0, left: 0, visible: false });
  const imageRef = useRef(null); // Reference to the image container

  return (
    <div className="min-w-[1024px] overflow-x-auto">
      {/* Add top margin to move rows further down */}
      <div className="mt-32"> {/* Added top margin */}
        {/* First Row */}
        <div className="flex flex-row items-center justify-center min-h-[600px]">
          {/* Left Image */}
          <div className="w-[40%] h-[600px]">
            <img
              src="/src/assets/about-page-filler-img-1.jpg"
              alt="About Page Filler"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Opaque Rectangle */}
          <div className="bg-black bg-opacity-30 p-12 w-[40%] h-[600px] shadow-lg text-left">
            <h1 className="text-5xl font-bold text-white mb-6">About GridFit</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              GridFit is a platform designed to help students track their energy usage and optimize their device charging habits.
              Our mission is to provide tools and insights that empower users to make smarter energy decisions.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mt-6">
              Whether you're on campus or on the go, GridFit ensures you stay connected and powered up. Join us in creating a more
              sustainable future by making informed energy choices.
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-row items-center justify-center min-h-[600px] mt-10"> {/* Added spacing between rows */}
          {/* Left Opaque Rectangle */}
          <div className="bg-black bg-opacity-30 p-12 w-[40%] h-[600px] shadow-lg text-left">
            <h1 className="text-4xl font-bold text-white mb-6">Our Mission</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              At GridFit, we aim to revolutionize energy tracking and device charging habits. Our goal is to empower users with
              tools and insights to make smarter energy decisions.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-[40%] h-[600px]">
            <img
              src="/src/assets/about-page-filler-img-2.png"
              alt="About Page Filler 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
