import React from 'react'
import photo from '../../src/assets/img/photo.jpeg'
import { Link } from 'react-scroll'

function Hero() {
  return (
    <section id='home' className='pt-24 md:pt-32 sm:pt-28 pb-10 lg:pb-20'>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          <div className="flex-1 text-center md:text-start">
            <div className="max-w-[500px] mx-auto md:mx-0">
              <h2 className='text-2xl sm:text-3xl lg:text-4xl mb-4'>I'm Daksh Nimavat frontend web developer.</h2>
              <p className='mb-5'>I am a frontend web developer i Build Fast, Modern, and Responsive Web Interfaces. </p>
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
          <div className="flex-1 hidden md:block">
            <div className="max-w-[80%] lg:max-w-[70%] w-full ms-auto">
              <div className="img-ratio pt-[100%] rounded-2xl overflow-hidden">
                <img src={photo} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero