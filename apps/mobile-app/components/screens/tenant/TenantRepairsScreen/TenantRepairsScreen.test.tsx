import { fireEvent, render, screen } from "@testing-library/react-native";

import TenantRepairsScreen from "./TenantRepairsScreen";

describe("TenantRepairsScreen", () => {
  it("lists open repairs and files a new one", () => {
    const onFileRepair = jest.fn();
    const onOpenRepair = jest.fn();
    render(
      <TenantRepairsScreen
        repairs={[
          {
            _id: "wo-1",
            title: "Kitchen tap leak",
            status: "received",
            category: "plumbing",
            urgency: "high",
          },
        ]}
        onFileRepair={onFileRepair}
        onOpenRepair={onOpenRepair}
      />
    );

    expect(screen.getByText("Repairs")).toBeTruthy();
    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("File a repair"));
    expect(onFileRepair).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByLabelText("Kitchen tap leak"));
    expect(onOpenRepair).toHaveBeenCalledWith("wo-1");
  });
});
