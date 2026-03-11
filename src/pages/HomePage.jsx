import React, { useState, useEffect, useRef } from "react";
import call from "../images/Vector.png";
import email from "../images/Vector 2.png";
import { Link } from "react-router-dom";
import "../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
// --- Awards images (from AboutUs) ---
import starperformer from "../images/Awards.jpg";
import rattanaward from "../images/DSC_0023.JPG";
import prideofIND from "../images/DSC_0022.JPG";
import IOBRD from "../images/DSC_0020.JPG";

// --- Background image for the parallax awards section ---
import ctaaboutus from "../images/awardsiimage.JPG"; // or any bg you prefer
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from 'framer-motion';
import TLDR from "../images/tldr.jpg";
import FadeInSection from "./Fadeinsection";
import ImageCarousel from '../Components/ImageCarousel';
import slide_image_5 from "../images/PHOTO_EDIT_6_resized.png";
import worldmap from "../images/world map.png";
import welplogo from "../images/welspun logo.png";
import wastemanageimg from "../images/bluemach.webp";
import industrialimg from "../images/PHOTO_EDIT_1_resized.png";
import DI_Pipe_Breaking_Machine from "../images/DIPIPE.webp";
import specialpurpimg from "../images/Pipe Sizing and Guaging Machine.jpg";
import manufacimagequ from "../images/Illustration.png";
import threeAscarpbaling from "../images/3 Action Scrap Baling Press.png";
import ringrolling from "../images/PHOTO EDIT 21.png";
import productsData from './ProductData';
import toyota from "../images/toyota.png";
import tata from "../images/tata.png";
import pepsi from "../images/pepsi.png";
import mahindra from "../images/mahindra.png";
import essar from "../images/essar.png";
import bajaj from "../images/bajaj.png";
import laval from "../images/laval.png";
import slide1 from "../images/Group 9245.png";
import slide2 from "../images/Group 9246.png";
import manufaclog from "../images/manufaclogo_CTP.png";
import slide3 from "../images/Group 9247.png";
import koh from "../images/kohler.png";
import herocorp from "../images/Hero MotoCorp logo.jpeg";
import ada from "../images/adani.png";
import ambuja from "../images/ambuja-logo-png_seeklogo-434902.png";
import orient from "../images/orient.png";
import ScrollingLogoBanner from "../Components/ScrollingLogoBanner";
import CountUp from 'react-countup';
import { FaUsers, FaGlobeAmericas, FaAward } from 'react-icons/fa';
import emailjs from "@emailjs/browser"; // ← ADDED EMAILJS

const useCountUp = (start, end, duration) => {
  const [count, setCount] = useState(start);
  const { ref, inView } = useInView({ triggerOnce: true });
  useEffect(() => {
    if (inView) {
      let startTime;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * (end - start) + start));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [inView, start, end, duration]);
  return [count, ref];
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const services = [
  {
    title: "Waste Management",
    description:
      "Our waste-management products with high hydraulic power and efficient engineering empowers scrap and waste management industries. From high-density balers and drum crushers to shredders and compactors, our machines cut disposal costs, boost recycling yields, and help clients meet environmental compliance targets while advancing their sustainability commitments and CSR. We empower the metal recycling industry worldwide.",
    image: threeAscarpbaling,
  },
  {
    title: "Industrial Machines",
    description:
      "Our industrial-machine portfolio covers various industries, from forging, machining sheet metal works, etc. Heavy-tonnage hydraulic presses, precision trimming machines, ring rollers, number punchers, etc are engineered for continuous duty, and low maintenance. Each solution integrates energy-efficient hydraulics. We empower industrial manufacturing companies, strengthening their operations.",
    image: ringrolling,
  },
  {
    title: "Special Purpose Machines",
    description:
      "When standard equipment can’t meet your process, we design and build special-purpose machines that do. Our expertise in industrial automation powered by hydraulics and electrical systems, we will engineer a product that fits your constraints. We will understand your requirements, and facilitate special features in our robust design, ready to ship within 3 to 6 months*.",
    image: DI_Pipe_Breaking_Machine,
  },
  {
    title: "Manufacturing Services",
    description:
      "We manufacture industrial products that can be forged or casted, our cross-holded partner SBUs specialise in industrial components. We have been exporting for 20+ years and follow strict quality, ensuring that every component meets specification, schedule, and cost goals while exceeding client expectations.",
    image: manufaclog,
  },
];

const HomePage = () => {
  const partnerLogos = [toyota, tata, pepsi, mahindra, essar, bajaj, laval, koh, herocorp, ada, ambuja, orient];
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false);
  const [clients, clientsRef] = useCountUp(0, 6000, 2000);
  const [countries, countriesRef] = useCountUp(0, 15, 1500);
  const [years, yearsRef] = useCountUp(0, 30, 1500);

  const awardsHome = [
  { id: 1, image: starperformer, title: "'Star Performer'" },
  { id: 2, image: rattanaward,  title: "'National Rattan Award'" },
  { id: 3, image: prideofIND,   title: "'Pride Of India'" },
  { id: 4, image: IOBRD,        title: "'IOBRD-2007'" },
];


  const testimonials = [
    {
      id: 1,
      name: "Rahul Mehta",
      designation: "Operations Manager",
      company: "Mahindra & Mahindra",
      logo: mahindra,
      text: "Started with one Rangani hydraulic scrap baler on our Nashik line; cycle time on off-cuts fell 55%. The press’s rugged ram handles oily stampings without stoppage, so forklift runs dropped to once per shift. We now run eleven identical units across all vehicle plants, standardised in our TPM playbook. Scrap resale value climbed, landfill tonnes crashed, ticking both margin and CSR boxes. Service calls are rare, but their techs plug straight into our SAP PM system for spares",
      image: TLDR,
    },
    {
      id: 2,
      name: "Ally Masi",
      designation: "Director of Industries Events Marketing",
      company: "Toyota Kirloskar Auto Parts Pvt. Ltd.",
      logo: toyota,
      text: "We needed a baler that fit our compact ‘Toyota Production System’ cell, not a bulky randomised sized frame. Rangani’s team rebuilt the platen, added poka-yoke sensors, and wrote a JIS-compliant PLC routine in three months. The custom low-height hopper slides under our press shop conveyor without layout change. OEE jumped four points, with zero containment alerts since commissioning. They’re now on our ‘A-rank’ vendor list—one of the very few in India.",
      image: TLDR,
    },
    // {
    //   id: 3,
    //   name: "Al Ma Cabrol LLC",
    //   company: "Al Ma Cabrol LLC, Oman",
    //   text: "Our corrugation line needed three machines and a dozen of operators; bottlenecks everywhere. Rangani proposed a single automated cell—servo-controlled feeder, hydraulic former, and inline shear. Throughput increased by significant margins, while headcount per shift dropped to five. Unit landed in Sohar five months after kick-off.",
    // },
    {
      id: 4,
      name: "Welspun Group",
      company: "Welspun Group",
      logo: welplogo,
      text: "Defect scrap—scale, sand, and odd shapes—was piling up beside our DI pipe mill. Rangani co-engineered a heavy-duty shredder with rotary dirt separators and over-belt magnet in one skid. Now we reclaim clean metal chips ready for the melt shop, cutting virgin charge by 8%. We could reuse the material on further operations, improving margins. Seeing the payback, we’ve budgeted two more lines and are planning to include Rangani in other areas.",
      image: TLDR,
    },
  ];

  // ========== FORM STATE ==========
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

  // ========== EMAILJS SUBMIT (NO PHP) ==========
  const handleSubmit = async () => {
    setFormError("");
    setFormSuccess("");
    setLoading(true);

    if (!formData.name || !formData.email || !formData.company || !formData.country || !formData.state || !formData.city) {
      setFormError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    if (!formData.terms) {
      setFormError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      emailjs.init("y6GrE9es5mRRflaKm"); // ← YOUR PUBLIC KEY

      await emailjs.send(
        "service_yvae06b",     // ← YOUR SERVICE ID
        "template_yy2moko",    // ← YOUR TEMPLATE ID
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

      setFormSuccess("Your message has been sent successfully!");
      setFormData({
        name: "", email: "", phone: "", company: "", country: "", state: "", city: "",
        category: "General Inquiry", message: "", terms: false,
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY <= lastScrollY);
      setIsTopButtonVisible(currentScrollY > 300);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans bg-cyan-50">
      {/* HERO SECTION */}
      <FadeInSection>
        <section className="bg-cyan-50 pb-10">
          <div className="widthforherosec mx-auto flex flex-col lg:flex-row items-center justify-between pt-32 sm:pt-36 lg:pt-40 px-4 md:px-8">
            <motion.div
              className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.h1
                className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-gray-800 leading-tight mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                REIMAGINING WASTE, <br />
                REENGINEERING <span className="text-teal-500">THE FUTURE</span>
              </motion.h1>
              <motion.p
                className="text-gray-600 text-[clamp(1rem,2vw,1.25rem)] mb-8 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Empowering Industries with Advanced Engineering Solutions
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.button
                  className="border-2 border-teal-500 text-teal-500 px-8 py-3 rounded-lg font-medium hover:bg-teal-500 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/category-page" className="hover:text-white">
                    Our Machines
                  </Link>
                </motion.button>
                <motion.button
                  className="bg-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://www.youtube.com/@RanganiEngineeringPvtLtd', '_blank')}
                >
                  Watch Video
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div className="w-full md:w-3/4 lg:w-1/2" variants={itemVariants}>
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                slidesPerView={1}
                onSlideChange={({ activeIndex }) => setActiveHeroIndex(activeIndex)}
                className="max-w-full rounded-lg"
              >
                {[slide1, slide2, slide3].map((img, i) => (
                  <SwiperSlide key={i}>
                    <motion.img
                      src={img}
                      alt={`Hero Slide ${i + 1}`}
                      loading="lazy"
                      initial={{ opacity: 0.8, scale: 0.95 }}
                      animate={
                        activeHeroIndex === i
                          ? { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
                          : { opacity: 0.8, scale: 0.95, transition: { duration: 0.8, ease: 'easeOut' } }
                      }
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </section>
      </FadeInSection>

      <ScrollingLogoBanner />

      {/* STATS SECTION */}
      <FadeInSection>
        <div className="container mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white shadow-2xl">
          <div className="mx-auto flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 md:gap-12">
            <div className="w-full md:w-2/5 flex justify-center opacity-80 md:opacity-100">
              <img src={worldmap} alt="World Map" className="max-w-xs md:max-w-full h-auto" />
            </div>
            <div className="w-full md:w-3/5 text-center md:text-left">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Ready to take the next step?
                </h2>
                <p className="text-lg text-cyan-100">
                  Get a personalized, no-obligation quote from our team today.
                </p>
              </div>
              <div className="my-8 flex flex-wrap justify-center md:justify-start gap-8 md:gap-10">
                <div className="flex items-center gap-3">
                  <FaUsers className="text-3xl text-cyan-200" />
                  <div>
                    <p className="text-3xl font-bold">
                      <CountUp end={6000} duration={3} enableScrollSpy scrollSpyOnce />+
                    </p>
                    <p className="text-sm text-cyan-100">Unique Clients</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobeAmericas className="text-3xl text-cyan-200" />
                  <div>
                    <p className="text-3xl font-bold">
                      <CountUp end={15} duration={3} enableScrollSpy scrollSpyOnce />+
                    </p>
                    <p className="text-sm text-cyan-100">Countries Served</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaAward className="text-3xl text-cyan-200" />
                  <div>
                    <p className="text-3xl font-bold">
                      <CountUp end={30} duration={3} enableScrollSpy scrollSpyOnce />+
                    </p>
                    <p className="text-sm text-cyan-100">Years of Experience</p>
                  </div>
                </div>
              </div>
              <div>
                <Link to="/contact">
                  <button className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-cyan-300">
                    Contact Us Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* SERVICES */}
      <FadeInSection>
        <section className="bg-cyan-50 py-16">
          <h2 className="text-center text-4xl sm:text-5xl font-bold mb-12 sm:mb-16 px-4">
            Our Wide <span className="text-teal-500">Range of Categories</span>
          </h2>
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col transition-transform hover:scale-105 w-full"
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                  <Link
                    to={`/category-page?category=${encodeURIComponent(service.title)}`}
                    className="text-teal-500 font-semibold hover:underline mb-4 block"
                  >
                    MORE MACHINES
                  </Link>
                  <div className="overflow-hidden rounded-lg mt-auto">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <div className="container mx-auto">
          <ImageCarousel />
        </div>
      </FadeInSection>

      {/* AWARDS – on-brand card hero (no crop) */}
      <FadeInSection>
        <section className="bg-cyan-50 py-14">
          <div className="container mx-auto px-4 md:px-8">
            {/* framed hero card, not full-bleed */}
            <div className="relative mx-auto max-w-6xl rounded-3xl overflow-hidden shadow-xl">
              {/* brand-tinted background to gracefully fill any gaps when image 'fits' */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />

              {/* foreground image that FITS (no cropping) */}
              <img
                src={ctaaboutus}
                alt="Awards background"
                className="relative z-10 w-full h-[460px] sm:h-[520px] md:h-[560px] object-contain"
                style={{ objectPosition: "center" }}
              />

              {/* subtle overlay for contrast */}
              <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-black/15 to-black/5" />

              {/* content pinned to the bottom of the image */}
              <div className="absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 pb-8">
                {/* title chip, centered and compact like the rest of your site */}
                <div className="mx-auto mb-6 w-fit rounded-full bg-white/90 backdrop-blur px-6 py-2 shadow">
                  <h2 className="text-slate-900 text-lg sm:text-xl font-semibold tracking-wide">
                    Our <span className="text-teal-600 font-bold">Achievements</span>
                  </h2>
                </div>

                {/* awards row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                  {awardsHome.map((award) => (
                    <div
                      key={award.id}
                      className="bg-white/95 backdrop-blur rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden rounded-md flex items-center justify-center">
                        <img
                          src={award.image}
                          alt={award.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-3 text-center text-sm sm:text-base font-semibold text-slate-800">
                        {award.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* TESTIMONIALS */}
      <FadeInSection>
        <section className="bg-cyan-50 py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Experiences <span className="text-teal-500">That Matter</span>
            </h2>
            <Swiper
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="testimonial-swiper pb-10"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="text-center px-6 sm:px-8 md:px-16 py-8 flex flex-col items-center justify-center">
                    <p className="text-gray-700 mb-8 text-base sm:text-lg md:text-xl italic leading-relaxed max-w-3xl mx-auto">
                      "{testimonial.text}"
                    </p>
                    <div className="flex flex-col items-center mt-auto">
                      {testimonial.logo && (
                        <img
                          src={testimonial.logo}
                          alt={`${testimonial.company} logo`}
                          className="testimonial-logo"
                        />
                      )}
                      <p className="font-bold text-gray-800 text-base sm:text-lg">{testimonial.company}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </FadeInSection>

      {/* CONTACT FORM – EMAILJS */}
      <FadeInSection>
        <section className="bg-cyan-50 py-16 px-4 md:px-12">
          <div className="container mx-auto bg-white shadow-lg rounded-lg p-8 flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Connect <span className="text-teal-500">With Us</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name*" className="input-style" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email*" className="input-style" />
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="input-style" />
                <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Company Name*" className="input-style" />
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country*" className="input-style" />
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State*" className="input-style" />
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City*" className="input-style" />
                <select name="category" value={formData.category} onChange={handleInputChange} className="input-style">
                  <option>Select Category</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Feedback</option>
                </select>
                <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" className="input-style md:col-span-2 h-24" />
                <div className="flex items-center md:col-span-2">
                  <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} className="mr-2" />
                  <label className="text-sm text-gray-600">Agree to our terms and conditions</label>
                </div>
                {formError && <p className="text-red-500 text-sm md:col-span-2">{formError}</p>}
                {formSuccess && <p className="text-green-500 text-sm md:col-span-2">{formSuccess}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-teal-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-teal-600 transition md:col-span-2 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit Now"}
                </button>
              </div>
            </div>
            <div className="w-full lg:w-5/12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Happy to Help</h3>
              <p className="text-gray-600 mb-6">
                24/7 service support and technical assistance. Visit our office for more insights.
              </p>
              <div className="flex items-center bg-teal-500 text-white p-4 rounded-lg shadow-md mb-4">
                <img src={email} alt="Email" className="pr-4 w-8 h-8" />
                <div>
                  <p className="text-sm">EMAIL US</p>
                  <p className="text-lg font-bold">mail@ranganiindia.com</p>
                </div>
              </div>
              <div className="flex items-center bg-teal-500 text-white p-4 rounded-lg shadow-md mb-4">
                <img src={call} alt="Call" className="pr-4 w-8 h-8" />
                <div>
                  <p className="text-sm">TALK TO US</p>
                  <p className="text-lg font-bold">Mobile: +91-8000920222 - Milan Rangani</p>
                </div>
              </div>
              <div className="text-gray-700">
                <h4 className="font-bold mb-2">Address:</h4>
                <p>Survey No. 258, Plot No. 5 To 11, NH-8B, Gondal Road, Near Priyesh Cotton, Shapar, Rajkot-360024, Gujarat, India.</p>
                <a href="https://maps.app.goo.gl/8QFjE7BRMg3AC63E9" target="_blank" rel="noopener noreferrer" className="text-teal-500 font-semibold mt-2 inline-block hover:underline">
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default HomePage;