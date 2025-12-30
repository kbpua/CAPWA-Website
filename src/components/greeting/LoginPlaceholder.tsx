import React, { useState } from 'react';
import { Button } from '../common/Button';

export const LoginPlaceholder: React.FC = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  
  const handleLoginClick = () => {
    setShowPlaceholder(true);
    // In a real app, this would redirect to login page or open login modal
    setTimeout(() => setShowPlaceholder(false), 3000);
  };
  
  return (
    <div className="mt-6">
      {showPlaceholder ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            🔐 Login functionality will be implemented in a future update
          </p>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleLoginClick}
          className="w-full md:w-auto"
        >
          Admin Login
        </Button>
      )}
    </div>
  );
};

