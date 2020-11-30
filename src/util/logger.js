/**
 * Logs debug message only if ENABLE_DEBUG_LOG environment variable is set to true
 * It is set either from doctor-cli (by default true) or doctor-service
 * @param {} message
 */
const logDebug = message => {
  if (process.env.ENABLE_DEBUG_LOG && process.env.ENABLE_DEBUG_LOG === 'true') {
    console.log(message);
  }
}

module.exports = logDebug;