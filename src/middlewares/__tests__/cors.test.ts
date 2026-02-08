import { corsHeaders } from "../cors.middleware";

describe("CORS Middleware", () => {
    describe("corsHeaders", () => {
        it("should return CORS headers with default origin", () => {
            const headers = corsHeaders() as Record<string, string>;
            expect(headers["Access-Control-Allow-Origin"]).toBe("*");
        });

        it("should include standard CORS headers", () => {
            const headers = corsHeaders() as Record<string, string>;
            expect(headers["Access-Control-Allow-Methods"]).toContain("GET");
            expect(headers["Access-Control-Allow-Methods"]).toContain("POST");
            expect(headers["Access-Control-Allow-Headers"]).toContain("Authorization");
        });

        it("should set origin when allowed", () => {
            const headers = corsHeaders("http://localhost:3000") as Record<string, string>;
            expect(headers["Access-Control-Allow-Origin"]).toBeDefined();
        });
    });
});
