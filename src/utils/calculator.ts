/**
 * Maruti Safety Nets - Core business logic, validation & WhatsApp link generator
 */

export interface InquiryInput {
  name?: string;
  service: string;
  locality?: string;
  notes?: string;
}

export const MARUTI_CONTACT = {
  name: 'Maruti Safety Nets',
  phone: '7338581692',
  phoneFormatted: '+91 7338581692',
  email: 'maruthib479@gmail.com',
  tagline: 'Balcony and Grill Expert'
};

export const SERVICES_LIST = [
  'Invisible Grills',
  'Balcony Safety Nets',
  'Pigeon Spikes & Anti-Bird Nets',
  'Monkey Safety Nets',
  'Dry Cloth Hangers',
  'Sports Nets & Mats'
];

/**
 * Validates Indian Phone Numbers (10 digits)
 */
export function validateIndianPhoneNumber(phone: string): { isValid: boolean; normalized: string } {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const match = cleaned.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  if (match) {
    return {
      isValid: true,
      normalized: `+91${match[1]}`
    };
  }
  return {
    isValid: false,
    normalized: ''
  };
}

/**
 * Generates direct WhatsApp inquiry URL with prefilled message
 */
export function generateMarutiWhatsAppUrl(options: InquiryInput): string {
  let message = `Hello Maruti Safety Nets,\nI want to book an inspection for my property in Bengaluru.`;
  
  if (options.service) {
    message += `\n- Service Required: ${options.service}`;
  }
  if (options.name && options.name.trim()) {
    message += `\n- Name: ${options.name.trim()}`;
  }
  if (options.locality && options.locality.trim()) {
    message += `\n- Locality / Apartment: ${options.locality.trim()}`;
  }
  if (options.notes && options.notes.trim()) {
    message += `\n- Details: ${options.notes.trim()}`;
  }
  message += `\nPlease let me know when your team can visit for inspection. Thank you!`;

  return `https://wa.me/91${MARUTI_CONTACT.phone}?text=${encodeURIComponent(message)}`;
}
