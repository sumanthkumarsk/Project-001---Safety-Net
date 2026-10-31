import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEstimate,
  validateIndianPhoneNumber,
  generateWhatsAppUrl,
  SERVICE_PRICING_CATALOG
} from './calculator.ts';

test('calculateEstimate calculates correct square footage and enforces minimum billable area', () => {
  // 5ft x 5ft = 25 sq.ft, but min for invisible grills is 50 sq.ft
  const result = calculateEstimate({
    serviceId: 'invisible-grills',
    widthFt: 5,
    heightFt: 5
  });

  assert.equal(result.sqFt, 25);
  assert.equal(result.billableSqFt, 50);
  assert.equal(result.ratePerSqFt, 140);
  assert.equal(result.totalCost, 50 * 140);
  assert.equal(result.warrantyYears, 5);
});

test('calculateEstimate applies volume discounts accurately', () => {
  // 25ft x 10ft = 250 sq.ft -> 10% volume discount
  const result = calculateEstimate({
    serviceId: 'balcony-safety-nets',
    widthFt: 25,
    heightFt: 10
  });

  assert.equal(result.sqFt, 250);
  assert.equal(result.billableSqFt, 250);
  assert.equal(result.ratePerSqFt, 22);
  const total = 250 * 22; // 5500
  assert.equal(result.totalCost, 5500);
  assert.equal(result.discountAmount, 550); // 10%
  assert.equal(result.discountedCost, 4950);
});

test('validateIndianPhoneNumber handles valid formats', () => {
  assert.equal(validateIndianPhoneNumber('9845012345').isValid, true);
  assert.equal(validateIndianPhoneNumber('+91 98450 12345').isValid, true);
  assert.equal(validateIndianPhoneNumber('09845012345').isValid, true);
  assert.equal(validateIndianPhoneNumber('+91-98450-12345').normalized, '+919845012345');
});

test('validateIndianPhoneNumber rejects invalid numbers', () => {
  assert.equal(validateIndianPhoneNumber('12345').isValid, false);
  assert.equal(validateIndianPhoneNumber('abcde12345').isValid, false);
  assert.equal(validateIndianPhoneNumber('4984501234').isValid, false); // doesn't start with 6-9
});

test('generateWhatsAppUrl builds well-formed WhatsApp link', () => {
  const url = generateWhatsAppUrl({
    phone: '919845012345',
    name: 'Ramesh Kumar',
    service: 'Invisible Grills',
    locality: 'Chikkabanavara',
    areaSqFt: 120
  });

  assert.match(url, /^https:\/\/wa\.me\/919845012345\?text=/);
  assert.ok(url.includes('Chikkabanavara'));
  assert.ok(url.includes('Invisible%20Grills'));
  assert.ok(url.includes('120%20sq.ft'));
});
