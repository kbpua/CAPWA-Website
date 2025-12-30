import React, { useState } from 'react';
import { Button } from '../common/Button';

interface SymptomCheckerProps {
  onSubmit: (symptoms: string[]) => void;
}

const COMMON_SYMPTOMS = [
  'Vomiting',
  'Diarrhea',
  'Lethargy',
  'Loss of appetite',
  'Difficulty breathing',
  'Bleeding',
  'Limping',
  'Excessive panting',
  'Seizures',
  'Unconsciousness',
];

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length > 0) {
      onSubmit(selectedSymptoms);
      setSelectedSymptoms([]);
    }
  };

  const getSeverity = (): 'critical' | 'high' | 'medium' | 'low' => {
    const criticalSymptoms = ['Unconsciousness', 'Seizures', 'Bleeding', 'Difficulty breathing'];
    const highSymptoms = ['Vomiting', 'Diarrhea', 'Limping'];

    if (selectedSymptoms.some(s => criticalSymptoms.includes(s))) {
      return 'critical';
    }
    if (selectedSymptoms.some(s => highSymptoms.includes(s))) {
      return 'high';
    }
    if (selectedSymptoms.length >= 3) {
      return 'medium';
    }
    return 'low';
  };

  const severity = getSeverity();
  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-amber-100 text-amber-800 border-amber-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Symptom Checker</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select all symptoms you're observing:
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {COMMON_SYMPTOMS.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              selectedSymptoms.includes(symptom)
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {symptom}
          </button>
        ))}
      </div>

      {selectedSymptoms.length > 0 && (
        <div className={`mb-4 p-3 rounded-md border ${severityColors[severity]}`}>
          <p className="font-semibold mb-1">Assessed Severity: {severity.toUpperCase()}</p>
          <p className="text-sm">
            {severity === 'critical' && 'Immediate veterinary attention required!'}
            {severity === 'high' && 'Urgent care recommended within 24 hours.'}
            {severity === 'medium' && 'Schedule a veterinary visit soon.'}
            {severity === 'low' && 'Monitor closely, but not immediately urgent.'}
          </p>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={selectedSymptoms.length === 0}
        className="w-full"
      >
        Submit Symptoms
      </Button>
    </div>
  );
};

