const config = require('kcd-scripts/jest');

module.exports = {
  ...config,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};
