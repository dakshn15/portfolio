import React from 'react'
import { social } from '../../data'

function Socials() {
  return (
    <ul className='flex gap-4 md:text-xl text-lg'>
        {social.map((item, index) => (
            <li key={index}>
                <a href={item.href} className='text-gray-200 hover:text-purple-500 transition-all duration-300' target={item.target}>
                    {item.icon}
                </a>
            </li>
        ))}
    </ul>
  )
}

export default Socials