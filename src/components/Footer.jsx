import React, { useState, useEffect } from 'react';
import { social, navigation } from '../data';
import { Link } from 'react-scroll'

const Footer = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="py-5">
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    {/* Copyright */}
                    <p>
                        © {currentYear} Daksh Nimavat. All rights reserved.
                    </p>

                    {/* Navigation links */}
                    <ul className="flex items-center flex-wrap justify-center sm:gap-4 gap-3">
                        {navigation.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.href}
                                    activeClass="text-purple-500"
                                    spy={true}
                                    offset={-40}
                                    onSetActive={() => setActiveSection(item.href)}
                                    className={`hover:text-purple-500 transition-all duration-300 capitalize cursor-pointer ${activeSection === item.href ? 'text-purple-500' : ''
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Social Icons */}
                    <ul className='flex gap-4 md:text-xl text-lg'>
                        {social.map((item, index) => (
                            <li key={index}>
                                <a href={item.href} className='hover:text-purple-500 transition-all duration-300'>{item.icon}</a>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;