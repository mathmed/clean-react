import React from "react";
import {
  render,
  RenderResult,
  fireEvent,
  cleanup
} from "@testing-library/react";
import Login from "./login";
import { ValidationStub } from "@/presentation/test/mock-validation";

import faker from "faker";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  const errorMessage = faker.random.words();
  validationStub.errorMessage = errorMessage;
  const sut = render(<Login validation={validationStub} />);
  return { sut, validationStub };
};

describe("Login Component", () => {
  afterEach(cleanup);

  test("Should start with initial state", async () => {
    const { sut, validationStub } = makeSut();
    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = sut.getByTestId("email-status");
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("O");
    const passwordStatus = sut.getByTestId("password-status");
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("O");
  });

  test("Should show email error if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByTestId("email-status");
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("O");
  });

  test("Should show password error if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() }
    });
    const passwordStatus = sut.getByTestId("password-status");
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("O");
  });

  test("Should show valid password state if validation succeeds", async () => {
    const { sut, validationStub } = makeSut();
    validationStub.errorMessage = null;
    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() }
    });
    const passwordStatus = sut.getByTestId("password-status");
    expect(passwordStatus.title).toBe("Tudo certo!");
    expect(passwordStatus.textContent).toBe("I");
  });

  test("Should show valid email state if validation succeeds", async () => {
    const { sut, validationStub } = makeSut();
    validationStub.errorMessage = null;
    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() }
    });
    const emailStatus = sut.getByTestId("email-status");
    expect(emailStatus.title).toBe("Tudo certo!");
    expect(emailStatus.textContent).toBe("I");
  });
});
