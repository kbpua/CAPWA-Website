import React, { useState, useEffect } from 'react';
import { PhilippinesMap } from '../components/map/PhilippinesMap';
import { IncidentDetailModal } from '../components/common/IncidentDetailModal';
import type { IncidentReport } from '../types';
import { reportService } from '../services/reportService';
import toast from 'react-hot-toast';

export const MapPage: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle scroll detection - hide when scrolling, show when stopped
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = Math.abs(currentScrollY - lastScrollY);
          
          if (scrollDelta > 5) {
            setIsScrolling(true);
            // Clear existing timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            // Show again after scrolling stops
            timeoutId = setTimeout(() => {
              setIsScrolling(false);
              timeoutId = null;
            }, 150);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Auto-hide banner after 3 seconds (faster on mobile)
  useEffect(() => {
    if (!isModalOpen && !isReportFormOpen && !isScrolling) {
      const timer = setTimeout(() => {
        // Hide completely on mobile, collapse on larger screens
        if (window.innerWidth < 640) {
          setIsBannerVisible(false);
        } else {
          setIsBannerCollapsed(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, isReportFormOpen, isScrolling]);

  // Reset banner when modals close
  useEffect(() => {
    if (!isModalOpen && !isReportFormOpen) {
      setIsBannerVisible(true);
    }
  }, [isModalOpen, isReportFormOpen]);

  const handleIncidentClick = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: IncidentReport['status']) => {
    try {
      await reportService.updateStatus(id, status);
      if (selectedIncident) {
        setSelectedIncident({ ...selectedIncident, status });
      }
      // Trigger map refresh to update markers
      setRefreshTrigger(prev => prev + 1);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateSeverity = async (id: string, severity: IncidentReport['severity']) => {
    try {
      await reportService.updateSeverity(id, severity);
      if (selectedIncident) {
        setSelectedIncident({ ...selectedIncident, severity });
      }
      // Trigger map refresh to update markers
      setRefreshTrigger(prev => prev + 1);
      toast.success('Severity updated successfully');
    } catch (error) {
      toast.error('Failed to update severity');
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] relative">
      {isBannerVisible && (
        <div className={`absolute top-16 sm:top-20 md:top-24 right-2 sm:right-3 md:right-4 z-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 border border-green-200 max-w-[120px] sm:max-w-none transition-all duration-300 ${
          isModalOpen || isReportFormOpen || isScrolling ? 'opacity-0 pointer-events-none translate-y-[-10px]' : 'opacity-100 translate-y-0'
        } ${isBannerCollapsed ? 'hover:max-w-[120px]' : ''}`}>
          {isBannerCollapsed ? (
            // Collapsed state - just show icon
            <button
              onClick={() => {
                setIsBannerCollapsed(false);
                setIsBannerVisible(true);
              }}
              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 hover:text-emerald-700"
              title="Show instructions"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <p className="text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 leading-tight">📍 Tap map to report</p>
              {/* Dismiss button */}
              <button
                onClick={() => setIsBannerVisible(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-0.5"
                title="Dismiss"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      <PhilippinesMap 
        onIncidentClick={handleIncidentClick} 
        refreshTrigger={refreshTrigger}
        isDetailModalOpen={isModalOpen}
        onReportFormStateChange={setIsReportFormOpen}
      />
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateSeverity={handleUpdateSeverity}
      />
    </div>
  );
};

