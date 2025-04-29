import React from 'react'
import { skills } from '../data'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Grid, Pagination, Navigation, Autoplay } from 'swiper/modules';

function Skills() {
    return (
        <section id='skills' className='py-10 lg:py-20'>
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="text-center md:mb-8 mb-6">
                    <h2 className="text-[26px] sm:text-3xl lg:text-4xl mb-4">
                        My <span className="text-purple-600">Skills</span>
                    </h2>
                    <p className="max-w-2xl mx-auto">
                        These are the technologies and tools I specialize in to create modern,
                        responsive, and interactive web applications.
                    </p>
                </div>
                <div>
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={20}
                        loop={true}
                        breakpoints={{
                            1200: {
                                slidesPerView: 8,
                            },
                            992: {
                                slidesPerView: 7,
                            },
                            768: {
                                slidesPerView: 5,
                            },
                            576: {
                                slidesPerView: 4,
                            },
                            420: {
                                slidesPerView: 3,
                            }
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Pagination, Navigation, Autoplay]}
                        className="skills-swiper xl:!pb-0 !pb-8"

                    >
                        {skills.map((skill, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col items-center justify-center p-4 rounded-xl
                          transition-all duration-300
                          bg-slate-800/50 hover:bg-slate-800 cursor-pointer
                          border border-slate-700 hover:border-purple-600 shadow-lg
                          hover:shadow-purple-900/20">
                                    <div className="mb-3 p-4 bg-slate-900/60 rounded-full overflow-hidden">
                                        <img src={skill.image} alt={`${skill.name} icon`} className="max-w-[35px] w-full object-contain" />
                                    </div>
                                    <h5 className="text-sm text-center tracking-wider">{skill.name}</h5>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default Skills