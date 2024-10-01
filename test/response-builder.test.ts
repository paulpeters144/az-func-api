import { describe, it, expect } from "vitest";
import { ResponseBuilder } from "../src/response-builder";

describe("#ResponseBuilder", () => {
  describe("ResponseBuilder - setBody", () => {
    it("sets a plain string as the body", () => {
      const builder = ResponseBuilder();
      builder.setBody("Hello World");
      const response = builder.build();
      expect(response.body).toBe("Hello World");
      expect(response.headers).toBeUndefined();
    });

    it("stringifies an object and sets it as the body", () => {
      const builder = ResponseBuilder();
      const obj = { key: "value" };
      builder.setBody(obj);
      const response = builder.build();
      expect(response.body).toBe(JSON.stringify(obj));
      expect(response.headers).toEqual({ "Content-Type": "application/json" });
    });

    it("sets null as the body", () => {
      const builder = ResponseBuilder();
      builder.setBody(null);
      const response = builder.build();
      expect(response.body).toBe(null);
    });

    it("sets undefined as the body", () => {
      const builder = ResponseBuilder();
      builder.setBody(undefined);
      const response = builder.build();
      expect(response.body).toBe(undefined);
    });

    it("handles an array and sets it as the body", () => {
      const builder = ResponseBuilder();
      const arr = [1, 2, 3];
      builder.setBody(arr);
      const response = builder.build();
      expect(response.body).toBe(arr);
      expect(response.headers).toBeUndefined();
    });

    it("handles a number and sets it as the body", () => {
      const builder = ResponseBuilder();
      builder.setBody(42);
      const response = builder.build();
      expect(response.body).toBe(42);
      expect(response.headers).toBeUndefined();
    });

    it("handles a boolean and sets it as the body", () => {
      const builder = ResponseBuilder();
      builder.setBody(true);
      const response = builder.build();
      expect(response.body).toBe(true);
      expect(response.headers).toBeUndefined();
    });
  });

  describe("ResponseBuilder - setStatus", () => {
    it("sets the status to the provided value", () => {
      const builder = ResponseBuilder();
      builder.setStatus(404);
      const response = builder.build();
      expect(response.status).toBe(404);
    });

    it("sets the status to 200 when no value is provided", () => {
      const builder = ResponseBuilder();
      builder.setStatus();
      const response = builder.build();
      expect(response.status).toBe(200);
    });

    it("sets the status to 500", () => {
      const builder = ResponseBuilder();
      builder.setStatus(500);
      const response = builder.build();
      expect(response.status).toBe(500);
    });

    it("sets the status to 201 for created response", () => {
      const builder = ResponseBuilder();
      builder.setStatus(201);
      const response = builder.build();
      expect(response.status).toBe(201);
    });

    it("sets the status to 401 for unauthorized response", () => {
      const builder = ResponseBuilder();
      builder.setStatus(401);
      const response = builder.build();
      expect(response.status).toBe(401);
    });
  });

  describe("ResponseBuilder - setCookies", () => {
    it("sets cookies correctly", () => {
      const builder = ResponseBuilder();
      const cookies = [{ name: "cookie1", value: "value1" }];
      builder.setCookies(cookies);
      const response = builder.build();
      expect(response.cookies).toEqual(cookies);
    });

    it("overrides previous cookies when setCookies is called again", () => {
      const builder = ResponseBuilder();
      builder.setCookies([{ name: "cookie1", value: "value1" }]);
      builder.setCookies([{ name: "cookie2", value: "value2" }]);
      const response = builder.build();
      expect(response.cookies).toEqual([{ name: "cookie2", value: "value2" }]);
    });

    it("sets empty array when no cookies are passed", () => {
      const builder = ResponseBuilder();
      builder.setCookies();
      const response = builder.build();
      expect(response.cookies).toEqual([]);
    });
  });
});
