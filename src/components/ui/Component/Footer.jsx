import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { HiHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 mt-auto ">
      <div className="container mx-auto flex flex-col items-center px-4">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-lg sm:text-xl">
            Crafted with <HiHeart className="inline text-red-500" /> by HarshShukla
          </span>
        </motion.div>

        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <a
            href="https://x.com/__harshshukla"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-110"
          >
            <FaTwitter className="text-blue-400 hover:text-blue-600 transition-colors duration-300" size={24} />
          </a>
          <a
            href="https://github.com/harshshukla9/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-110"
          >
            <FaGithub className="text-gray-400 hover:text-gray-600 transition-colors duration-300" size={24} />
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
