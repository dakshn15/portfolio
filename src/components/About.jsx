import React from 'react'
import aboutImage from '../assets/img/about.png'
import { Link } from 'react-scroll'
import { FaLaptopCode, FaBookOpen } from 'react-icons/fa';

function About() {

    return (
        <section id='about' className='py-10 lg:py-20 bg-dark'>
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="flex md:flex-row flex-col-reverse items-center gap-6 lg:gap-14">
                    <div className="max-w-[400px] md:max-w-[40%] w-full md:me-auto mx-auto">
                        <div className="img-ratio rounded-2xl overflow-hidden pt-[85%]">
                            <img src={aboutImage} alt="Developer portrait" className='transform transition-all hover:scale-105 duration-300' />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-start md:space-y-6 space-y-5">
                        <h2 className='text-[26px] sm:text-3xl lg:text-4xl'>About <span className='text-purple-600'>Me</span></h2>
                        <div>
                            <div className="flex items-start md:justify-start justify-center gap-4 mb-3">
                                <FaLaptopCode className="text-purple-600 md:text-xl text-base mt-0.5 flex-shrink-0" />
                                <h3 className="md:text-xl text-base">Frontend Developer</h3>
                            </div>
                            <p className="md:ps-8.5">
                                I'm a passionate frontend developer focused on creating elegant, responsive web experiences.
                                Specializing in React.js, I transform designs into intuitive interfaces that users love.
                                My toolkit includes modern JavaScript, CSS, and responsive design principles.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-start md:justify-start justify-center gap-4 mb-3">
                                <FaBookOpen className="text-purple-600 md:text-xl text-base mt-0.5 flex-shrink-0" />
                                <h3 className="md:text-xl text-base">Always Learning</h3>
                            </div>
                            <p className="md:ps-8.5">
                                When I'm not coding, I'm exploring emerging web technologies and design trends
                                to stay at the cutting edge of frontend development.
                            </p>
                        </div>
                        <div>
                            <p className="md:text-lg text-base font-medium text-purple-400">Let's build something amazing together.</p>
                            <Link
                                to="contact"
                                spy={true}
                                offset={-40}
                                className='btn md:mt-6 mt-4 cursor-pointer'
                            >
                                Contact Me
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About