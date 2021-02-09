const loggerUtils = require('../../src/utils/logger');

describe('logMessage', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'log');
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'info');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should log info log for debug', () => {
    let message = 'test debug';
    loggerUtils.logMessage(message, 123, loggerUtils.LOG_LEVEL.DEBUG);
    expect(console.info).toHaveBeenCalledTimes(1);

    loggerUtils.logMessage(message, 123, loggerUtils.LOG_LEVEL.WARN);
    expect(console.info).toHaveBeenCalledTimes(2);

    loggerUtils.logMessage(message, 123, loggerUtils.LOG_LEVEL.INFO);
    expect(console.info).toHaveBeenCalledTimes(3);

    loggerUtils.logMessage(message, 123);
    expect(console.info).toHaveBeenCalledTimes(4);

    loggerUtils.logMessage(message);
    expect(console.info).toHaveBeenCalledTimes(5);
  });
  it('should log error log for error', () => {
    let message = 'test debug';
    loggerUtils.logMessage(message, 123, loggerUtils.LOG_LEVEL.ERROR);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
  it('should log standard log for default', () => {
    let message = 'test debug';
    loggerUtils.logMessage(message);
    expect(console.info).toHaveBeenCalledTimes(1);
  });
  it('should log default log', () => {
    let message = 'test debug';
    loggerUtils.logMessage(message, 123, loggerUtils.LOG_LEVEL.TRACE);
    expect(console.log).toHaveBeenCalledTimes(1);
  });
  it('should log debug log if ENABLE_DEBUG_LOG is set to true', () => {
    process.env.ENABLE_DEBUG_LOG = 'true';
    loggerUtils.logDebug('test debug');
    expect(console.info).toHaveBeenCalledTimes(1);
  });
  it('should not log debug log if ENABLE_DEBUG_LOG is set to false', () => {
    process.env.ENABLE_DEBUG_LOG = false;
    loggerUtils.logDebug('test debug');
    expect(console.info).toHaveBeenCalledTimes(0);
  });
  it('should log error message', () => {
    process.env.ENABLE_DEBUG_LOG = 'true';
    loggerUtils.logError('test error');
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
