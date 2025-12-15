/**
 * Database Helper Utilities
 * Provides consistent fallback mechanisms and error handling for database operations
 */

const dbConfig = require('../config/database');

/**
 * Execute a database operation with fallback
 * @param {Function} dbOperation - Async function that performs the database operation
 * @param {any} fallbackData - Data to return if database operation fails
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<any>} Result of the operation or fallback data
 */
async function executeWithFallback(dbOperation, fallbackData, operationName = 'Database Operation') {
  try {
    // Check if in demo mode
    if (dbConfig.isDemoMode()) {
      console.log(`🎯 Demo Mode: Skipping ${operationName}`);
      return fallbackData;
    }

    // Execute the database operation
    const result = await dbOperation();
    return result;
  } catch (error) {
    console.warn(`⚠️ ${operationName} failed:`, error.message);
    
    // Return fallback data on error
    return fallbackData;
  }
}

/**
 * Get data with caching and fallback
 * @param {Function} dbQuery - Async function that performs the database query
 * @param {any} fallbackData - Data to return if database query fails
 * @param {string} cacheKey - Key to use for caching (optional)
 * @param {number} ttl - Time to live for cache in milliseconds (optional)
 * @returns {Promise<any>} Result of the query or fallback data
 */
async function getDataWithCache(dbQuery, fallbackData, cacheKey = null, ttl = 300000) {
  try {
    // Check if in demo mode
    if (dbConfig.isDemoMode()) {
      console.log('🎯 Demo Mode: Returning fallback data');
      return fallbackData;
    }

    // Check cache first if cacheKey is provided
    if (cacheKey) {
      const cached = global.apiCache?.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        console.log(`📦 Cache hit for ${cacheKey}`);
        return cached.data;
      }
    }

    // Execute the database query
    const result = await dbQuery();
    
    // Cache the result if cacheKey is provided
    if (cacheKey && global.apiCache) {
      global.apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl: ttl
      });
    }
    
    return result;
  } catch (error) {
    console.warn('⚠️ Database query failed:', error.message);
    
    // Return fallback data on error
    return fallbackData;
  }
}

/**
 * Save data with queue and fallback
 * @param {Function} dbSave - Async function that performs the database save
 * @param {any} data - Data being saved
 * @param {string} modelName - Name of the model for logging
 * @returns {Promise<any>} Result of the save operation
 */
async function saveDataWithQueue(dbSave, data, modelName = 'Document') {
  try {
    // Check if in demo mode
    if (dbConfig.isDemoMode()) {
      console.log(`🎯 Demo Mode: Simulating save for ${modelName}`);
      return {
        success: true,
        message: `${modelName} saved successfully (demo mode)`,
        data: data
      };
    }

    // Execute the database save operation
    const result = await dbSave();
    return result;
  } catch (error) {
    console.warn(`⚠️ Failed to save ${modelName}:`, error.message);
    
    // In demo mode, still return success
    if (dbConfig.isDemoMode()) {
      return {
        success: true,
        message: `${modelName} saved successfully (demo mode)`,
        data: data
      };
    }
    
    throw error; // Re-throw for proper error handling
  }
}

module.exports = {
  executeWithFallback,
  getDataWithCache,
  saveDataWithQueue
};