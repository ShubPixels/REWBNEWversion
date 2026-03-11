import React from 'react';
import { motion } from 'framer-motion';
import koh from "../images/kohler.png";
import herocorp from "../images/Hero MotoCorp logo.jpeg";
import ada from "../images/adani.png";
import ambuja from "../images/ambuja-logo-png_seeklogo-434902.png";
import orient from "../images/orient.png";
import toyota from "../images/toyota.png";
import tata from "../images/tata.png";
import pepsi from "../images/pepsi.png";
import mahindra from "../images/mahindra.png";
import essar from "../images/essar.png";
import bajaj from "../images/bajaj.png";
import laval from "../images/laval.png";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.1, duration: 0.6, ease: 'easeOut' }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const partnerLogos = [
  toyota, tata, pepsi, mahindra, essar,
  bajaj, laval, koh, herocorp, ada,
  ambuja, orient
];

const ScrollingLogoBanner = () => {
  return (
    <motion.section
      className="bg-cyan-50 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <motion.div
        className="scrolling-banner-container"
        variants={itemVariants}
      >
        <div className="scrolling-banner flex items-center space-x-8">
          {partnerLogos.concat(partnerLogos).map((logo, idx) => (
            <motion.img
              key={idx}
              src={logo}
              alt={`Partner logo ${idx + 1}`}
              className="h-12 w-auto"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ScrollingLogoBanner;
