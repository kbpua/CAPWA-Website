import type { ChatMessage, EmergencyProtocol } from '../types';

const STORAGE_KEY_CHAT = 'animal_welfare_chat_history';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Emergency protocols for Philippines
const EMERGENCY_PROTOCOLS: Record<string, EmergencyProtocol> = {
  'hit-and-run': {
    id: 'hit-and-run',
    title: 'Animal Hit by Vehicle',
    description: 'Immediate action steps for an animal hit by a vehicle in the Philippines',
    steps: [
      '1. Ensure your own safety - move to a safe location',
      '2. Do not approach if the animal is aggressive or scared',
      '3. Call PAWS Philippines at (02) 475-1688 or nearest animal rescue',
      '4. Call Philippine National Police at 117 if on a busy road',
      '5. Take photos for documentation (if safe)',
      '6. Stay with the animal if possible until help arrives',
      '7. If you can safely move the animal, place it in a box or blanket',
      '8. Transport to nearest veterinary clinic if rescue is delayed',
    ],
    contacts: ['(02) 475-1688', '117', '(02) 532-3340'],
  },
  'poisoning': {
    id: 'poisoning',
    title: 'Animal Poisoning',
    description: 'Emergency protocol for suspected poisoning',
    steps: [
      '1. Remove the animal from the source of poison immediately',
      '2. Identify the poison if possible (keep container/package)',
      '3. Do NOT induce vomiting unless instructed by a veterinarian',
      '4. Call emergency veterinary clinic immediately',
      '5. Transport to nearest veterinary hospital ASAP',
      '6. Bring the poison container if available',
      '7. Monitor breathing and keep animal calm',
    ],
    contacts: ['(02) 8338-2567', '(02) 475-1688'],
  },
  'extreme-weather': {
    id: 'extreme-weather',
    title: 'Extreme Weather Rescue',
    description: 'Rescue protocol during typhoons, floods, or extreme weather',
    steps: [
      '1. Ensure your own safety first',
      '2. Call local rescue organization',
      '3. If safe, provide temporary shelter (box, blanket)',
      '4. Move to higher ground if flooding',
      '5. Keep animal warm and dry',
      '6. Provide food and clean water if available',
      '7. Contact emergency services at 911 if life-threatening',
    ],
    contacts: ['911', '(02) 475-1688', '(02) 532-3340'],
  },
  'abuse': {
    id: 'abuse',
    title: 'Animal Abuse Report',
    description: 'How to report animal abuse in the Philippines',
    steps: [
      '1. Document the abuse (photos/videos if safe)',
      '2. Note location, date, and time',
      '3. Report to PAWS Philippines at (02) 475-1688',
      '4. Contact Bureau of Animal Industry at (02) 920-9034',
      '5. File report with local barangay',
      '6. Contact Philippine National Police at 117 if immediate danger',
      '7. Preserve evidence if possible',
    ],
    contacts: ['(02) 475-1688', '(02) 920-9034', '117'],
  },
};

// AI response generator (simplified - using rule-based system)
const generateAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Emergency protocols
  if (message.includes('hit') && message.includes('run')) {
    return 'I can help with a hit-and-run situation. This is an emergency protocol for animals hit by vehicles in the Philippines. Would you like me to guide you through the steps?';
  }
  
  if (message.includes('poison') || message.includes('toxic')) {
    return 'This sounds like a poisoning emergency. I can provide you with the emergency protocol. Should I show you the immediate action steps?';
  }
  
  if (message.includes('typhoon') || message.includes('flood') || message.includes('storm')) {
    return 'For extreme weather rescues, safety is the priority. I can guide you through the rescue protocol. Would you like the step-by-step guide?';
  }
  
  if (message.includes('abuse') || message.includes('cruel')) {
    return 'Animal abuse is a serious matter. I can help you report it properly. Would you like me to show you the reporting protocol?';
  }

  // General animal care questions
  if (message.includes('injured') || message.includes('hurt') || message.includes('wound')) {
    return 'For injured animals, immediate veterinary care is important. The nearest 24/7 veterinary hospital in Manila is at (02) 8338-2567. Would you like me to help you find the nearest clinic?';
  }
  
  if (message.includes('stray') || message.includes('abandoned')) {
    return 'For stray or abandoned animals, you can contact PAWS Philippines at (02) 475-1688 or CARA Welfare at (02) 532-3340. They can help with rescue and shelter. Would you like more information?';
  }
  
  if (message.includes('sick') || message.includes('ill') || message.includes('disease')) {
    return 'I can help assess symptoms. Please describe what symptoms you\'re seeing (e.g., vomiting, lethargy, loss of appetite). This will help determine the urgency.';
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
    return 'Hello! I\'m here to help with animal emergencies in the Philippines. I can assist with:\n- Emergency protocols (hit-and-run, poisoning, extreme weather)\n- Finding nearby veterinary clinics\n- Reporting animal abuse\n- Symptom assessment\n\nWhat do you need help with?';
  }
  
  if (message.includes('vet') || message.includes('clinic') || message.includes('hospital')) {
    return 'I can help you find veterinary services. For 24/7 emergency care in Manila, call (02) 8338-2567. For other locations, I can help you find the nearest clinic. What city are you in?';
  }
  
  if (message.includes('contact') || message.includes('phone') || message.includes('number')) {
    return 'Here are key emergency contacts:\n- PAWS Philippines: (02) 475-1688\n- CARA Welfare: (02) 532-3340\n- 24/7 Vet Hospital: (02) 8338-2567\n- National Police: 117 or 911\n\nWhich one do you need?';
  }

  // Default response
  return 'I\'m here to help with animal welfare emergencies in the Philippines. I can assist with emergency protocols, finding veterinary services, reporting abuse, and symptom assessment. What specific help do you need?';
};

export const chatbotService = {
  // Send message and get AI response
  sendMessage: async (message: string, userId?: string): Promise<ChatMessage> => {
    await delay(800); // Simulate AI processing time
    
    // Generate AI response
    const aiResponse = generateAIResponse(message);

    const responseMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      type: 'message',
    };

    // Save to history
    chatbotService.addMessageToHistory(message, responseMessage, userId);

    return responseMessage;
  },

  // Get emergency protocol
  getEmergencyProtocol: async (protocolId: string): Promise<EmergencyProtocol | null> => {
    await delay(300);
    return EMERGENCY_PROTOCOLS[protocolId] || null;
  },

  // Get all emergency protocols
  getAllEmergencyProtocols: async (): Promise<EmergencyProtocol[]> => {
    await delay(200);
    return Object.values(EMERGENCY_PROTOCOLS);
  },

  // Get chat history
  getChatHistory: (userId?: string): ChatMessage[] => {
    try {
      const key = userId ? `${STORAGE_KEY_CHAT}_${userId}` : STORAGE_KEY_CHAT;
      const stored = localStorage.getItem(key);
      if (!stored) return [];
      return JSON.parse(stored).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch {
      return [];
    }
  },

  // Add message to history
  addMessageToHistory: (userMessage: string, aiResponse: ChatMessage, userId?: string): void => {
    try {
      const key = userId ? `${STORAGE_KEY_CHAT}_${userId}` : STORAGE_KEY_CHAT;
      const history = chatbotService.getChatHistory(userId);
      
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
        type: 'message',
      };

      const newHistory = [...history, userMsg, aiResponse].slice(-50); // Keep last 50 messages
      localStorage.setItem(key, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  },

  // Clear chat history
  clearChatHistory: (userId?: string): void => {
    const key = userId ? `${STORAGE_KEY_CHAT}_${userId}` : STORAGE_KEY_CHAT;
    localStorage.removeItem(key);
  },
};

