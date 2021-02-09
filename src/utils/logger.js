const EMPTY_STRING = '';
const LOG_LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  ERROR: 'error',
  TRACE: 'trace',
  WARN: 'warn',
  CRITICAL: 'critical',
};

const logMessage = (message, jobId = EMPTY_STRING, logLevel = LOG_LEVEL.INFO) => {
  message = `[${new Date().toISOString()}] Doctor_core_${logLevel}_${jobId || EMPTY_STRING}: ${message}`;
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
const logDebug = (message, jobId = EMPTY_STRING) => {
  if (process.env.ENABLE_DEBUG_LOG && process.env.ENABLE_DEBUG_LOG === 'true') {
    logMessage(message, jobId, LOG_LEVEL.DEBUG);
  }
};

const logError = (message, jobId = EMPTY_STRING) => logMessage(message, jobId, LOG_LEVEL.ERROR);

module.exports = {
  logDebug,
  logError,
  logMessage,
  LOG_LEVEL,
};
