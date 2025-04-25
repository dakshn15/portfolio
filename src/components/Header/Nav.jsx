import React, { useState, useEffect } from 'react';
import { navigation } from '../../data'
import { Link } from 'react-scroll'

function Nav() {

   const [activeSection, setActiveSection] = useState('home');

   return (
      <ul className="flex items-center lg:space-x-8 space-x-6 font-medium">
         {navigation.map((item, index) => (
            <li key={index}>
               <Link
                  to={item.href}
                  spy={true}
                  offset={-40}
                  onSetActive={() => setActiveSection(item.href)}
                  className={`text-gray-200 hover:text-purple-600 transition-all duration-300 capitalize cursor-pointer ${
                     activeSection === item.href ? 'text-purple-600' : ''
                   }`}
               >
                  {item.name}
               </Link>
            </li>
         ))}
      </ul>
   )
}

export default Nav