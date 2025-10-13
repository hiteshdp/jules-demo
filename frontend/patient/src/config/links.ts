// src/config/links.ts
export const PATIENT_BASE_URL =
  import.meta.env.VITE_PATIENT_BASE_URL ?? 'http://localhost:3000';

export const DERM_BASE_URL =
  import.meta.env.VITE_DERM_BASE_URL ?? 'http://localhost:3001';

export const URLS = {
  // Internal pages within Patient (this app)
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms',

  // Cross-app absolute destinations
  PATIENT_LOGIN: `${PATIENT_BASE_URL}/patient/login`,
  DERM_LOGIN: `${DERM_BASE_URL}/dermatologist/login`,
};
