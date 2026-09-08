import { describe, expect, it } from "vitest";

import { api } from "./_generated/api";
import { asUser, errorCode, insertPerson, makeBackend } from "./test.setup";

describe("staff.getHome", () => {
  it("returns the staff home for a staff member", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });

    const home = await asUser(t, userId).query(api.staff.getHome, {});

    expect(home).toEqual({
      displayName: "Ama Boateng",
      organizationName: "Ridgeway Property Group",
    });
  });

  it("refuses a field worker", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "yaw.darko@ridgeway.gh",
      displayName: "Yaw Darko",
      role: "field",
    });

    try {
      await asUser(t, userId).query(api.staff.getHome, {});
      throw new Error("expected getHome to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });

  it("refuses a signed-in person with no staff role", async () => {
    const t = makeBackend();
    const { userId } = await insertPerson(t, {
      email: "visitor@ridgeway.gh",
      displayName: "Kojo Owusu",
      role: null,
    });

    try {
      await asUser(t, userId).query(api.staff.getHome, {});
      throw new Error("expected getHome to refuse");
    } catch (error) {
      expect(errorCode(error)).toBe("NOT_PERMITTED");
    }
  });
});
