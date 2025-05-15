export abstract class GlobalHttpError extends Error {
  statusCode!: number
}
