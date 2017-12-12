module.exports = {
    setupFiles: [
        'jest-localstorage-mock',
        '<rootDir>/jest.setup.js',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
    ],
};
