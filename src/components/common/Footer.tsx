import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { getEmergencyContacts } from '../../utils/emergencyContacts';
import { useAuth } from '../auth/AuthContext';

export const Footer: React.FC = () => {
  const emergencyContacts = getEmergencyContacts().slice(0, 3);
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gradient-to-r from-green-700 to-emerald-700 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/Logo.png" 
                alt="CAPWA Logo" 
                className="w-10 h-10 object-contain transition-transform duration-200 hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h3 className="text-xl font-bold">CAPWA</h3>
            </div>
            <p className="text-green-100 leading-relaxed text-sm md:text-base">
              Community Animals Partners & Welfare Advocates. 
              Reporting and managing animal welfare incidents across the Philippines.
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-3 text-green-100">
              {emergencyContacts.map((contact) => (
                <li key={contact.id} className="flex items-start">
                  <span className="mr-2 text-lg">📞</span>
                  <div>
                    <strong className="text-white block text-sm md:text-base">{contact.name}</strong>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="hover:text-yellow-300 transition-colors text-sm md:text-base block mt-1"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs md:text-sm text-green-200 mt-4">
              For emergencies, call <strong className="text-yellow-300">117 or 911</strong>
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-green-100">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition-all duration-200 flex items-center group">
                  <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🏠</span> 
                  <span className="text-sm md:text-base">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-yellow-300 transition-all duration-200 flex items-center group">
                  <span className="mr-2 text-lg group-hover:scale-110 transition-transform">📍</span> 
                  <span className="text-sm md:text-base">Report Incident</span>
                </Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link to="/login" className="hover:text-yellow-300 transition-all duration-200 flex items-center group">
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🔐</span> 
                    <span className="text-sm md:text-base">Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Social Media Section */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2.5 md:space-y-3">
              <a
                href="https://facebook.com/CAPWAUP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 md:space-x-3 text-green-100 hover:text-yellow-300 transition-all duration-200 group p-1 rounded-lg hover:bg-white/5"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm lg:text-base truncate">facebook.com/CAPWAUP</span>
              </a>
              
              <a
                href="https://twitter.com/capwa_up"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 md:space-x-3 text-green-100 hover:text-yellow-300 transition-all duration-200 group p-1 rounded-lg hover:bg-white/5"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
                  <Twitter className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm lg:text-base truncate">twitter.com/capwa_up</span>
              </a>
              
              <a
                href="https://linkedin.com/company/capwaup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 md:space-x-3 text-green-100 hover:text-yellow-300 transition-all duration-200 group p-1 rounded-lg hover:bg-white/5"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm lg:text-base truncate">linkedin.com/company/capwaup</span>
              </a>
              
              <a
                href="https://instagram.com/capwa_up"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 md:space-x-3 text-green-100 hover:text-yellow-300 transition-all duration-200 group p-1 rounded-lg hover:bg-white/5"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
                  <Instagram className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm lg:text-base truncate">instagram.com/capwa_up</span>
              </a>
              
              <a
                href="mailto:capwa.up@gmail.com"
                className="flex items-center space-x-2 md:space-x-3 text-green-100 hover:text-yellow-300 transition-all duration-200 group p-1 rounded-lg hover:bg-white/5"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md flex-shrink-0">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm lg:text-base break-all">capwa.up@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-green-600 pt-4 md:pt-6 text-center">
          <p className="text-green-200 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} CAPWA - Community Animals Partners & Welfare Advocates. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-green-300 mt-2">
            Made with 💚 for animals in the Philippines
          </p>
        </div>
      </div>
    </footer>
  );
};
