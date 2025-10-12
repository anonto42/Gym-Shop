import imageUrl from "@/const/imageUrl";
import Image from "next/image";
import React from "react";
import { BsPeople } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { IoCodeWorking } from "react-icons/io5";
import { MdOutlineFlaky } from "react-icons/md";

function AboutPage() {
  return (
    <div className="w-full bg-white">
      {/* Section 1 - Hero */}
      <section className="max-w-[1500px] mx-auto px-6 py-12 md:py-20">
        <h1 className="text-2xl md:text-4xl font-bold text-[#F27D31] text-center mb-6">
          IMPROVE YOUR <span className="text-[#222]">FITNESS LEVEL</span> FOR THE BETTER
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Image */}
          <div className="relative w-full h-[250px] md:h-[400px]">
            <Image
              src={imageUrl.about[1]}
              alt="about"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5">
            <p className="text-gray-700 leading-relaxed">
              We provide standard & express delivery services through our logistics partners,
              ensuring your fitness gear and essentials reach you quickly and safely.
              Join our growing community today!
            </p>

            <button className="bg-[#F27D31] text-white px-6 py-3 rounded-full w-fit">
              BE A MEMBER
            </button>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#222]">500+</h2>
                <p className="text-gray-600">Happy Members</p>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#222]">900+</h2>
                <p className="text-gray-600">Satisfied Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Our Story */}
      <section className="max-w-[1500px] mx-auto px-6 py-16">
        <h3 className="text-[#F27D31] font-semibold text-lg text-center">OUR STORY</h3>
        <h1 className="text-2xl md:text-4xl font-bold text-center mt-2 mb-6">
          We Create and Glory for the Fitness Landscape
        </h1>
        <p className="text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
          We are dedicated to providing high-quality solutions that make your fitness journey
          smoother and more effective. Innovation, dedication, and community are our core values.
        </p>

        <div className="flex flex-col gap-3 mt-8 max-w-xl mx-auto">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <MdOutlineFlaky className="text-[#F27D31] text-xl" />
              <p className="text-gray-700">
                Care landscape shows health and care services that empower growth and strength.
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-[#F27D31] text-white px-6 py-3 rounded-full">
            Learn More
          </button>
        </div>
      </section>

      {/* Section 3 - Why Choose Us */}
      <section className="max-w-[1500px] mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F27D31] mb-4">
            WHY CHOOSE US
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We offer a unique combination of personalized fitness training, expert guidance,
            and 24/7 support designed to help you achieve your goals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full h-[200px] md:h-[250px]">
              <Image
                src={imageUrl.about[3]}
                alt="fitness"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative w-full h-[200px] md:h-[250px]">
              <Image
                src={imageUrl.about[4]}
                alt="fitness"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 bg-[#FEF2EA] p-4 rounded-xl">
                <ImConnection className="text-[#F27D31] text-2xl" />
                <h2 className="font-semibold text-lg text-[#222]">24/7 Support</h2>
                <p className="text-gray-600 text-sm">
                  Get professional guidance anytime you need, helping you stay consistent
                  and motivated throughout your journey.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - Our Team */}
      <section className="max-w-[1500px] mx-auto px-6 py-20 bg-[#FEF2EA] rounded-3xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F27D31]">OUR TEAM</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Meet our passionate trainers and mentors who bring years of experience to help
            you stay fit and strong every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* Left Cards */}
          <div className="flex flex-col gap-6">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow">
                <BsPeople className="text-[#F27D31] text-3xl" />
                <div>
                  <h2 className="font-bold text-[#222]">John Doe</h2>
                  <p className="text-sm text-gray-600">
                    Certified fitness trainer helping clients achieve their personal goals.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="relative w-full h-[250px] md:h-[400px]">
            <Image
              src={imageUrl.about[1]}
              alt="team"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Right Cards */}
          <div className="flex flex-col gap-6">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow">
                <BsPeople className="text-[#F27D31] text-3xl" />
                <div>
                  <h2 className="font-bold text-[#222]">Jane Smith</h2>
                  <p className="text-sm text-gray-600">
                    Expert in nutrition and wellness strategies for long-term results.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Vision */}
      <section className="max-w-[1500px] mx-auto px-6 py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-[#F27D31] text-center mb-6">
          OUR GYM VISION
        </h1>
        <p className="text-center max-w-2xl mx-auto text-gray-700 mb-10">
          Our mission is to create a global community of empowered individuals committed to health,
          fitness, and mental strength.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="relative w-full h-[250px]">
            <Image
              src={imageUrl.about[2]}
              alt="vision"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-4 bg-[#FEF2EA] p-6 rounded-xl">
            <IoCodeWorking className="text-[#F27D31] text-3xl" />
            <h2 className="font-semibold text-lg text-[#222]">Our Commitment</h2>
            <p className="text-sm text-gray-600">
              We ensure your growth with proven techniques, support, and accountability.
            </p>
          </div>
          <div className="relative w-full h-[250px]">
            <Image
              src={imageUrl.about[2]}
              alt="vision"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Section 6 - Expert Team */}
      <section className="max-w-[1500px] mx-auto px-6 py-20 bg-[#FEF2EA]">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Meet Our <span className="text-[#F27D31]">Expert Team</span>
        </h1>
        <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10">
          Dedicated professionals ready to support your fitness journey every step of the way.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative w-full h-[250px] rounded-xl overflow-hidden shadow-md">
              <Image
                src={imageUrl.about[2]}
                alt={`team-${i}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
