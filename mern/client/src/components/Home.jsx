import React from "react";
import backgroundImage from "../assets/home-background.png"; // Import the background image
import PalmOfHand from "../assets/palm-of-hand.png"; // Import the palm-of-hand.png image
import SNHUCampus from "../assets/snhu-campus.png"; // Import the snhu-campus.png image

export default function Home() {
  return (
    <div
      className="min-w-[1024px] overflow-x-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          marginTop: "100px",
        }}
      >
        {/* First Rectangle */}
        <div
          className="bg-black bg-opacity-30 p-12 w-[80%] rounded-2xl shadow-lg text-left mt-10 flex flex-col justify-between"
          style={{
            height: "500px",
          }}
        >
          <div className="flex justify-start items-center">
            <h1 className="text-5xl font-bold text-white mb-4 leading-relaxed">
              Track your <span className="glow-text">energy</span> and <br />
              <span className="glow-text">charge</span> your{" "}
              <span className="glow-text">devices</span> on <br />
              the <span className="glow-text">go!</span>
            </h1>
            <img
              src={PalmOfHand}
              alt="Palm of Hand illustration"
              className="w-72 h-72 mt-4 aura-effect ml-[70px]" // Added negative margin-left
            />
          </div>
          {/* Buttons */}
          <div className="flex space-x-4 mb-8 mt-6">
            <a
              href="/login"
              className="text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
              style={{ backgroundColor: "#96e52c" }} // Custom green shade
            >
              Connect
            </a>
            <a
              href="/about"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Our Mission
            </a>
          </div>
        </div>

        {/* Second Rectangle */}
        <div
          className="bg-black bg-opacity-50 p-12 w-full rounded-lg shadow-lg text-center mt-40 flex items-start justify-start"
          style={{
            height: "400px",
          }}
        >
          <div className="flex flex-col items-start mr-12">
            <p className="text-3xl font-bold text-white mb-4">Join us at :</p>
            <img
              src={SNHUCampus}
              alt="SNHU Campus building"
              className="w-80 h-auto rounded-2xl"
            />
          </div>
          <div className="text-left flex-1 mt-10">
            <h1 className="text-2xl font-bold text-white mb-4">
              <a
                href="https://www.google.com/maps?q=SNHU+Athletic+Complex,+2500+N+River+Rd,+Manchester,+NH+03106"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                SNHU Athletic Complex<br />
                2500 N River Rd, Manchester, NH 03106
              </a>
            </h1>
            <p className="text-gray-300">
              Operating Hours: 08:00 - 18:00, Monday - Friday. <br />
              Contact us at: (603) 645-9643
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}