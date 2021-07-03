export class UnexpetedError extends Error {
  constructor() {
    super("Algo errado aconteceu. Tente novamente em breve");
    this.name = "UnexpetedError";
  }
}
