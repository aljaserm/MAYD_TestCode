import { fsMock } from './fsMock';
import * as fs from 'fs';
import * as path from 'path';
import { LogParser } from '../src/LogParser';
import { LogEntry } from '../src/LogEntry';

jest.mock('fs', () => fsMock);

function parseLogEntry(logLine: string): LogEntry | null {
  const logEntryRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - (\w+) - (\w+) - (.*)/;
  const match = logLine.match(logEntryRegex);

  if (!match || match.length < 5) {
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
    return null;
  }
}

describe('LogParser', () => {
    const tempDir = path.join(process.cwd(), 'temp');
  
    beforeAll(() => {
      if (!fs.existsSync(tempDir)) {
        fsMock.mkdirSync(tempDir);
      }
    });
  
    afterAll(() => {
      if (fs.existsSync(tempDir)) {
        fsMock.rmdirSync(tempDir, { recursive: true });
      }
    });

    it('should read log file and parse valid log entries', () => {
        const logFilePath = path.join(__dirname, '..', 'test-data', 'validLogs.log');
        const logParser = new LogParser();
        const logEntries = logParser.readLogFile(logFilePath);
    
        // Assuming there are 3 log entries in the "validLogs.log" file
        expect(logEntries.length).toBe(3);
        expect(logEntries[0]).toBeInstanceOf(LogEntry);
        expect(logEntries[1]).toBeInstanceOf(LogEntry);
        expect(logEntries[2]).toBeInstanceOf(LogEntry);
      });


  it('should filter and write error logs to JSON file', () => {
    const logParser = new LogParser();
    const logEntries: LogEntry[] = [
      new LogEntry("2023-08-05 12:34:56", "error", "tx123", "Error 1"),
      new LogEntry("2023-08-05 13:45:21", "info", "tx456", "Info 2"),
      new LogEntry("2023-08-05 14:56:34", "error", "tx789", "Error 3"),
    ];

    logParser.setLogEntries(logEntries);

    const outputFilePath = path.join(tempDir, 'testErrors.json');
    logParser.writeErrorLogs(outputFilePath);

    const writtenData = fsMock.writtenFiles[outputFilePath];
    const parsedData = JSON.parse(writtenData);

    expect(parsedData.length).toBe(2);
    expect(parsedData[0].err).toBe('Error 1');
    expect(parsedData[1].err).toBe('Error 3');
  });

  it('should handle invalid log entry and return null', () => {
    const logLine = 'Invalid log entry';
    const parsedLogEntry = parseLogEntry(logLine);

    expect(parsedLogEntry).toBeNull();
  });


  it('should throw an error when trying to read non-existing log file', () => {
    const logFilePath = path.join(__dirname, '..', 'test-data', 'nonExistingFile.log');
    const logParser = new LogParser();

    expect(() => {
      logParser.readLogFile(logFilePath);
    }).toThrow();
  });

  it('should handle invalid log entry and return null', () => {
    const logLine = 'Invalid log entry';
    const parsedLogEntry = parseLogEntry(logLine);

    expect(parsedLogEntry).toBeNull();
  });

  it('should throw an error when trying to write to a directory without write permission', () => {
    const logParser = new LogParser();
    const logEntries: LogEntry[] = [
      new LogEntry("2023-08-05 12:34:56", "error", "tx123", "Error 1"),
    ];

    logParser.setLogEntries(logEntries);

    const outputDir = path.join(tempDir, 'noPermission');
    fsMock.mkdirSync(outputDir, { mode: 0o444 }); // Create a read-only directory

    const outputFilePath = path.join(outputDir, 'testErrors.json');

    expect(() => {
      logParser.writeErrorLogs(outputFilePath);
    }).toThrow();
  });
});
