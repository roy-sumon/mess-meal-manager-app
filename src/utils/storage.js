/**
 * LocalStorage management and initial demo data
 */

const STORAGE_KEY_MEMBERS = 'mess_calculator_members_v1';
const STORAGE_KEY_CONFIG = 'mess_calculator_config_v1';

export const DEMO_MEMBERS = [
  { id: '1', name: 'Sumon Roy', depositBalance: 3500, totalMeals: 45 },
  { id: '2', name: 'Shakil Ahmed', depositBalance: 2500, totalMeals: 38 },
  { id: '3', name: 'Tanvir Hossain', depositBalance: 4000, totalMeals: 52 },
  { id: '4', name: 'Mehedi Hasan', depositBalance: 2200, totalMeals: 30 },
  { id: '5', name: 'Rakibul Islam', depositBalance: 3000, totalMeals: 42 },
];

export const DEFAULT_CONFIG = {
  messName: 'Rose Valley Mess',
  monthYear: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
  customBazarCost: 0,
  useBazarCost: false,
};

export const loadStoredMembers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading stored members:', err);
  }
  return DEMO_MEMBERS;
};

export const saveStoredMembers = (members) => {
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  } catch (err) {
    console.error('Error saving members:', err);
  }
};

export const loadStoredConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error loading stored config:', err);
  }
  return DEFAULT_CONFIG;
};

export const saveStoredConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving config:', err);
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_MEMBERS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  } catch (err) {
    console.error('Error clearing data:', err);
  }
};

