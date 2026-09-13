import { applyAvailableUpdate } from "../applyAvailableUpdate";

describe("applyAvailableUpdate", () => {
  it("downloads and reloads when a JS update is on the channel", async () => {
    const updates = {
      isEnabled: true,
      checkForUpdateAsync: jest.fn().mockResolvedValue({ isAvailable: true }),
      fetchUpdateAsync: jest.fn().mockResolvedValue(undefined),
      reloadAsync: jest.fn().mockResolvedValue(undefined),
    };

    await expect(applyAvailableUpdate(updates)).resolves.toBe(true);
    expect(updates.fetchUpdateAsync).toHaveBeenCalled();
    expect(updates.reloadAsync).toHaveBeenCalled();
  });
});
