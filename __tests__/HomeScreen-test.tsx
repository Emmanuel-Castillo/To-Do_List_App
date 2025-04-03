import { fireEvent, render, waitFor } from "@testing-library/react-native";

import HomeScreen from "@/app/index";

// Typing new task to the input, click add button, and check if task is added to list
describe("<HomeScreen />", () => {
  test("Adds a new task", async () => {
    // Grabbing elements using functions below
    const { getByPlaceholderText, getByText, findByTestId } = render(
      <HomeScreen />
    );

    const input = getByPlaceholderText("Enter new task...");
    fireEvent.changeText(input, "Test Task");

    const addButton = getByText("Add Task");
    fireEvent.press(addButton);

    // Wait for the new task to appear
    await waitFor(async () => {
      const taskContainer = await findByTestId("swipeable-Test Task")
      expect(taskContainer).toBeTruthy();
      expect(taskContainer).toHaveTextContent("Test Task", {exact: false})

      const taskCheckbox = findByTestId("checkbox-Test Task")
      expect(taskCheckbox).toBeTruthy();
    } )
  });

  // Creating a new task, clicking on its checkbox, and check whether it's green
  test("Marks a task as completed", async () => {
    // Grabbing elements using functions below
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <HomeScreen />
    );

    const input = getByPlaceholderText("Enter new task...");
    fireEvent.changeText(input, "Test Task");

    const addButton = getByText("Add Task");
    fireEvent.press(addButton);

    // Check if created
    await waitFor(() => getByText("Test Task"));
    expect(getByText("Test Task")).toBeTruthy();

    // Grabbing checkbox of task's Task component using testID
    const checkbox = getByTestId("checkbox-Test Task");
    fireEvent.press(checkbox);

    // Check for the checkmark symbol (✔) inside the checkbox
    await waitFor(() => {
      expect(checkbox).toBeTruthy();
      expect(checkbox).toHaveStyle({ backgroundColor: "#4CAF50" });
      expect(checkbox).toHaveTextContent("✔");
    });
  });

  // Creating a task, then clicking on its delete button, and check if its been removed
  test("Deleting a task", async () => {
    // Grabbing elements using functions below
    const {
      getByPlaceholderText,
      getByText,
      findByText,
      getByTestId,
      queryByText,
    } = render(<HomeScreen />);
    const input = getByPlaceholderText("Enter new task...");
    fireEvent.changeText(input, "Test Task");

    const addButton = getByText("Add Task");
    fireEvent.press(addButton);

    // Check if created
    await waitFor(() => getByText("Test Task"));
    expect(getByText("Test Task")).toBeTruthy();

    // Grabbing the delete pressable of the task's Task components using testID
    const deletePressable = getByTestId("delete-Test Task");
    fireEvent.press(deletePressable);

    // Wait for task to be removed
    await waitFor(() => expect(queryByText("Test Task")).toBeFalsy());
  });
});
