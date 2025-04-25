import React, { useState, useRef } from 'react';
import { contact } from '../data';
import emailjs from '@emailjs/browser';

const ContactSection = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);


    const serviceId = 'service_tsmiwiu';
    const templateId = 'template_718vlpi';
    const publicKey = 'MDfzRBGHjb0mBShG3';

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setIsSubmitting(false);
        setSubmitStatus('success');

        // Reset form after success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });

        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error.text);
        setIsSubmitting(false);
        setSubmitStatus('error');
        
        // Clear error message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      });
  };

  return (
    <section id="contact" className="py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center lg:mb-16 md:mb-8 mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl lg:mb-6 mb-4">Get In Touch</h2>
          <p className="max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? I'd love to hear from you.
            Fill out the form below or reach out through my social channels.
          </p>
        </div>

        <div className="flex md:flex-row flex-col lg:gap-12 gap-6">
          {/* Contact Info */}
          <div className="lg:space-y-8 space-y-6 md:max-w-[40%] w-full">
            <div>
              <h3 className="md:text-2xl sm:text-xl text-lg font-bold mb-4">Contact Information</h3>
              <p>
                Ready to start your next project? Contact me directly or fill out the form and I will get back to you promptly.
              </p>
            </div>

            <div className="space-y-5">
              {contact.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="bg-purple-600 p-3 rounded-lg text-gray-200">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-1">{item.title}</h4>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-lg md:p-6 py-5 px-4 shadow-lg md:max-w-[80%] w-full">
            <h3 className="md:text-2xl text-lg md:mb-6 mb-4">Send Me a Message</h3>
            <form ref={form} onSubmit={handleSubmit}>
              <div className="flex lg:flex-row flex-col gap-5 mb-5">
                <div className='flex-1'>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    className="form-control"
                    required
                  />
                </div>

                <div className='flex-1'>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className='mb-5'>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Enter Your Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className='mb-5'>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  placeholder="Enter Your Message" 
                  rows={4} 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="form-control"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="bg-green-800 text-green-100 px-4 lg:px-5 py-2 rounded-md text-center mt-5">
                  Your message has been sent successfully!
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-800 text-red-100 px-4 lg:px-5 py-2 rounded-md text-center mt-5">
                  Failed to send message. Please try again later.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;