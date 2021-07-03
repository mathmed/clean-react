import { HttpPostClient, HttpStatusCode } from "@/data/contracts/http";
import { InvalidCredentialsError, UnexpetedError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";
import { Authentication, AuthenticationParams } from "@/domain/usecases";

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpPostClient<
      AuthenticationParams,
      AccountModel
    >
  ) {}
  async auth(params: AuthenticationParams): Promise<AccountModel> {
    const httpResponse = await this.httpClient.post({
      url: this.url,
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.badRequest:
        throw new UnexpetedError();
      default:
        throw new UnexpetedError();
    }
  }
}
