import { buildingLookPhoto, personLookPhoto } from "../lookPhotos";

describe("lookPhotos", () => {
  it("gives the same person the same picture", () => {
    expect(personLookPhoto("Ama Boateng")).toBe(personLookPhoto("Ama Boateng"));
    expect(personLookPhoto("Ama Boateng")).toMatch(/^\/look\/people\/w/);
  });

  it("gives a man a picture from the men's set", () => {
    expect(personLookPhoto("Kojo Asante")).toMatch(/^\/look\/people\/m/);
  });

  it("gives the same building the same picture", () => {
    expect(buildingLookPhoto("Ridge Court")).toBe(
      buildingLookPhoto("Ridge Court")
    );
    expect(buildingLookPhoto("Ridge Court")).toMatch(/^\/look\/buildings\//);
  });
});
