const CryptoJS = require('crypto-js');

/**
 * Validates the Voter ID format and returns a hash for privacy.
 * Indian Voter ID format: 3 letters followed by 7 digits (e.g., ABC1234567)
 */
function hashVoterId(voterId) {
    if (!voterId) return null;
    const cleanId = voterId.trim().toUpperCase();
    
    // Basic format validation
    const regex = /^[A-Z]{3}[0-9]{7}$/;
    if (!regex.test(cleanId)) {
        return null;
    }

    // SHA-256 Hashing for privacy
    return CryptoJS.SHA256(cleanId).toString();
}

module.exports = { hashVoterId };
