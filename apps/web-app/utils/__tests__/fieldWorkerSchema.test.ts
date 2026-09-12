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
});
