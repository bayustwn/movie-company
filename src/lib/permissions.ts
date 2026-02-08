import { PERMISSIONS, ROLE_PERMISSIONS, Permission, Role } from "@/core/permissions";

export function hasPermission(userRole: string, requiredPermission: Permission): boolean {
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (userPermissions.includes(PERMISSIONS.ALL)) {
        return true;
    }

    if (userPermissions.includes(requiredPermission)) {
        return true;
    }

    const [resource, action] = requiredPermission.split(".");
    const managePermission = `${resource}.manage`;

    if (userPermissions.includes(managePermission)) {
        return true;
    }

    return false;
}

export function hasAnyPermission(userRole: string, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: string, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission => hasPermission(userRole, permission));
}

export function getUserPermissions(userRole: string): string[] {
    return ROLE_PERMISSIONS[userRole] || [];
}
