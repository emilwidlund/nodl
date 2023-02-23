module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFiles: ['./setupTests.js', 'jest-webgl-canvas-mock']
};
