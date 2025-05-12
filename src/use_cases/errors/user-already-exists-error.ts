export class UserAlereadyExistsError extends Error {
  constructor() {
    super('User already exists.')
  }
}
