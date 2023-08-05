export class LogEntry {
  public timestamp: number;
  public logLevel: string;
  public transactionId: string;
  public err: string;

  constructor(
    timestamp: number,
    logLevel: string,
    transactionId: string,
    err: string
  ) {
    this.timestamp = timestamp;
    this.logLevel = logLevel;
    this.transactionId = transactionId;
    this.err = err;
  }
}
