import { personLookPhotoFile } from "../lookPhotos";

describe("personLookPhotoFile", () => {
  it("gives the same person the same file", () => {
    expect(personLookPhotoFile("Ama Boateng")).toBe(
      personLookPhotoFile("Ama Boateng")
    );
    expect(personLookPhotoFile("Ama Boateng")).toMatch(/^w/);
  });

  it("gives a man a file from the men's set", () => {
    expect(personLookPhotoFile("Kojo Asante")).toMatch(/^m/);
  });
});
