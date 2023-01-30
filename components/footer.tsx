import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <p className="text-sm">The Good Kid &copy; {new Date().getFullYear()}</p>
          <div className="flex">
            <a href="#" className="text-sm px-2">Privacy Policy</a>
            <a href="#" className="text-sm px-2">Terms of Service</a>
            <a href="#" className="text-sm px-2">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
