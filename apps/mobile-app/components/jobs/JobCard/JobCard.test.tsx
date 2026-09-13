import { fireEvent, render, screen } from "@testing-library/react-native";

import JobCard from "./JobCard";

const job = {
  _id: "wo-1",
  title: "Kitchen tap leak",
  status: "assigned" as const,
  unitLabel: "B12",
  buildingName: "Ridge Court",
  address: "14 Ridge Road, Cantonments, Accra",
  reportedAt: Date.UTC(2026, 8, 13),
};

describe("JobCard", () => {
  it("shows the job and calls onPress", () => {
    const onPress = jest.fn();
    render(<JobCard job={job} onPress={onPress} />);
    expect(screen.getByText("Kitchen tap leak")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Kitchen tap leak"));
    expect(onPress).toHaveBeenCalled();
  });
});
