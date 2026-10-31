/**
 * Hanumesh Safety Nets - Core business logic, pricing calculation & validation
 */

export interface ServiceEstimateInput {
  serviceId: string;
  widthFt: number;
  heightFt: number;
  qualityTier?: 'standard' | 'garware_hd' | 'ss316_premium';
}

export interface ServicePricingRule {
  id: string;
  name: string;
  baseRatePerSqFt: number;
  minChargeableSqFt: number;
  warrantyYears: number;
  material: string;
}

export const SERVICE_PRICING_CATALOG: Record<string, ServicePricingRule> = {
  'invisible-grills': {
    id: 'invisible-grills',
    name: 'Invisible Grills',
    baseRatePerSqFt: 140,
    minChargeableSqFt: 50,
    warrantyYears: 5,
    material: 'Grade 316 Stainless Steel (2.5mm / 3.0mm)'
  },
  'balcony-safety-nets': {
    id: 'balcony-safety-nets',
    name: 'Balcony Safety Nets',
    baseRatePerSqFt: 22,
    minChargeableSqFt: 60,
    warrantyYears: 5,
    material: 'Garware High-Density Nylon (0.8mm-1.2mm)'
  },
  'pigeon-spikes': {
    id: 'pigeon-spikes',
    name: 'Pigeon Spikes & Anti-Bird Nets',
    baseRatePerSqFt: 28,
    minChargeableSqFt: 40,
    warrantyYears: 3,
    material: 'Polycarbonate Virgin Base + SS 304 Spikes'
  },
  'monkey-safety-nets': {
    id: 'monkey-safety-nets',
    name: 'Monkey Safety Nets',
    baseRatePerSqFt: 35,
    minChargeableSqFt: 80,
    warrantyYears: 5,
    material: 'Heavy Duty 2.5mm Braided Polyethylene'
  },
  'dry-cloth-hangers': {
    id: 'dry-cloth-hangers',
    name: 'Dry Cloth Hangers (Ceiling Pulley)',
    baseRatePerSqFt: 85,
    minChargeableSqFt: 20,
    warrantyYears: 3,
    material: 'Rust-proof Stainless Steel Tubes with Heavy Pulley'
  },
  'sports-nets': {
    id: 'sports-nets',
    name: 'Sports Nets & Mats',
    baseRatePerSqFt: 18,
    minChargeableSqFt: 100,
    warrantyYears: 3,
    material: 'UV-Stabilized HDPE Nets'
  }
};

/**
 * Calculates estimated cost for safety nets & grills based on square footage
 */
export function calculateEstimate(input: ServiceEstimateInput): {
  sqFt: number;
  billableSqFt: number;
  ratePerSqFt: number;
  totalCost: number;
  discountedCost: number;
  discountAmount: number;
  warrantyYears: number;
  material: string;
} {
  const rule = SERVICE_PRICING_CATALOG[input.serviceId] || SERVICE_PRICING_CATALOG['balcony-safety-nets'];
  const rawSqFt = Math.max(0, input.widthFt * input.heightFt);
  const billableSqFt = Math.max(rawSqFt, rawSqFt > 0 ? rule.minChargeableSqFt : 0);
  
  let rate = rule.baseRatePerSqFt;
  if (input.qualityTier === 'ss316_premium') {
    rate = Math.round(rate * 1.25);
  } else if (input.qualityTier === 'garware_hd') {
    rate = Math.round(rate * 1.15);
  }

  const totalCost = billableSqFt * rate;
  
  // Volume discount: 10% off above 200 sq.ft, 15% off above 500 sq.ft
  let discountPct = 0;
  if (billableSqFt >= 500) {
    discountPct = 0.15;
  } else if (billableSqFt >= 200) {
    discountPct = 0.10;
  }
  
  const discountAmount = Math.round(totalCost * discountPct);
  const discountedCost = totalCost - discountAmount;

  return {
    sqFt: Math.round(rawSqFt),
    billableSqFt: Math.round(billableSqFt),
    ratePerSqFt: rate,
    totalCost,
    discountedCost,
    discountAmount,
    warrantyYears: rule.warrantyYears,
    material: rule.material
  };
}

/**
 * Validates Indian Phone Numbers (10 digits, optional +91 or 0 prefix)
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
 * Generates direct WhatsApp click-to-chat URL with prefilled message
 */
export function generateWhatsAppUrl(options: {
  phone?: string;
  name?: string;
  service?: string;
  locality?: string;
  areaSqFt?: number;
}): string {
  const targetPhone = options.phone || '919845012345';
  let message = `Hello Hanumesh Safety Nets, I am interested in a free site inspection in Bengaluru.`;
  
  if (options.name) {
    message += `\nName: ${options.name}`;
  }
  if (options.service) {
    message += `\nService: ${options.service}`;
  }
  if (options.locality) {
    message += `\nLocality: ${options.locality}`;
  }
  if (options.areaSqFt && options.areaSqFt > 0) {
    message += `\nEstimated Area: ${options.areaSqFt} sq.ft`;
  }
  message += `\nPlease let me know your availability for inspection and best quotation. Thank you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
