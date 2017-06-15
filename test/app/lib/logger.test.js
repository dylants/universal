describe('The logger library', () => {
  let logger;

  beforeEach(() => {
    logger = require('../../../app/lib/logger');
  });

  it('should exist', () => {
    expect(logger).toBeDefined();
  });

  it('should return a log and error function for logger', () => {
    const myLogger = logger();

    expect(myLogger.log).toBeDefined();
    expect(myLogger.error).toBeDefined();
  });
});
