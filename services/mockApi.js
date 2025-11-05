import * as SecureStore from 'expo-secure-store';

// Mock data for testing
const MOCK_USER = { id: 1, username: 'testuser', name: 'Investigator Alpha' };
const MOCK_TOKEN = 'mock-jwt-token-12345';

const MOCK_PEOPLE_RESULTS = [
  { id: 101, NAME: 'Ahmed Hassan', DIAL: '01001234567', table_name: 'Citizens_A' },
  { id: 102, NAME: 'Hassan Ali', DIAL: '01119876543', table_name: 'Suspects_B' },
  { id: 103, NAME: 'Fatma Ahmed', DIAL2: '01225554444', table_name: 'Witnesses_C' },
];

const MOCK_VEHICLE_RESULTS = [
  { id: 201, PLATE: 'ABC 123', VIN: 'XYZ1234567890', MODEL: 'Toyota Corolla', table_name: 'Vehicles_A' },
  { id: 202, PLATE: 'GHI 456', VIN: 'QWE0987654321', MODEL: 'Hyundai Elantra', table_name: 'Vehicles_B' },
];

// --- Mock Authentication Service ---
export const mockAuthService = {
  async login(username, password) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (username === 'test' && password === 'test') {
      await SecureStore.setItemAsync('authToken', MOCK_TOKEN);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(MOCK_USER));
      return { success: true, user: MOCK_USER, token: MOCK_TOKEN };
    } else {
      return {
        success: false,
        error: 'Invalid mock credentials. Use username: test, password: test',
      };
    }
  },

  async logout() {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userInfo');
    return { success: true };
  },

  async getCurrentUser() {
    try {
      const userInfo = await SecureStore.getItemAsync('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  },
};

// --- Mock Search Service ---
export const mockSearchService = {
  async searchPeople(query, searchType) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const filteredResults = MOCK_PEOPLE_RESULTS.filter(item => {
      const q = query.toLowerCase();
      if (searchType === 'name') {
        return item.NAME && item.NAME.toLowerCase().includes(q);
      } else if (searchType === 'phone') {
        return (item.DIAL && item.DIAL.includes(q)) || 
               (item.DIAL2 && item.DIAL2.includes(q)) || 
               (item.DIAL3 && item.DIAL3.includes(q)) || 
               (item.DIAL4 && item.DIAL4.includes(q));
      }
      return false;
    });

    return {
      success: true,
      data: filteredResults,
      total: filteredResults.length,
    };
  },

  async searchVehicles(query) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const filteredResults = MOCK_VEHICLE_RESULTS.filter(item => {
      const q = query.toLowerCase();
      return (item.PLATE && item.PLATE.toLowerCase().includes(q)) || 
             (item.VIN && item.VIN.toLowerCase().includes(q));
    });

    return {
      success: true,
      data: filteredResults,
      total: filteredResults.length,
    };
  },

  async getRecordDetails(recordId, recordType) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    let record = null;
    if (recordType === 'people') {
      record = MOCK_PEOPLE_RESULTS.find(r => r.id === recordId);
    } else if (recordType === 'vehicle') {
      record = MOCK_VEHICLE_RESULTS.find(r => r.id === recordId);
    }

    if (record) {
      return { success: true, data: record };
    } else {
      return { success: false, error: 'Mock record not found.' };
    }
  },
};

// Default export for the main API file
export default {
  authService: mockAuthService,
  searchService: mockSearchService,
};
