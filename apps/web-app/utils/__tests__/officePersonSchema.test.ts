import { officePersonSchema } from "../officePersonSchema";

describe("officePersonSchema", () => {
  it("requires a password when adding an office person", () => {
    const result = officePersonSchema(false).safeParse({
      displayName: "Efua Mensah",
      email: "efua.mensah@ridgeway.gh",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty password when editing", () => {
    expect(
      officePersonSchema(true).parse({
        displayName: "Efua Mensah",
        email: "efua.mensah@ridgeway.gh",
        password: "",
      })
    ).toEqual({
      displayName: "Efua Mensah",
      email: "efua.mensah@ridgeway.gh",
      password: "",
    });
  });

  it("rejects a short password", () => {
    const result = officePersonSchema(false).safeParse({
      displayName: "Efua Mensah",
      email: "efua.mensah@ridgeway.gh",
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
