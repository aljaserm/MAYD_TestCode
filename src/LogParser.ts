import { LogEntry } from "./LogEntry";


export class LogParser {
  private logEntries: LogEntry[];

  constructor() {
    this.logEntries = [];
  }

  public readLogFile(logFilePath: string): LogEntry[] {
    // TODO:
    // Implement the logic to read the input log file and parse the log entries
    // Populate the this.logEntries array with parsed LogEntry objects
    // Return the array of log entries
  }

  public filterErrorLogs(): LogEntry[] {
    // TODO:
    // Implement the logic to filter the error log entries
    // Return an array of LogEntry objects containing only the error logs
  }

  public writeErrorLogs(outputFilePath: string): void {
    // TODO:
    // Implement the logic to write the error log entries to the output file
  }
}
