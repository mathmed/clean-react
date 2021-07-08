import { Validation } from "../contracts/validation";

export class ValidationStub implements Validation {
  errorMessage: string;
  validade(fieldName: string, fieldValue: string): string {
    return this.errorMessage;
  }
}
