import { NextRequest } from "next/server";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    method?: string;
    path?: string;
    statusCode?: number;
    duration?: number;
    ip?: string;
    userId?: string;
    message?: string;
    error?: string;
}

function formatLog(entry: LogEntry): string {
    const parts = [
        `[${entry.timestamp}]`,
        `[${entry.level.toUpperCase()}]`,
    ];

    if (entry.method && entry.path) {
        parts.push(`${entry.method} ${entry.path}`);
    }

    if (entry.statusCode) {
        parts.push(`${entry.statusCode}`);
    }

    if (entry.duration !== undefined) {
        parts.push(`${entry.duration}ms`);
    }

    if (entry.ip) {
        parts.push(`IP:${entry.ip}`);
    }

    if (entry.userId) {
        parts.push(`User:${entry.userId}`);
    }

    if (entry.message) {
        parts.push(entry.message);
    }

    if (entry.error) {
        parts.push(`Error:${entry.error}`);
    }

    return parts.join(" | ");
}

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") || "unknown";
}

export const logger = {
    info(message: string, meta?: Partial<LogEntry>) {
        console.log(formatLog({
            timestamp: new Date().toISOString(),
            level: "info",
            message,
            ...meta
        }));
    },

    warn(message: string, meta?: Partial<LogEntry>) {
        console.warn(formatLog({
            timestamp: new Date().toISOString(),
            level: "warn",
            message,
            ...meta
        }));
    },

    error(message: string, error?: Error, meta?: Partial<LogEntry>) {
        console.error(formatLog({
            timestamp: new Date().toISOString(),
            level: "error",
            message,
            error: error?.message,
            ...meta
        }));
    },

    debug(message: string, meta?: Partial<LogEntry>) {
        if (process.env.NODE_ENV === "development") {
            console.debug(formatLog({
                timestamp: new Date().toISOString(),
                level: "debug",
                message,
                ...meta
            }));
        }
    },

    request(request: NextRequest, statusCode: number, duration: number, userId?: string) {
        console.log(formatLog({
            timestamp: new Date().toISOString(),
            level: "info",
            method: request.method,
            path: new URL(request.url).pathname,
            statusCode,
            duration,
            ip: getClientIp(request),
            userId,
        }));
    },
};
