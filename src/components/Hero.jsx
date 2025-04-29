import React from 'react'
import photo from '../../src/assets/img/photo.jpeg'
import { Link } from 'react-scroll'

function Hero() {
  return (
    <section id='home' className='min-h-screen flex items-center pt-24 md:pt-32 sm:pt-28 pb-10 lg:pb-20'>
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-start order-2 md:order-1">
            <div className="max-w-[500px] mx-auto md:mx-0">
            <span className="inline-block font-medium text-gray-300 mb-2">Frontend Developer</span>
              <h2 className='text-[26px] sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4'>I'm <span className="text-purple-600">Daksh Nimavat</span></h2>
              <p className='lg:mb-8 mb-5'>I am a frontend web developer i Build Fast, Modern, and Responsive Web Interfaces. </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link
                  to="contact"
                  spy={true}
                  offset={-40}
                  className='btn cursor-pointer'
                >
                  contact me
                </Link>
                <Link
                  to="portfolio"
                  spy={true}
                  offset={-40}
                  className='btn btn-transparent cursor-pointer'
                >
                  View Work
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="relative mx-auto md:ml-auto md:mr-0 max-w-[350px] lg:max-w-[450px]">
              <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-3xl opacity-20 -z-10 transform rotate-6"></div>
              <div className="img-ratio pt-[100%] rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-600/20">
                <img src={photo} alt="Daksh Nimavat" className='transform transition-all hover:scale-105 duration-300' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero