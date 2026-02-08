import {
    JWT_CONFIG,
    BCRYPT_SALT_ROUNDS,
    BCRYPT_TOKEN_SALT_ROUNDS,
    USER_ROLES,
    HTTP_STATUS,
} from "../constants";

describe("Constants", () => {
    describe("JWT_CONFIG", () => {
        it("should have access expiry values", () => {
            expect(JWT_CONFIG.ACCESS_EXPIRY).toBeDefined();
            expect(JWT_CONFIG.ACCESS_EXPIRY_REMEMBER).toBeDefined();
        });

        it("should have refresh expiry values", () => {
            expect(JWT_CONFIG.REFRESH_EXPIRY).toBeDefined();
            expect(JWT_CONFIG.REFRESH_EXPIRY_REMEMBER).toBeDefined();
        });
    });

    describe("BCRYPT constants", () => {
        it("should have valid salt rounds", () => {
            expect(typeof BCRYPT_SALT_ROUNDS).toBe("number");
            expect(BCRYPT_SALT_ROUNDS).toBeGreaterThanOrEqual(10);
        });

        it("should have valid token salt rounds", () => {
            expect(typeof BCRYPT_TOKEN_SALT_ROUNDS).toBe("number");
            expect(BCRYPT_TOKEN_SALT_ROUNDS).toBeGreaterThanOrEqual(8);
        });
    });

    describe("USER_ROLES", () => {
        it("should have ADMIN and STAFF roles", () => {
            expect(USER_ROLES.ADMIN).toBe("ADMIN");
            expect(USER_ROLES.STAFF).toBe("STAFF");
        });
    });

    describe("HTTP_STATUS", () => {
        it("should have correct status codes", () => {
            expect(HTTP_STATUS.OK).toBe(200);
            expect(HTTP_STATUS.CREATED).toBe(201);
            expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
            expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
            expect(HTTP_STATUS.FORBIDDEN).toBe(403);
            expect(HTTP_STATUS.NOT_FOUND).toBe(404);
            expect(HTTP_STATUS.CONFLICT).toBe(409);
            expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
        });
    });
});
