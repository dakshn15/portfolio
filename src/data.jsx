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
import techzonix from './assets/img/portfolio/techzonix.png'
import xino from './assets/img/portfolio/xino.png'
import petcare from './assets/img/portfolio/petcare.png'
import artify from './assets/img/portfolio/art-gallery.png'
import weddingPlanning from './assets/img/portfolio/wedding-planning.png'
import rezumely from './assets/img/portfolio/rezumely.png'

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
      image: skill6,
      name: 'react'
   },
   {
      image: skill7,
      name: 'tailwind'
   },
   {
      image: skill4,
      name: 'javascript'
   },
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
      image: skill5,
      name: 'jquery'
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
      title: "Rezumely",
      category: "React",
      image: rezumely,
      description: "Create professional resumes, showcase projects and skills, download instantly, and connect through contact links.",
      technologies: ["React", "Tailwind", "TypeScript"],
      demoLink: "https://rezumely.vercel.app/",
      codeLink: "https://github.com/dakshn15/rezumely"
   },
   {
      id: 2,
      title: "Techzonix",
      category: "React",
      image: techzonix,
      description: "Techzonix is a React-based web project designed to showcase modern tech solutions and creative web designs.",
      technologies: ["React", "Tailwind", "JavaScript"],
      demoLink: "https://techzonix.vercel.app/",
      codeLink: "https://github.com/dakshn15/techzonix"
   },
   {
      id: 3,
      title: "XinoTracker",
      category: "Dashboard",
      image: xino,
      description: "An employee attendance dashboard featuring staff metrics, gender distribution, top performers, birthdays, and working hours tracking.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "https://xinotracker.vercel.app/",
      codeLink: "https://github.com/dakshn15/xinotracker"
   },
   {
      id: 4,
      title: "Petcare",
      category: "Web Design",
      image: petcare,
      description: "A pet care website that provides information about pet care, pet grooming, pet training, and pet adoption.",
      technologies: ["Html", "Tailwind", "JavaScript"],
      demoLink: "https://petcarely.vercel.app/",
      codeLink: "https://github.com/dakshn15/petcare"
   },
   {
      id: 5,
      title: "Artify",
      category: "Web Design",
      image: artify,
      description: "A website for a art gallery that provides information about the art gallery, the art pieces, the exhibitions and the artists.",
      technologies: ["Html", "Tailwind", "JavaScript"],
      demoLink: "https://get-artify.vercel.app/",
      codeLink: "https://github.com/dakshn15/art-gallery"
   },
   {
      id: 6,
      title: "Wedding Planning",
      category: "Web Design",
      image: weddingPlanning,
      description: "A romantic wedding planner template featuring elegant design, couple imagery, and essential services for creating dream ceremonies.",
      technologies: ["Html", "Css", "JavaScript"],
      demoLink: "https://wedding-zon.vercel.app/",
      codeLink: "https://github.com/dakshn15/wedding-zon"
   },
]

export const contact = [
   {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="md:h-6 md:w-6 h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      title: "Email",
      value: "dakshnimavat15@gmail.com", 
   },
   {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="md:h-6 md:w-6 h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>,
      title: "Phone",
      value: "+91 8530189606",
   },
   {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="md:h-6 md:w-6 h-5 w-5  text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
      title: "Address",
      value: "Surat, Gujarat, India",
   },
]
