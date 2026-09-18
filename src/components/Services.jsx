import React from 'react';

const servicesList = [
  { id: 1, title: 'Corporate Car Rental Services' },
  { id: 2, title: 'Corporate Taxi Service' },
  { id: 3, title: 'Corporate Vehicle Rental' },
  { id: 4, title: 'Day Trips & Outings' },
  { id: 5, title: 'Driver Services' },
  { id: 6, title: 'Hotel Booking Service' },
  { id: 7, title: 'Local Cab Service' },
  { id: 8, title: 'Long Term Car Rental' },
  { id: 9, title: 'Mini Bus Rentals' },
  { id: 10, title: 'One Way Cabs' },
  { id: 11, title: 'Outstation Trips' },
  { id: 12, title: 'Taxi Rental Service' },
  { id: 13, title: 'Tempo Travelers (17/26 Seater)' },
  { id: 14, title: 'Tour Packages across India' },
  { id: 15, title: 'Trips And Travels' },
  { id: 16, title: 'Vehicle Rental For Weddings' },
  { id: 17, title: 'Weekend Getaways Travel' }
];

export default function Services({ onSelectService }) {
  const handleServiceClick = (serviceTitle) => {
    // 1. Pass selected service up to form state (if passed)
    if (onSelectService) {
      onSelectService(serviceTitle);
    }

    // 2. Smooth-scroll down to Quick Booking section
    const bookingSection = document.getElementById('quick-booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-16 bg-[#070b19] text-white px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight mb-3">
          Services We Offer
        </h2>
        <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {servicesList.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service.title)}
            className="group flex items-center justify-between p-5 bg-[#0e162d] border border-gray-800 rounded-xl cursor-pointer hover:border-red-500 hover:bg-[#141f3d] transition-all duration-300 shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-red-600 rounded-full group-hover:scale-110 transition-transform">
                {service.id}
              </span>
              <h3 className="text-base font-semibold text-gray-200 group-hover:text-white">
                {service.title}
              </h3>
            </div>
            <span className="text-gray-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}