import React from "react";
import "whatwg-fetch"; // Polyfill fetch for tests
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

// ❌ DO NOT import this in CodeGrade
// import "@testing-library/jest-dom/extend-expect";

import { server } from "../mocks/server";
import App from "../components/App";

// Setup mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));

  const question1 = await screen.findByText(/lorem testum 1/i);
  const question2 = await screen.findByText(/lorem testum 2/i);

  expect(question1).toBeTruthy();
  expect(question2).toBeTruthy();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  await screen.findByText(/lorem testum 1/i);

  fireEvent.click(screen.getByText(/New Question/));

  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "Answer A" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "Answer B" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: "Answer C" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: "Answer D" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Add Question/i }));
  fireEvent.click(screen.getByText(/View Questions/));

  const newQuestion = await screen.findByText(/Test Prompt/i);
  expect(newQuestion).toBeTruthy();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));

  const question = await screen.findByText(/lorem testum 1/i);
  fireEvent.click(screen.getAllByText(/Delete Question/i)[0]);

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/lorem testum 1/i)
  );

  expect(screen.queryByText(/lorem testum 1/i)).toBeNull();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));

  const dropdowns = await screen.findAllByLabelText(/Correct Answer/i);
  fireEvent.change(dropdowns[0], { target: { value: "3" } });

  // Ensure change applied
  await waitFor(() => {
    expect(dropdowns[0].value).toBe("3");
  });

  // Refresh questions to confirm persistence
  fireEvent.click(screen.getByText(/View Questions/));
  const updatedDropdowns = await screen.findAllByLabelText(/Correct Answer/i);

  await waitFor(() => {
    expect(updatedDropdowns[0].value).toBe("3");
  });
});
