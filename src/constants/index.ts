export const JWT_CONFIG = {
    ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "2h",
    ACCESS_EXPIRY_REMEMBER: process.env.JWT_ACCESS_EXPIRY_REMEMBER || "30d",
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
    REFRESH_EXPIRY_REMEMBER: process.env.JWT_REFRESH_EXPIRY_REMEMBER || "30d",
};

export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
export const BCRYPT_TOKEN_SALT_ROUNDS = parseInt(process.env.BCRYPT_TOKEN_SALT_ROUNDS || "10");

export const USER_ROLES = {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;
