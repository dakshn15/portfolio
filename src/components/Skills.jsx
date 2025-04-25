import React from 'react'
import { skills } from '../data'

function Skills() {
    return (
        <section id='skills' className='py-10 lg:py-20'>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid xl:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex flex-col items-center justify-center">
                            <img src={skill.image} alt="skill-image" className='lg:max-w-[100px] sm:max-w-[60px] max-w-[40px] w-full' />
                            <h5 className='uppercase! mt-4'> {skill.name} </h5>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills