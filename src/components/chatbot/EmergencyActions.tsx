import React from 'react';
import type { EmergencyProtocol } from '../../types';

interface EmergencyActionsProps {
  protocol: EmergencyProtocol;
  onClose: () => void;
}

export const EmergencyActions: React.FC<EmergencyActionsProps> = ({ protocol, onClose }) => {
  const handleCall = (phone: string) => {
    // Simulate calling - in a real app, this would use tel: protocol
    alert(`Calling ${phone}\n\nIn a real application, this would initiate a phone call.`);
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-red-900">{protocol.title}</h3>
          <p className="text-sm text-red-700 mt-1">{protocol.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {protocol.steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <span className="font-semibold text-red-900 mr-2">{index + 1}.</span>
            <p className="text-sm text-red-800">{step}</p>
          </div>
        ))}
      </div>

      {protocol.contacts && protocol.contacts.length > 0 && (
        <div className="border-t border-red-200 pt-3">
          <p className="text-sm font-semibold text-red-900 mb-2">Emergency Contacts:</p>
          <div className="flex flex-wrap gap-2">
            {protocol.contacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleCall(contact)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Call {contact}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

