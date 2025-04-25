import React from 'react'
import aboutImage from '../assets/img/about.png'
import { Link } from 'react-scroll'

function About() {

    return (
        <section id='about' className='py-10 lg:py-20 bg-dark'>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex md:flex-row flex-col-reverse items-center gap-5 lg:gap-14">
                    {/* <div className="flex-1"> */}
                    <div className="max-w-[400px] md:max-w-[40%] w-full md:me-auto mx-auto">
                        <div className="img-ratio rounded-2xl overflow-hidden pt-[85%]">
                            <img src={aboutImage} alt="" />
                        </div>
                    </div>
                    {/* </div> */}
                    <div className="flex-1 text-center md:text-start">
                        <h2 className='text-2xl sm:text-3xl lg:text-4xl mb-4'>About Me</h2>
                        <p>I'm a passionate frontend developer focused on creating elegant, responsive web experiences. Specializing in React.js, I transform designs into intuitive interfaces that users love. My toolkit includes modern JavaScript, CSS, and responsive design principles. I pride myself on writing clean, maintainable code that performs well across all devices.</p>
                        <p>When I'm not coding, I'm exploring emerging web technologies and design trends to stay at the cutting edge of frontend development.</p>
                        <p>Let's build something amazing together.</p>
                        <Link
                            to="contact"
                            spy={true}
                            offset={-40}
                            className='btn mt-4 cursor-pointer'
                        >
                            contact me
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About