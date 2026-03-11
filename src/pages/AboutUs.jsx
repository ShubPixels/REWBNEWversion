import React, { useState } from 'react';
import heroabout from "../images/hero_about.png";
import ourstoryimg from "../images/our_story.png";
import whatwedo1 from "../images/What_WE_1.png";
import whatwedo2 from "../images/What_WE_2.png";
import whatwedo3 from "../images/Custom-Built Solutions.png";
import whatwedo4 from "../images/manufacturing services.png";
import starperformer from "../images/Awards.jpg";
import rattanaward from "../images/DSC_0023.JPG";
import prideofIND from "../images/DSC_0022.JPG";
import IOBRD from "../images/DSC_0020.JPG";
import ctaaboutus from "../images/cta_about.png";
import { Link } from "react-router-dom";
import wastemab from "../images/Waste management.jpg";
import manfac from "../images/manufacturing services.jpg";
import missicon from "../images/Group.png";
import innicon from "../images/Group 926565.png";
import specialpab from "../images/Special purpose _ custom machines.jpeg";
import sustaintech from "../images/collaboration for sustainable future.png";
import { motion, Variants } from 'framer-motion';
import FadeInSection from "./Fadeinsection";

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
const SectionWrapper = ({ children, delay = 0 }) => (
  <motion.div
    className="rounded-lg p-6 shadow-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.6 }}
  >
    {children}
  </motion.div>
);

const AboutUs = () => {
  const services = [
    {
      id: 1,
      image: wastemab , // Replace with actual image path
      title: {
        highlight1: "Waste",
        normal: "Management &",
        highlight2: "Scrap",
        ending: "Processing Machinery"
      },
      description: "We build the muscle behind recycling industries. Our hydraulic baling presses compact scrap metal into dense, transport-ready blocks. Shredders tear through tires, e-waste, and industrial byproducts. Hydraulic breaking machines dismantle outdated components and infrastructural wastes, while scrap cutting systems slice through thick steel like butter."
    },
    {
      id: 2,
      image: whatwedo2 , // Replace with actual image path
      title: {
        highlight1: "Industrial",
        normal: "Equipment &",
        highlight2: "Heavy",
        ending: "Machinery Solutions"
      },
      description: "Our industrial equipment division designs and manufactures robust machinery for demanding environments. From custom conveyor systems to specialized processing equipment, we engineer solutions that enhance productivity while reducing operational costs. Our machines are built to withstand harsh conditions and deliver consistent performance for years of reliable service."
    },
    {
      id: 3,
      image: sustaintech , // Replace with actual image path
      title: {
        highlight1: "Sustainable",
        normal: "Technologies for",
        highlight2: "Eco-friendly",
        ending: "Manufacturing"
      },
      description: "We pioneer green manufacturing technologies that reduce environmental impact without compromising performance. Our energy-efficient systems minimize power consumption while maximizing output. From water recycling systems to emissions control solutions, we help industries transition to more sustainable operational models that meet increasingly stringent environmental regulations."
    },
    {
      id: 4,
      image: specialpab , // Replace with actual image path
      title: {
        highlight1: "Special-Purpose",
        normal: "Machinery &",
        highlight2: "Custom Automation",
        ending: ""
      },
      description: "When off-the-shelf equipment can’t match your process, we design, prototype, and build machines that do. Whether it’s a high-speed assembly cell, a test rig for critical components, or a compact line retrofit, our team integrates hydraulics, motion control, and PLC logic to meet exact cycle-time and quality targets. Each project is delivered with full documentation, operator training, and lifecycle support—putting purpose-built performance directly on your factory floor."
    },
    {
      id: 5,
      image: manfac , // Replace with actual image path
      title: {
        highlight1: "Precision Manufacturing",
        normal: "Services",
        highlight2: "Forging, Casting & CNC",
        ending: "Machining"
      },
      description: "Beyond finished machines, we supply the parts that power them. Tight process controls ensure metallurgical integrity, while in-house heat treatment and surface finishing cut lead times. Learn more by posting about your specific requirements."
    }
  ];
  const awards = [
    {
      id: 1,
      image: starperformer, // Replace with actual award image
      title: "'Star Performer'"
    },
    {
      id: 2,
      image: rattanaward , // Replace with actual award image
      title: "'National Rattan Award'"
    },
    {
      id: 3,
      image: prideofIND , // Replace with actual award image
      title: "'Pride Of India'"
    },
    {
      id: 4,
      image: IOBRD , // Replace with actual award image
      title: "'IOBRD-2007'"
    }
  ];
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission - could connect to your API or mailing service
    console.log('Email submitted:', email);
    // Reset form after submission
    setEmail('');
    // You could add success notification here
  };


  return (
    <>
    {/* HERO SECTION */}
    <motion.div 
      className="relative w-full h-64 md:h-80 lg:h-96 mt-24"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      >
      {/* Background Image */}
      <motion.img
        src={heroabout}
        className="absolute inset-0 w-full h-full object-cover"
        alt="Industrial recycling facility with a worker"
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight md:leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}      
            >
            Leading the Future: Innovating Sustainability for a Cleaner, <br className="hidden md:block" />
            <span className="text-emerald-400">Greener World.</span>
          </motion.h1>
        </div>
      </div>
    </motion.div>

    <div className="w-full bg-cyan-50 py-10 px-4 md:px-8 lg:px-16">
      {/* nav and our story*/}
      <div className=" container mx-auto bg-gray-50 py-8 md:py-12">
        <div className="mx-auto px-4">
          {/* Navigation */}
          {/* <div className="mb-4 text-sm">
            <span className="text-gray-400">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-emerald-500">About Us</span>
          </div> */}
          
          {/* Content Section */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-8 items-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            >
            {/* Text Content */}
            <div className="lg:w-2/3">
              <motion.h2 
               className="text-3xl md:text-4xl font-bold mb-6"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.6 }}
              >
                Our <span className="text-emerald-500">Story</span>
              </motion.h2>
              
              <motion.p 
              className="text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              >
                Established in 1981, we have engineered over 600 unique machines, ranging from compact equipment to large-scale industrial machinery. With a client base that includes top MNCs, government entities worldwide and numerous SMEs, we deliver solutions that rein in quality, simplicity, and durability.Established in 1991, we have engineered over 600 unique machines, ranging from compact equipment to large-scale industrial machinery. With a client base that includes top MNCs, government entities worldwide and numerous SMEs, we deliver solutions that rein in quality, simplicity, and durability.
              </motion.p>
              
              <motion.p 
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              >
                Our offerings encompass cutting-edge solutions for recycling, waste management, and heavy-duty industrial machinery. Driven by Hydraulics and Automation systems, we are committed to delivering engineering solutions that exceed client expectations.
              </motion.p>
            </div>
            
            {/* Image */}
            <div className="lg:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div>
                  <motion.img
                  src={ourstoryimg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="w-full h-64 bg-gray-300" 
                  aria-label="Industrial facility with large silos and manufacturing building"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* vision mission */}
      <motion.div 
        className="container mx-auto grid grid-cols-1 mt-12 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
       >
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Vision Section */}
          <motion.div 
            className="bg-slate-700 text-white rounded-lg p-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <motion.h2 
                className="text-2xl font-bold mr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                >
                Our <span className="text-teal-400">Vision</span>
              </motion.h2>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                >
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
              </motion.svg>
            </div>
            <motion.p 
            className="text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}>
              To be the world's leading provider of advanced engineering solutions, specializing in machinery that
              promotes sustainability and operational excellence.
            </motion.p>
          </motion.div>

          {/* Mission Section */}
          <motion.div 
            className="bg-blue-100 rounded-lg p-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <motion.h2 
                className="text-2xl font-bold mr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Our <span className="text-teal-500">Mission</span>
              </motion.h2>
              <motion.img 
                src={innicon}
                alt="Mission Icon"
                className="w-6 h-6 text-teal-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            </div>
            <motion.p 
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              To engineer innovative and sustainable solutions for waste management and industrial applications,
              providing reliable and efficient machinery to enhance operational efficiency for our clients worldwide.
            </motion.p>
          </motion.div>

          {/* Quality and Sustainability Section */}
          <motion.div 
            className="bg-white rounded-lg p-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <motion.h2 
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className="text-teal-500">Quality</span> and <span className="text-teal-500">Sustainability</span>
              </motion.h2>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-6 h-6 text-teal-500 ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 9a.75.75 0 010 1.06l-3.22 3.22H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </motion.svg>
            </div>
            <motion.p 
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Our Philosophy is simple: Build machines that last. We prioritize durability and build quality, ensuring
              each machine we produce withstand the test of time and environment. This emphasis on quality has
              landed us with multiple MNC's & government projects overseas, and are recognized as top
              manufacturer and exporter by government of India.
            </motion.p>
          </motion.div>

        </div>

        {/* Right Column */}
        <motion.div 
          className="bg-blue-50 rounded-lg p-6 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Why Choose <span className="text-teal-500">Us</span> ?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="bg-teal-200 p-4 rounded-lg mb-4 w-20 h-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-teal-700">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">
                <span className="text-teal-500">Tailored</span> Solutions
              </h3>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="bg-gray-200 p-4 rounded-lg mb-4 w-20 h-20 flex items-center justify-center">
                <img src={missicon} alt="Innovation" className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-center">
                <span className="text-teal-500">Innovation</span> In User<br />Experience
              </h3>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="bg-blue-200 p-4 rounded-lg mb-4 w-20 h-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-blue-700">
                  <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                  <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">
                <span className="text-teal-500">SME</span> Partnership
              </h3>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="bg-gray-200 p-4 rounded-lg mb-4 w-20 h-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-teal-700">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">
                <span className="text-teal-500">Commitment</span> to Safety
              </h3>
            </motion.div>
          </div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <p className="text-gray-700">
              We are not just another manufacturer; we are your partner in industrial efficiency
              and sustainability. Our user-friendly machines simplify operations and boost
              productivity. Choose us for reliability, sustainability, and excellence.
            </p>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* what we do */}
      <motion.div 
        className="container mx-auto mt-14"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        >
        {/* Section Title */}
        <div className="flex items-center justify-center mb-12">
          <motion.h2 
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          >
            What We <span className="text-teal-500">Do</span>
            <motion.svg 
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-2 inline-block text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </motion.svg>
          </motion.h2>
        </div>

        {/* Service Cards */}
        <div className="flex flex-col space-y-8">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const direction = isEven ? -100 : 100; // left for even, right for odd

            return (
              <motion.div
                key={service.id}
                className={`bg-slate-700 rounded-lg overflow-hidden shadow-lg ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex-row`}
                initial={{ opacity: 0, x: direction }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Image */}
                <div className="md:w-1/2">
                  <img
                    src={service.image}
                    alt={`${service.title.highlight1} ${service.title.highlight2}`}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-6 md:p-8 text-white">
                  <h3 className="text-3xl font-bold mb-4">
                    <span className="text-teal-400">{service.title.highlight1}</span> {service.title.normal} <span className="text-teal-400">{service.title.highlight2}</span> {service.title.ending}
                  </h3>
                  <p className="text-gray-200 text-2xl">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* awards */}
      <FadeInSection>
      <div className="w-full bg-cyan-50 py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl font-bold text-center mb-16">
            Our <span className="text-teal-500">Achievements</span>
          </h2>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award) => (
              <div 
                key={award.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Award Image */}
                <div className="p-4 bg-white">
                  <img 
                    src={award.image} 
                    alt={award.title}
                    className="w-full h-48 object-contain mx-auto"
                  />
                </div>
                
                {/* Award Title */}
                <div className="p-4 bg-cyan-50 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {award.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </FadeInSection>

    </div>
      {/* explore cta */}
      <FadeInSection>
      <div className="w-full relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src= {ctaaboutus} // Replace with your actual industrial background image
            alt="Industrial facility"
            className="w-full h-full object-cover"
          />
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-slate-800/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 py-24 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center">
          <div className="max-w-3xl mx-auto text-center text-white">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Build <span className="text-teal-400">Beyond</span> Ordinary
            </h2>
            
            {/* Subheading */}
            <p className="text-xl mb-12">
              At Rangani Engineering, we engineer legacies. Let's build yours!
            </p>
            
            {/* Email Form */}
            {/* <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="w-full md:w-auto md:flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email Address"
                    className="w-full p-3 text-gray-800 bg-transparent border-b-2 border-white focus:border-teal-400 outline-none transition-colors duration-300"
                    required
                  />
                </div>
              </div>
            </form> */}
            
            {/* Action Buttons */}
            <Link to="/contact">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-teal-500 text-white font-medium rounded hover:bg-teal-600 transition-colors duration-300">
                  Email Us
                </button>
                {/* <button className="px-8 py-3 bg-slate-800 text-white font-medium rounded hover:bg-slate-700 transition-colors duration-300">
                  Start Your Custom Project
                </button> */}
              </div>
            </Link>
          </div>
        </div>
      </div>
      </FadeInSection>
    </>
      
  );
};

export default AboutUs;
