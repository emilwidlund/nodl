module.exports = {
    testEnvironment: 'jsdom',
    snapshotSerializers: ['@emotion/jest/serializer'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest']
    },
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
};
