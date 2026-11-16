/**
 * Re-export matchingService through compatibility.js
 * Guarantees zero regression for any legacy references across the codebase
 */
const matchingService = require('../services/matchingService');

module.exports = {
  ...matchingService,
  calculateCompatibility: matchingService.calculateCompatibility
};
