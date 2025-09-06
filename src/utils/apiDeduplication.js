// API Call Deduplication Utility
// Prevents multiple simultaneous calls to the same API endpoint

class ApiDeduplication {
  constructor() {
    this.ongoingRequests = new Map();
    this.requestCounts = new Map();
  }

  // Generate a unique key for the API call
  generateKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  // Check if a request is already ongoing
  isRequestOngoing(key) {
    return this.ongoingRequests.has(key);
  }

  // Get the ongoing request promise
  getOngoingRequest(key) {
    return this.ongoingRequests.get(key);
  }

  // Start a new request
  async startRequest(key, requestFunction) {
    // If request is already ongoing, return the existing promise
    if (this.ongoingRequests.has(key)) {
      console.log(`🔄 Reusing ongoing request for: ${key}`);
      return this.ongoingRequests.get(key);
    }

    console.log(`🚀 Starting new request for: ${key}`);
    // Create new request promise
    const requestPromise = this.executeRequest(key, requestFunction);
    
    // Store the promise
    this.ongoingRequests.set(key, requestPromise);
    
    return requestPromise;
  }

  // Execute the actual request
  async executeRequest(key, requestFunction) {
    try {
      // Increment request count
      const count = this.requestCounts.get(key) || 0;
      this.requestCounts.set(key, count + 1);
      
      console.log(`🚀 Starting API request: ${key} (Count: ${count + 1})`);
      
      const result = await requestFunction();
      
      console.log(`✅ Completed API request: ${key}`, result);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed API request: ${key}`, error);
      throw error;
    } finally {
      // Remove from ongoing requests
      this.ongoingRequests.delete(key);
      console.log(`🧹 Cleaned up request: ${key}`);
    }
  }

  // Get request statistics
  getStats() {
    return {
      ongoingRequests: this.ongoingRequests.size,
      requestCounts: Object.fromEntries(this.requestCounts),
      ongoingKeys: Array.from(this.ongoingRequests.keys())
    };
  }

  // Clear all ongoing requests
  clearAll() {
    this.ongoingRequests.clear();
    this.requestCounts.clear();
  }

  // Clear specific request
  clearRequest(key) {
    this.ongoingRequests.delete(key);
    this.requestCounts.delete(key);
  }
}

// Create singleton instance
const apiDeduplication = new ApiDeduplication();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.apiDeduplication = apiDeduplication;
}

export default apiDeduplication;
