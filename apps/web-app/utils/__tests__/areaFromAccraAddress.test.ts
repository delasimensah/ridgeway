import areaFromAccraAddress from "../areaFromAccraAddress";

describe("areaFromAccraAddress", () => {
  it("reads the Accra area from a stored address", () => {
    expect(areaFromAccraAddress("14 Ridge Road, Cantonments, Accra")).toBe(
      "Cantonments"
    );
  });
});
