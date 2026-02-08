import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/app/**",
        "!src/types/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    setupFilesAfterEnv: [],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            useESM: true,
            tsconfig: "tsconfig.json"
        }],
    },
};

export default config;
