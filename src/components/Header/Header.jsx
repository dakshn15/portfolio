import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Socials from "./Socials";
import { Link } from "react-scroll";
import { navigation } from "../../data";

export default function Header() {
  const [headerBg, setHeaderBg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    window.addEventListener('scroll', () => {
      return window.scrollY > 50 ? setHeaderBg(true) : setHeaderBg(false);
    })
  });
  

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={`${headerBg ? '' : '!bg-transparent !shadow-none py-6'} fixed z-4 w-full py-3 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4">

        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="home" className="cursor-pointer">
            <span className="text-purple-500">D</span>
            <span className="text-gray-200">aksh</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden md:block">
          <Nav />
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          <Socials />
          <button
            onClick={toggleMenu}
            className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" height={18} width={18} viewBox="0 0 13 10" fill="none">
              <path d="M12.4261 1.32038H5.1361C4.86174 1.32038 4.63906 1.0977 4.63906 0.823336C4.63906 0.548969 4.86174 0.326294 5.1361 0.326294H12.4261C12.7004 0.326294 12.9231 0.548969 12.9231 0.823336C12.9231 1.0977 12.7004 1.32038 12.4261 1.32038ZM12.9231 4.79967C12.9231 4.52531 12.7004 4.30263 12.4261 4.30263H0.497042C0.222675 4.30263 0 4.52531 0 4.79967C0 5.07404 0.222675 5.29672 0.497042 5.29672H12.4261C12.7004 5.29672 12.9231 5.07404 12.9231 4.79967ZM8.28404 8.77601C8.28404 8.50164 8.06136 8.27897 7.78699 8.27897H0.497042C0.222675 8.27897 0 8.50164 0 8.77601C0 9.05038 0.222675 9.27305 0.497042 9.27305H7.78699C8.06136 9.27305 8.28404 9.05038 8.28404 8.77601Z" fill="white"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-20 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleMenu}
      ></div>
      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900/95 shadow-xl z-30 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Menu Header */}
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-purple-500/20 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col items-center">
            {navigation.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                spy={true}
                offset={-40}
                onSetActive={() => setActiveSection(item.href)}
                className={`text-gray-200 capitalize hover:text-purple-500 py-3 px-6 text-base w-full text-center border-b border-gray-800 transition-all duration-300 ${activeSection === item.href ? 'text-purple-500 border-purple-500 bg-purple-500/10' : ''
                  }`}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
