import React, { useState, useEffect } from 'react';

const Footer = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="py-5">
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="text-center">
                    {/* Copyright */}
                    <p>
                        © {currentYear} Daksh Nimavat. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;