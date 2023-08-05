import { LogEntry } from "./LogEntry";
import fs from 'fs';

export class LogParser {
  private logEntries: LogEntry[];

  constructor() {
    this.logEntries = [];
  }

  public readLogFile(logFilePath: string): LogEntry[] {
    const logData = fs.readFileSync(logFilePath, 'utf-8');
    const logLines = logData.split('\n');

    for (const line of logLines) {
      if (line.trim() !== '') {
        const logEntry = LogParser.parseLogEntry(line);
        if (logEntry) {
          this.logEntries.push(logEntry);
        }
      }
    }

    return this.logEntries;
  }

  public filterErrorLogs(): LogEntry[] {
    return this.logEntries.filter((entry) => entry.logLevel === 'error');
  }

  public writeErrorLogs(outputFilePath: string): void {
    const errorLogs = this.filterErrorLogs();
    const errorLogsJson = JSON.stringify(errorLogs, null, 2);
    fs.writeFileSync(outputFilePath, errorLogsJson);
  }

  private static parseLogEntry(line: string): LogEntry | null {
    const logEntryRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - (\w+) - (\w+) - (.*)/;
    const match = line.match(logEntryRegex);
  
    if (!match || match.length < 5) {
      console.error('Error parsing log entry:', line);
      return null;
    }
  
    const timestamp = match[1];
    const logLevel = match[2];
    const transactionId = match[3];
    const jsonData = match[4];
  
    try {
      const { transactionId: transId, err } = JSON.parse(jsonData);
      if (transId !== transactionId || !err) {
        throw new Error('Invalid JSON data');
      }
      return new LogEntry(timestamp, logLevel, transactionId, err);
    } catch (error) {
      console.error('Error parsing log entry:', error);
      console.error('Problematic log entry:', line);
      return null;
    }
  }
  
  
}
