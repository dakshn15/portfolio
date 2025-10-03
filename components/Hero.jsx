import React from 'react'
import { Link } from 'react-scroll'

function Hero() {
  return (
    <section id='home' className='lg:min-h-screen flex items-center pt-24 md:pt-32 sm:pt-28 pb-10 lg:pb-20 relative overflow-hidden'>
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-400/8 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-2xl mx-auto">
            {/* Enhanced Typography Section */}
            <div className="relative">
              <span className="inline-block font-medium text-gray-300 mb-4 lg:text-lg tracking-wide">Frontend Developer</span>
              
              <h2 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
                I'm <span className="text-purple-500 relative">
                  Daksh Nimavat
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </span>
              </h2>
              
              <p className='md:text-lg lg:text-xl lg:mb-8 mb-5 text-gray-300 lg:max-w-3xl max-w-md mx-auto leading-relaxed'>
                I am a frontend web developer who builds <span className="text-purple-400 font-semibold">Fast</span>, <span className="text-blue-400 font-semibold">Modern</span>, and <span className="text-green-400 font-semibold">Responsive</span> Web Interfaces.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:mb-12 mb-8">
              <Link
                to="contact"
                spy={true}
                offset={-40}
                className='btn cursor-pointer'
              >
                Contact Me
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
          {/* Skills Highlight Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-purple-400 mb-1">Fast</h3>
                <p className="text-sm text-gray-400">Optimized Performance</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold text-blue-400 mb-1">Modern</h3>
                <p className="text-sm text-gray-400">Latest Technologies</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-green-500/50 transition-all duration-300">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-green-400 mb-1">Responsive</h3>
                <p className="text-sm text-gray-400">All Device Friendly</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-300">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-yellow-400 mb-1">Interactive</h3>
                <p className="text-sm text-gray-400">Engaging Experiences</p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="lg:mt-16 mt-10 flex justify-center">
              <div className="animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Floating Code Elements */}
      <div className="absolute top-1/4 left-10 text-purple-400/20 text-6xl font-mono hidden lg:block animate-pulse">
        {'</>'}
      </div>
      <div className="absolute bottom-1/4 right-10 text-blue-400/20 text-4xl font-mono hidden lg:block animate-pulse delay-1000">
        {'{}'}
      </div>
      <div className="absolute top-1/3 right-1/4 text-green-400/20 text-3xl font-mono hidden lg:block animate-pulse delay-500">
        {'()'}
      </div>
    </section>
  )
}

export default Hero