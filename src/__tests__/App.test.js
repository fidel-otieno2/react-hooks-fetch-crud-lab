// src/__tests__/App.test.js
import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));
  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  await screen.findByText(/lorem testum 1/i);
  fireEvent.click(screen.getByText(/New Question/));

  fireEvent.change(screen.getByLabelText(/Prompt/i), { target: { value: "Test Prompt" } });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), { target: { value: "Answer A" } });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), { target: { value: "Answer B" } });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), { target: { value: "1" } });

  fireEvent.click(screen.getByRole("button", { name: /Add Question/i }));
  fireEvent.click(screen.getByText(/View Questions/));

  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));
  const first = await screen.findByText(/lorem testum 1/i);
  fireEvent.click(screen.getAllByText(/Delete Question/i)[0]);

  await waitForElementToBeRemoved(first);
  expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));
  const dropdown = await screen.findAllByLabelText(/Correct Answer/i);
  fireEvent.change(dropdown[0], { target: { value: "2" } });
  expect(dropdown[0].value).toBe("2");

  fireEvent.click(screen.getByText(/View Questions/)); // or notch
  expect((await screen.findAllByLabelText(/Correct Answer/i))[0].value).toBe("2");
});
