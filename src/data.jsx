import React from 'react';

// icons
import {
   FaLinkedin,
   FaGithub,
   FaTwitter,
} from 'react-icons/fa'


// skills images
import skill1 from './assets/img/skills/html.png'
import skill2 from './assets/img/skills/css.png'
import skill3 from './assets/img/skills/bootstrap.png'
import skill4 from './assets/img/skills/javascript.png'
import skill5 from './assets/img/skills/jquery.png'
import skill6 from './assets/img/skills/react.png'
import skill7 from './assets/img/skills/tailwind.png'
import skill8 from './assets/img/skills/github.png'

// portfolio images
import xino from './assets/img/portfolio/xino.png'
import techno from './assets/img/portfolio/techno.png'
import grippable from './assets/img/portfolio/grippable.png'
import honeydrops from './assets/img/portfolio/honeydrops.png'
import greenolic from './assets/img/portfolio/greenolic.png'
import weddingPlanning from './assets/img/portfolio/wedding-planning.png'

// navigation
export const navigation = [
   {
      name: "home",
      href: "home",
   },
   {
      name: "about",
      href: "about",
   },
   {
      name: "skills",
      href: "skills",
   },
   {
      name: "portfolio",
      href: "portfolio",
   },
   {
      name: "contact",
      href: "contact",
   },
];

// social
export const social = [
   {
      icon: <FaLinkedin />,
      href: "https://www.linkedin.com/in/daksh15",
      target: "_blank",
   },
   {
      icon: <FaGithub />,
      href: "https://github.com/dakshn15",
      target: "_blank",
   },
   {
      icon: <FaTwitter />,
      href: "#!",
      target: "_self",
   },
];

// skills
export const skills = [
   {
      image: skill1,
      name: 'html'
   },
   {
      image: skill2,
      name: 'css'
   },
   {
      image: skill3,
      name: 'bootstrap'
   },
   {
      image: skill4,
      name: 'javascript'
   },
   {
      image: skill5,
      name: 'jquery'
   },
   {
      image: skill6,
      name: 'react'
   },
   {
      image: skill7,
      name: 'tailwind'
   },
   {
      image: skill8,
      name: 'github'
   },
]

// portfolio
export const projects = [
   {
      id: 1,
      title: "XinoTracker",
      category: "Dashboard",
      image: xino,
      description: "An employee attendance dashboard featuring staff metrics, gender distribution, top performers, birthdays, and working hours tracking.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "#!",
      codeLink: "#!"
   },
   {
      id: 2,
      title: "Techno",
      category: "Web Design",
      image: techno,
      description: "A sleek e-commerce theme for electronics with a dark UI and interactive product displays.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "#!",
      codeLink: "#!"
   },
   {
      id: 3,
      title: "Grippable",
      category: "Web Design",
      image: grippable,
      description: "A colorful e-commerce theme for phone accessories with bold visuals and a clean, modern layout.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "#!",
      codeLink: "#!"
   },
   {
      id: 4,
      title: "Honeydrops",
      category: "Web Design",
      image: honeydrops,
      description: "A sweet and elegant theme crafted for showcasing premium honey collections with a smooth shopping flow.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "#!",
      codeLink: "#!"
   },
   {
      id: 5,
      title: "Wedding Planning",
      category: "Web Design",
      image: weddingPlanning,
      description: "A romantic wedding planner template featuring elegant design, couple imagery, and essential services for creating dream ceremonies.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "#!",
      codeLink: "#!"
   },
   // {
   //    id: 6,
   //    title: "Greenolic",
   //    category: "Web Design",
   //    image: greenolic,
   //    description: "A vibrant organic grocery theme designed for health-focused stores with a fresh, natural vibe.",
   //    technologies: ["Html", "Css", "JavaScript"],
   //    demoLink: "#!",
   //    codeLink: "#!"
   // },
]

export const contact = [
   {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      title: "Email",
      value: "dakshnimavat15@gmail.com",
   },
   {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>,
      title: "Phone",
      value: "+91 8530189606",
   },
   {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
      title: "Address",
      value: "Surat, Gujarat, India",
   },
]
