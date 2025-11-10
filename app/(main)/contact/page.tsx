"use client";

import Image from "next/image";
import React, { useState } from "react";
import { MdLocationOn, MdEmail, MdAccessTime } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import imageUrl from "@/const/imageUrl";
import { createContactMessageServerSide } from "@/server/functions/contact.fun";
import { toast } from "sonner";

function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (formData.subject.trim().length < 5) {
            newErrors.subject = "Subject must be at least 5 characters";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name.trim());
            formDataToSend.append("email", formData.email.trim().toLowerCase());
            formDataToSend.append("subject", formData.subject.trim());
            formDataToSend.append("message", formData.message.trim());

            const result = await createContactMessageServerSide(formDataToSend);

            if (result.isError) {
                toast.error(result.message);
            } else {
                toast.success(result.message);
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
                setErrors({});
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            console.error("Contact form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <MdLocationOn className="text-[#F27D31] text-4xl" />,
            title: "Our Location",
            description: "123 Fitness Street, Dhaka, Bangladesh"
        },
        {
            icon: <BsTelephone className="text-[#F27D31] text-4xl" />,
            title: "Call Us",
            description: "+880 1234 567 890"
        },
        {
            icon: <MdEmail className="text-[#F27D31] text-4xl" />,
            title: "Email Us",
            description: "support@fitclub.com"
        },
        {
            icon: <MdAccessTime className="text-[#F27D31] text-4xl" />,
            title: "Working Hours",
            description: "Mon - Sat: 7AM - 10PM"
        }
    ];

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
                {contactInfo.map((info, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-3 bg-[#FEF2EA] p-6 rounded-xl shadow hover:shadow-md transition hover:transform hover:-translate-y-1 duration-300"
                    >
                        {info.icon}
                        <h3 className="font-semibold text-lg text-[#222]">{info.title}</h3>
                        <p className="text-gray-600 text-center">{info.description}</p>
                    </div>
                ))}
            </section>

            {/* Section 3: Contact Form */}
            <section className="max-w-[360px] md:max-w-[1000px] mx-auto px-6 py-20 bg-[#FEF2EA] rounded-3xl shadow">
                <h2 className="text-2xl md:text-3xl font-bold text-[#222] text-center mb-8">
                    Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#222]">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31] ${
                                errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[#222]">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31] ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-[#222]">Subject *</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Message subject"
                            className={`w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27D31] ${
                                errors.subject ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-sm">{errors.subject}</p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-[#222]">Your Message *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Write your message..."
                            className={`w-full border px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#F27D31] ${
                                errors.message ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm">{errors.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#F27D31] text-white font-medium px-8 py-3 rounded-full hover:bg-[#e86f20] transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </div>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                    </div>
                </form>
            </section>

            {/* Section 4: Map / Image */}
            {/*<section className="max-w-[1500px] mx-auto px-6 py-20">*/}
            {/*    <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow">*/}
            {/*        <Image*/}
            {/*            src={imageUrl.about[1]}*/}
            {/*            alt="Fitness Center Location"*/}
            {/*            fill*/}
            {/*            className="object-cover"*/}
            {/*            priority*/}
            {/*        />*/}
            {/*        /!* Overlay *!/*/}
            {/*        <div className="absolute inset-0 bg-[#00000055] flex flex-col items-center justify-center text-white text-center px-4">*/}
            {/*            <h3 className="text-2xl md:text-3xl font-bold">Visit Our Fitness Center</h3>*/}
            {/*            <p className="text-sm md:text-base mt-2 max-w-md">*/}
            {/*                Stay fit, stay strong — we&#39;re just a visit away!*/}
            {/*            </p>*/}
            {/*            <button*/}
            {/*                onClick={() => {*/}
            {/*                    // You can add map navigation logic here*/}
            {/*                    toast.info("Opening location in maps...");*/}
            {/*                }}*/}
            {/*                className="mt-4 bg-[#F27D31] text-white px-6 py-2 rounded-full hover:bg-[#e86f20] transition"*/}
            {/*            >*/}
            {/*                Get Directions*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Success Message (optional) */}
            {!isSubmitting && Object.keys(formData).every(key => !formData[key as keyof typeof formData]) && (
                <div className="max-w-[1500px] mx-auto px-6 pb-20 text-center mt-6">
                    <p className="text-gray-600">
                        We typically respond within 24 hours during business days.
                    </p>
                </div>
            )}
        </div>
    );
}

export default ContactPage;