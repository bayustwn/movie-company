import { JwtPayload } from "@/core";

export interface AuthResult {
    user: JwtPayload;
}
