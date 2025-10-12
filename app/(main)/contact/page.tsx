import Image from "next/image";
import React from "react";
import { MdLocationOn, MdEmail, MdAccessTime } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import imageUrl from "@/const/imageUrl";

function ContactPage() {
  return (
    <div className="w-full bg-white">
      {/* Section 1: Hero */}
      <section className="max-w-[1500px] mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F27D31]">
          Get in <span className="text-[#222]">Touch With Us</span>
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Have questions or want to know more about our fitness programs?
          Feel free to reach out to us. Our team is always ready to help!
        </p>
      </section>

      {/* Section 2: Contact Info */}
      <section className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {/* Card 1 */}
        <div className="flex flex-col items-center gap-3 bg-[#FEF2EA] p-6 rounded-xl shadow hover:shadow-md transition">
          <MdLocationOn className="text-[#F27D31] text-4xl" />
          <h3 className="font-semibold text-lg text-[#222]">Our Location</h3>
          <p className="text-gray-600 text-center">123 Fitness Street, Dhaka, Bangladesh</p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center gap-3 bg-[#FEF2EA] p-6 rounded-xl shadow hover:shadow-md transition">
          <BsTelephone className="text-[#F27D31] text-4xl" />
          <h3 className="font-semibold text-lg text-[#222]">Call Us</h3>
          <p className="text-gray-600 text-center">+880 1234 567 890</p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center gap-3 bg-[#FEF2EA] p-6 rounded-xl shadow hover:shadow-md transition">
          <MdEmail className="text-[#F27D31] text-4xl" />
          <h3 className="font-semibold text-lg text-[#222]">Email Us</h3>
          <p className="text-gray-600 text-center">support@fitclub.com</p>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col items-center gap-3 bg-[#FEF2EA] p-6 rounded-xl shadow hover:shadow-md transition">
          <MdAccessTime className="text-[#F27D31] text-4xl" />
          <h3 className="font-semibold text-lg text-[#222]">Working Hours</h3>
          <p className="text-gray-600 text-center">Mon - Sat: 7AM - 10PM</p>
        </div>
      </section>

      {/* Section 3: Contact Form */}
      <section className="max-w-[360px] md:max-w-[1000px] mx-auto px-6 py-20 bg-[#FEF2EA] rounded-3xl shadow">
        <h2 className="text-2xl md:text-3xl font-bold text-[#222] text-center mb-8">
          Send Us a Message
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#222]">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#222]">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-[#222]">Subject</label>
            <input
              type="text"
              placeholder="Message subject"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-[#222]">Your Message</label>
            <textarea
              rows={5}
              placeholder="Write your message..."
              className="w-full border border-gray-300 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#F27D31]"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-[#F27D31] text-white font-medium px-8 py-3 rounded-full hover:bg-[#e86f20] transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      {/* Section 4: Map / Image */}
      <section className="max-w-[1500px] mx-auto px-6 py-20">
        <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow">
          <Image
            src={imageUrl.about[1]}
            alt="map"
            fill
            className="object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#00000055] flex flex-col items-center justify-center text-white text-center px-4">
            <h3 className="text-2xl md:text-3xl font-bold">Visit Our Fitness Center</h3>
            <p className="text-sm md:text-base mt-2">
              Stay fit, stay strong — we’re just a visit away!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
