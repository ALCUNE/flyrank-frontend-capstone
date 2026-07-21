import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ProfileUpdateForm,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validateProfileForm,
} from "../ProfileUpdateForm";

describe("ProfileUpdateForm validation helpers", () => {
  it("validates full name requirements", () => {
    expect(validateFullName("")).toBe("Full name is required.");
    expect(validateFullName("Jo")).toBe("Full name must be at least 3 characters.");
    expect(validateFullName("Jane Doe")).toBeUndefined();
  });

  it("validates email format", () => {
    expect(validateEmail("not-an-email")).toBe("Please enter a valid email address.");
    expect(validateEmail("jane@example.com")).toBeUndefined();
  });

  it("validates optional password rules", () => {
    expect(validatePassword("")).toBeUndefined();
    expect(validatePassword("short1A")).toMatch(/at least 8 characters/);
    expect(validatePassword("alllowercase1")).toMatch(/uppercase/);
    expect(validatePassword("ValidPass1")).toBeUndefined();
  });

  it("validates confirm password only when password is set", () => {
    expect(validateConfirmPassword("", "")).toBeUndefined();
    expect(validateConfirmPassword("ValidPass1", "")).toBe(
      "Please confirm your password.",
    );
    expect(validateConfirmPassword("ValidPass1", "Different1")).toBe(
      "Passwords do not match.",
    );
    expect(validateConfirmPassword("ValidPass1", "ValidPass1")).toBeUndefined();
  });

  it("validates the full form payload", () => {
    const errors = validateProfileForm(
      {
        fullName: "Jo",
        email: "bad-email",
        password: "weak",
        confirmPassword: "mismatch",
      },
      null,
    );

    expect(errors.fullName).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(errors.confirmPassword).toBeDefined();
  });
});

describe("ProfileUpdateForm", () => {
  it("renders required fields and blocks invalid submission", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <ProfileUpdateForm
        initialProfile={{ fullName: "", email: "" }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid data and shows a success message", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <ProfileUpdateForm
        initialProfile={{ fullName: "Jane Doe", email: "jane@example.com" }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: "Jane Doe",
        email: "jane@example.com",
        avatar: null,
      });
    });

    expect(
      screen.getByText(/your profile has been updated successfully/i),
    ).toBeInTheDocument();
  });

  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void = () => undefined;

    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(
      <ProfileUpdateForm
        initialProfile={{ fullName: "Jane Doe", email: "jane@example.com" }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();

    resolveSubmit();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();
    });
  });

  it("validates password confirmation on blur", async () => {
    const user = userEvent.setup();

    render(
      <ProfileUpdateForm
        initialProfile={{ fullName: "Jane Doe", email: "jane@example.com" }}
      />,
    );

    await user.type(screen.getByLabelText(/new password/i), "ValidPass1");
    await user.type(screen.getByLabelText(/confirm password/i), "Different1");
    await user.tab();

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
