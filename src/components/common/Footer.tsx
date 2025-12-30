import React from 'react';
import { Link } from 'react-router-dom';
import { getEmergencyContacts } from '../../utils/emergencyContacts';

export const Footer: React.FC = () => {
  const emergencyContacts = getEmergencyContacts().slice(0, 3);

  return (
    <footer className="bg-gradient-to-r from-green-700 to-emerald-700 text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/Logo.png" 
                alt="CAPWA Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h3 className="text-xl font-bold">CAPWA</h3>
            </div>
            <p className="text-green-100 leading-relaxed">
              Community Animals Partners & Welfare Advocates. 
              Reporting and managing animal welfare incidents across the Philippines.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-3 text-green-100">
              {emergencyContacts.map((contact) => (
                <li key={contact.id} className="flex items-start">
                  <span className="mr-2">📞</span>
                  <div>
                    <strong className="text-white block">{contact.name}</strong>
                    <a href={`tel:${contact.phone}`} className="hover:text-yellow-300 transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-sm text-green-200 mt-4">
              For emergencies, call <strong className="text-yellow-300">117 or 911</strong>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-green-100">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition-colors flex items-center">
                  <span className="mr-2">🏠</span> Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-yellow-300 transition-colors flex items-center">
                  <span className="mr-2">📍</span> Report Incident
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-yellow-300 transition-colors flex items-center">
                  <span className="mr-2">🔐</span> Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-600 pt-6 text-center">
          <p className="text-green-200">
            &copy; {new Date().getFullYear()} CAPWA - Community Animals Partners & Welfare Advocates. All rights reserved.
          </p>
          <p className="text-sm text-green-300 mt-2">
            Made with 💚 for animals in the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
};
