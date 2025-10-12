import React from "react";

function PrivacyAndReturnPage() {
  return (
    <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F27D31] mb-8 text-center">
          Privacy & Return Policy
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            At <strong>FitZone</strong>, your privacy is our top priority. We
            collect only the data necessary to process your orders and enhance
            your experience.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            1. Information We Collect
          </h2>
          <p>
            We collect personal data such as your name, email, address, and
            payment details to ensure smooth transactions and customer support.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            2. How We Use Your Data
          </h2>
          <p>
            Your data is used for processing orders, sending updates, and
            improving our services. We do not share your information with
            unauthorized parties.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            3. Return & Refund Policy
          </h2>
          <p>
            If you are not satisfied with your purchase, you can return the
            product within <strong>7 days</strong> of delivery. Returned items
            must be unused and in their original packaging.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            4. Contact Us
          </h2>
          <p>
            For any questions regarding our privacy or return policy, please
            email us at{" "}
            <a
              href="mailto:support@fitzone.com"
              className="text-[#F27D31] underline"
            >
              support@fitzone.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default PrivacyAndReturnPage;
