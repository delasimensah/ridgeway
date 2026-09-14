import { render, screen } from "@testing-library/react-native";

import TenantRepairsScreen from "./TenantRepairsScreen";

describe("TenantRepairsScreen", () => {
  it("lists open repairs", () => {
    render(
      <TenantRepairsScreen
        repairs={[
          { _id: "wo-1", title: "Kitchen tap leak", status: "received" },
        ]}
      />
    );

    expect(screen.getByText("Repairs")).toBeTruthy();
    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
  });
});
