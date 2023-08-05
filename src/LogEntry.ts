export class LogEntry {
    public timestamp: string;
    public logLevel: string;
    public transactionId: string;
    public err: string;
  
    constructor(
      timestamp: string,
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
  