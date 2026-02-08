import {
    hashPassword,
    comparePassword,
    hashToken,
    compareToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokenPair,
} from "../auth";

describe("Auth Library", () => {
    describe("Password Hashing", () => {
        it("should hash password", async () => {
            const password = "testPassword123";
            const hashed = await hashPassword(password);
            expect(hashed).not.toBe(password);
            expect(hashed.length).toBeGreaterThan(0);
        });

        it("should compare password correctly", async () => {
            const password = "testPassword123";
            const hashed = await hashPassword(password);

            const isValid = await comparePassword(password, hashed);
            expect(isValid).toBe(true);

            const isInvalid = await comparePassword("wrongPassword", hashed);
            expect(isInvalid).toBe(false);
        });
    });

    describe("Token Hashing", () => {
        it("should hash token", async () => {
            const token = "someRefreshToken123";
            const hashed = await hashToken(token);
            expect(hashed).not.toBe(token);
        });

        it("should compare token correctly", async () => {
            const token = "someRefreshToken123";
            const hashed = await hashToken(token);

            const isValid = await compareToken(token, hashed);
            expect(isValid).toBe(true);
        });
    });

    describe("JWT Tokens", () => {
        const payload = {
            userId: "user-123",
            email: "test@example.com",
            role: "ADMIN",
        };

        it("should generate access token", () => {
            const token = generateAccessToken(payload);
            expect(typeof token).toBe("string");
            expect(token.split(".").length).toBe(3);
        });

        it("should generate refresh token", () => {
            const token = generateRefreshToken(payload);
            expect(typeof token).toBe("string");
            expect(token.split(".").length).toBe(3);
        });

        it("should verify valid access token", () => {
            const token = generateAccessToken(payload);
            const decoded = verifyAccessToken(token);
            expect(decoded).not.toBeNull();
            expect(decoded?.userId).toBe(payload.userId);
            expect(decoded?.email).toBe(payload.email);
            expect(decoded?.type).toBe("access");
        });

        it("should verify valid refresh token", () => {
            const token = generateRefreshToken(payload);
            const decoded = verifyRefreshToken(token);
            expect(decoded).not.toBeNull();
            expect(decoded?.userId).toBe(payload.userId);
            expect(decoded?.type).toBe("refresh");
        });

        it("should return null for invalid token", () => {
            const decoded = verifyAccessToken("invalid-token");
            expect(decoded).toBeNull();
        });

        it("should reject refresh token when verified as access", () => {
            const refreshToken = generateRefreshToken(payload);
            const decoded = verifyAccessToken(refreshToken);
            expect(decoded).toBeNull();
        });

        it("should generate token pair", () => {
            const tokens = generateTokenPair(payload);
            expect(tokens.accessToken).toBeDefined();
            expect(tokens.refreshToken).toBeDefined();
            expect(tokens.accessToken).not.toBe(tokens.refreshToken);
        });
    });
});
