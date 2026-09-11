import { describe, expect, it } from "vitest";

import { api, internal } from "./_generated/api";
import {
  asUser,
  insertPerson,
  makeBackend,
  passwordAccountSecret,
} from "./test.setup";

describe("auth.setPassword", () => {
  it("sets a new password for an existing login by email", async () => {
    const t = makeBackend();
    const staff = await insertPerson(t, {
      email: "ama.boateng@ridgeway.gh",
      displayName: "Ama Boateng",
      role: "staff",
    });
    await asUser(t, staff.userId).action(api.owners.grantLogin, {
      displayName: "Kwesi Mensah",
      contactEmail: "kwesi.mensah@ridgeway.gh",
      password: "RidgewayOwnerA26",
    });
    const before = await passwordAccountSecret(t, "kwesi.mensah@ridgeway.gh");

    await t.action(internal.auth.setPassword, {
      email: "kwesi.mensah@ridgeway.gh",
      password: "RidgewayOwnerA27",
    });

    const after = await passwordAccountSecret(t, "kwesi.mensah@ridgeway.gh");
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after).not.toBe(before);
  });
});
