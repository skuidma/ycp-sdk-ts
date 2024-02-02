/**
 * Exception thrown when encountering an HTTP error with the API
 */
export class ApiHttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: object,
  ) {
    super();
  }
}
