import { HttpClientSpy } from "@/data/test";
import { RemoteAuthentication } from "./remote-authentication";
import { mockAccountModel, mockAuthentication } from "@/domain/test";
import { InvalidCredentialsError, UnexpetedError } from "@/domain/errors";
import { HttpStatusCode } from "@/data/contracts/http";
import { AuthenticationParams } from "@/domain/usecases";
import { AccountModel } from "@/domain/models";
import faker from "faker";

type SutTypes = {
  sut: RemoteAuthentication;
  httpPostClientSpy: HttpClientSpy<AuthenticationParams, AccountModel>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClient = new HttpClientSpy<AuthenticationParams, AccountModel>();
  const sut = new RemoteAuthentication(url, httpClient);
  return { sut, httpPostClientSpy: httpClient };
};

describe("RemoteAuthentication", () => {
  test("Should call HttpClient with correct URL", () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    sut.auth(mockAuthentication());
    expect(httpPostClientSpy.url).toBe(url);
  });

  test("Should call HttpClient with correct Body", () => {
    const { sut, httpPostClientSpy } = makeSut();
    const authenticationParams = mockAuthentication();
    sut.auth(authenticationParams);
    expect(httpPostClientSpy.body).toEqual(authenticationParams);
  });

  test("Should throw InvalidCredentialsError if HttpPostClient returns 401", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test("Should throw UnexpetedError if HttpPostClient returns 400", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new UnexpetedError());
  });

  test("Should throw UnexpetedError if HttpPostClient returns 404", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new UnexpetedError());
  });

  test("Should throw UnexpetedError if HttpPostClient returns 500", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new UnexpetedError());
  });

  test("Should return an AccountModel if HttpPostClient returns 200", async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const httpResult = mockAccountModel();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    };
    const account = await sut.auth(mockAuthentication());
    await expect(account).toEqual(httpResult);
  });
});
