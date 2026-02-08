import { ServiceError } from "@/core";

describe("ServiceError", () => {
    it("should create error with default status code", () => {
        const error = new ServiceError("Something went wrong");
        expect(error.message).toBe("Something went wrong");
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe("ServiceError");
    });

    it("should create error with custom status code", () => {
        const error = new ServiceError("Not found", 404);
        expect(error.message).toBe("Not found");
        expect(error.statusCode).toBe(404);
    });

    it("should be an instance of Error", () => {
        const error = new ServiceError("Test error");
        expect(error).toBeInstanceOf(Error);
    });
});
