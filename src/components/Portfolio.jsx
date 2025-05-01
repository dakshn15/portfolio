import React, { useState } from 'react'
import { projects } from '../data';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Grid, Pagination, Navigation, Autoplay } from 'swiper/modules';

function Portfolio() {

    const [filter, setFilter] = useState("All");
    const categories = ["All", ...new Set(projects.map(project => project.category))];

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(project => project.category === filter);

    return (
        <section id='portfolio' className='py-10 lg:py-20 bg-dark'>
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="text-center mb-8">
                    <h2 className="text-[26px] sm:text-3xl lg:text-4xl mb-4">My <span className='text-purple-500'>Projects</span></h2>
                    <p className="mb-4 max-w-2xl mx-auto">Check out some of my recent work, i specialize in creating visually stunning, responsive websites and projects.</p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-4 py-2 text-sm rounded-full font-medium ${filter === category
                                    ? "bg-purple-500 text-white border-2 border-purple-500"
                                    : "bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-purple-500 hover:text-purple-500 transition-all duration-300"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    breakpoints={{
                        992: {
                            slidesPerView: 3,
                        },
                        576: {
                            slidesPerView: 2,
                        }
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    autoHeight={false}
                    className="project-swiper !pb-8"
                >
                    {filteredProjects.map((project) => (
                        <SwiperSlide key={project.id}>
                            <div className="h-full flex flex-col  bg-gray-800 rounded-xl overflow-hidden shadow-lg border-t-3 border-purple-500 transition-all duration-300">
                                <div className="img-ratio pt-[60%] overflow-hidden">
                                    <img className='object-top hover:scale-105 transition-all duration-300'
                                        src={project.image}
                                        alt={project.title}
                                    />
                                </div>
                                <div className="md:px-5 py-5 px-4 flex-1 flex flex-col h-100">
                                    <div className="flex-1">
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-900 mb-3">
                                            {project.category}
                                        </span>
                                        <h3 className="md:text-xl text-lg mb-3"> {project.title} </h3>
                                        <p className='text-sm mb-4'> {project.description} </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.technologies.map((tech, index) => (
                                                <span key={index} className='bg-gray-700 text-xs px-3 py-1 rounded-full text-gray-300'> {tech} </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-between gap-3">
                                        <a href={project.demoLink} target='_blank' className='flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-all duration-300 text-sm font-medium'>
                                            <span>Live Demo</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <a href={project.codeLink} target='_blank' className='flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-all duration-300 text-sm font-medium'>
                                            <span>View Code</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default Portfolio