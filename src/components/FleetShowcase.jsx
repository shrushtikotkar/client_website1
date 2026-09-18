import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function FleetShowcase() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/vehicles`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVehicles(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load fleet:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="fleet" className="py-16 bg-[#0b1021] text-white px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Our Fleet Showcase</h2>
        <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading vehicles from database...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {vehicles.map((car) => (
            <div
              key={car._id}
              className="bg-[#121a36] border border-gray-800 rounded-xl overflow-hidden hover:border-red-500 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <img
                src={car.image?.startsWith('/uploads') ? `${API_BASE}${car.image}` : car.image}
                alt={car.name}
                className="w-full h-52 object-cover rounded-t-xl"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{car.name}</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-red-600/20 text-red-400 rounded">
                      {car.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{car.description}</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-4 bg-[#090d1b] p-3 rounded-lg">
                    <span>💺 {car.seats} Seats</span>
                    <span>🧳 {car.luggage} Bags</span>
                    {car.pricePerKm && (
                      <span className="text-green-400 font-bold">₹{car.pricePerKm}/km</span>
                    )}
                  </div>
                  <a
                    href="#booking"
                    className="block text-center w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}