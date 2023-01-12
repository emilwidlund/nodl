module.exports = {
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
    }
};
