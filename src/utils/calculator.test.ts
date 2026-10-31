import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateIndianPhoneNumber,
  generateMarutiWhatsAppUrl,
  MARUTI_CONTACT,
  SERVICES_LIST
} from './calculator.ts';

test('MARUTI_CONTACT has correct phone and email', () => {
  assert.equal(MARUTI_CONTACT.name, 'Maruti Safety Nets');
  assert.equal(MARUTI_CONTACT.phone, '7338581692');
  assert.equal(MARUTI_CONTACT.phoneFormatted, '+91 7338581692');
  assert.equal(MARUTI_CONTACT.email, 'maruthib479@gmail.com');
  assert.equal(MARUTI_CONTACT.tagline, 'Balcony and Grill Expert');
});

test('validateIndianPhoneNumber handles valid formats', () => {
  assert.equal(validateIndianPhoneNumber('7338581692').isValid, true);
  assert.equal(validateIndianPhoneNumber('+91 7338581692').isValid, true);
  assert.equal(validateIndianPhoneNumber('07338581692').isValid, true);
  assert.equal(validateIndianPhoneNumber('+91-73385-81692').normalized, '+917338581692');
});

test('generateMarutiWhatsAppUrl creates direct link to 7338581692 with details', () => {
  const url = generateMarutiWhatsAppUrl({
    service: 'Invisible Grills',
    name: 'Sumanth',
    locality: 'Bengaluru',
    notes: '2 balconies'
  });

  assert.ok(url.startsWith('https://wa.me/917338581692?text='));
  assert.ok(url.includes('Maruti%20Safety%20Nets'));
  assert.ok(url.includes('Invisible%20Grills'));
  assert.ok(url.includes('Sumanth'));
  assert.ok(url.includes('Bengaluru'));
});

test('SERVICES_LIST has all 6 core services', () => {
  assert.equal(SERVICES_LIST.length, 6);
  assert.ok(SERVICES_LIST.includes('Invisible Grills'));
  assert.ok(SERVICES_LIST.includes('Balcony Safety Nets'));
  assert.ok(SERVICES_LIST.includes('Pigeon Spikes & Anti-Bird Nets'));
  assert.ok(SERVICES_LIST.includes('Monkey Safety Nets'));
  assert.ok(SERVICES_LIST.includes('Dry Cloth Hangers'));
  assert.ok(SERVICES_LIST.includes('Sports Nets & Mats'));
});
