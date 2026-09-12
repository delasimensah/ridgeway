import { fieldWorkerSchema } from "../fieldWorkerSchema";

describe("fieldWorkerSchema", () => {
  it("requires a password when adding a field worker", () => {
    const result = fieldWorkerSchema(false).safeParse({
      displayName: "Kofi Asante",
      email: "kofi.asante@ridgeway.gh",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty password when editing", () => {
    expect(
      fieldWorkerSchema(true).parse({
        displayName: "Kofi Asante",
        email: "kofi.asante@ridgeway.gh",
        password: "",
      })
    ).toEqual({
      displayName: "Kofi Asante",
      email: "kofi.asante@ridgeway.gh",
      password: "",
    });
  });

  it("rejects a short password", () => {
    const result = fieldWorkerSchema(false).safeParse({
      displayName: "Kofi Asante",
      email: "kofi.asante@ridgeway.gh",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(
      result.error.issues.some((issue) => issue.path[0] === "password")
    ).toBe(true);
  });
});
