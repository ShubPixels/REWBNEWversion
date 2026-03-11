import React, { useState } from "react";
import FadeInSection from "./Fadeinsection";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    state: "",
    city: "",
    category: "General Inquiry",
    message: "",
    terms: false,
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setLoading(true);

    const required = ["name", "email", "company", "country", "state", "city"];
    for (const f of required) {
      if (!formData[f].trim()) {
        setFormError(`Please fill in ${f}.`);
        setLoading(false);
        return;
      }
    }
    if (!formData.terms) {
      setFormError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      // Initialize EmailJS with your Public Key
      emailjs.init("y6GrE9es5mRRflaKm");

      await emailjs.send(
        "service_yvae06b",     // Your Service ID
        "template_yy2moko",    // Your Template ID
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          company: formData.company,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          category: formData.category,
          message: formData.message || "No message",
        }
      );

      setFormSuccess("Thank you! Your message has been sent.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        state: "",
        city: "",
        category: "General Inquiry",
        message: "",
        terms: false,
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeInSection>
      <section className="bg-cyan-50 py-16 pt-32 px-4 md:px-12">
        <div className="container mx-auto bg-white shadow-lg rounded-lg mt-10 p-8 flex flex-col lg:flex-row gap-8">
          {/* Left Side Form */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Connect <span className="text-teal-500">With Us</span>
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "email", "phone", "company", "country", "state", "city"].map((f) => (
                <input
                  key={f}
                  type={f === "email" ? "email" : "text"}
                  name={f}
                  value={formData[f]}
                  onChange={handleInputChange}
                  placeholder={`${f.charAt(0).toUpperCase() + f.slice(1)}${
                    ["name", "email", "company", "country", "state", "city"].includes(f) ? "*" : ""
                  }`}
                  className="input-style"
                  required={["name", "email", "company", "country", "state", "city"].includes(f)}
                />
              ))}
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-style"
              >
                <option>Select Category</option>
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Feedback</option>
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                className="input-style md:col-span-2 h-24"
              />
              <div className="flex items-center md:col-span-2">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                <label className="text-sm text-gray-600">
                  I agree to the terms and conditions
                </label>
              </div>

              {formError && (
                <p className="text-red-500 text-sm md:col-span-2">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-green-500 text-sm md:col-span-2">{formSuccess}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-teal-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-teal-600 transition md:col-span-2 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit Now"}
              </button>
            </form>
          </div>

          {/* Right Side Info */}
          <div className="w-full lg:w-5/12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Happy to Help</h3>
            <p className="text-gray-600 mb-6">
              24/7 service support and technical assistance. Visit our office for more insights.
            </p>
            <div className="flex items-center bg-teal-500 text-white p-4 rounded-lg shadow-md mb-4">
              <span className="material-icons mr-4">email</span>
              <div>
                <p className="text-sm">EMAIL US</p>
                <p className="text-lg font-bold">mail@ranganiindia.com</p>
              </div>
            </div>
            <div className="flex items-center bg-teal-500 text-white p-4 rounded-lg shadow-md mb-4">
              <span className="material-icons mr-4">phone</span>
              <div>
                <p className="text-sm">TALK TO US</p>
                <p className="text-lg font-bold">Mobile: +91-8000920222 - Milan Rangani</p>
              </div>
            </div>
            <div className="text-gray-700">
              <h4 className="font-bold mb-2">Address:</h4>
              <p>
                Survey No. 258, Plot No. 5 To 11, NH-8B, Gondal Road, Near Priyesh Cotton,
                Shapar, Rajkot-360024, Gujarat, India.
              </p>
              <a
                href="https://maps.app.goo.gl/8QFjE7BRMg3AC63E9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 font-semibold mt-2 inline-block hover:underline"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
};

export default ContactUs;