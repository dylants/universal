import debugCaller from 'debug-caller';

import projectConfig from '../../package.json';

// enable project namespace to print log messages by default
debugCaller.debug.enable(`${projectConfig.name}*`);

module.exports = function exports() {
  // set a depth of 2 to avoid using this file within debug statements
  // (since this is just a passthrough for logging)
  return debugCaller(projectConfig.name, {
    depth: 2,
  });
};
