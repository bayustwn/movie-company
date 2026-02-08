export const PERMISSIONS = {
    ALL: "*",

    MOVIES: {
        CREATE: "movies.create",
        READ: "movies.read",
        UPDATE: "movies.update",
        DELETE: "movies.delete",
        MANAGE: "movies.manage",
    },

    THEATERS: {
        CREATE: "theaters.create",
        READ: "theaters.read",
        UPDATE: "theaters.update",
        DELETE: "theaters.delete",
        MANAGE: "theaters.manage",
    },

    STAFF: {
        CREATE: "staff.create",
        READ: "staff.read",
        UPDATE: "staff.update",
        DELETE: "staff.delete",
        MANAGE: "staff.manage",
    },

    AUTH: {
        LOGIN: "auth.login",
        LOGOUT: "auth.logout",
        REFRESH: "auth.refresh",
        ME: "auth.me",
    },
} as const;

export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    USER: "USER",
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    [ROLES.SUPER_ADMIN]: [PERMISSIONS.ALL],

    [ROLES.ADMIN]: [
        PERMISSIONS.MOVIES.MANAGE,
        PERMISSIONS.THEATERS.MANAGE,
        PERMISSIONS.STAFF.MANAGE,
        PERMISSIONS.AUTH.LOGIN,
        PERMISSIONS.AUTH.LOGOUT,
        PERMISSIONS.AUTH.REFRESH,
        PERMISSIONS.AUTH.ME,
    ],

    [ROLES.STAFF]: [
        PERMISSIONS.MOVIES.READ,
        PERMISSIONS.MOVIES.CREATE,
        PERMISSIONS.THEATERS.READ,
        PERMISSIONS.STAFF.READ,
        PERMISSIONS.AUTH.LOGIN,
        PERMISSIONS.AUTH.LOGOUT,
        PERMISSIONS.AUTH.REFRESH,
        PERMISSIONS.AUTH.ME,
    ],

    [ROLES.USER]: [
        PERMISSIONS.MOVIES.READ,
        PERMISSIONS.THEATERS.READ,
        PERMISSIONS.AUTH.LOGIN,
        PERMISSIONS.AUTH.LOGOUT,
        PERMISSIONS.AUTH.REFRESH,
        PERMISSIONS.AUTH.ME,
    ],
};

export type Permission =
    | typeof PERMISSIONS.ALL
    | typeof PERMISSIONS.MOVIES.CREATE
    | typeof PERMISSIONS.MOVIES.READ
    | typeof PERMISSIONS.MOVIES.UPDATE
    | typeof PERMISSIONS.MOVIES.DELETE
    | typeof PERMISSIONS.MOVIES.MANAGE
    | typeof PERMISSIONS.THEATERS.CREATE
    | typeof PERMISSIONS.THEATERS.READ
    | typeof PERMISSIONS.THEATERS.UPDATE
    | typeof PERMISSIONS.THEATERS.DELETE
    | typeof PERMISSIONS.THEATERS.MANAGE
    | typeof PERMISSIONS.STAFF.CREATE
    | typeof PERMISSIONS.STAFF.READ
    | typeof PERMISSIONS.STAFF.UPDATE
    | typeof PERMISSIONS.STAFF.DELETE
    | typeof PERMISSIONS.STAFF.MANAGE
    | typeof PERMISSIONS.AUTH.LOGIN
    | typeof PERMISSIONS.AUTH.LOGOUT
    | typeof PERMISSIONS.AUTH.REFRESH
    | typeof PERMISSIONS.AUTH.ME;

export type Role = (typeof ROLES)[keyof typeof ROLES];
