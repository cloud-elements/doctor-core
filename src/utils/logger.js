const LOG_LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  ERROR: 'error',
  TRACE: 'trace',
  WARN: 'warn',
  CRITICAL: 'critical',
};

const logMessage = (message, logLevel = LOG_LEVEL.INFO) => {
  message = `[${new Date().toISOString()}] Doctor-core: ${logLevel}: ${message}`;
  switch (logLevel) {
    case LOG_LEVEL.DEBUG:
    case LOG_LEVEL.WARN:
    case LOG_LEVEL.INFO:
      console.info(message);
      break;
    case LOG_LEVEL.ERROR:
      console.error(message);
      break;
    default:
      console.log(message);
  }
};

/**
 * Logs debug message only if ENABLE_DEBUG_LOG environment variable is set to true
 * It is set either from doctor-cli (by default true) or doctor-service
 * @param {} message
 */
const logDebug = message => {
  if (process.env.ENABLE_DEBUG_LOG && process.env.ENABLE_DEBUG_LOG === 'true') {
    logMessage(message, LOG_LEVEL.DEBUG);
  }
};

const logError = message => logMessage(message, LOG_LEVEL.ERROR);

module.exports = {
  logDebug,
  logError,
  logMessage,
  LOG_LEVEL,
};
