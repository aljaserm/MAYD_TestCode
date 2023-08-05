import { Command } from "commander";
import path from "path";
import { LogParser } from "./LogParser";

const program = new Command();

program
  .option("-i, --input <path>", "Input log file path")
  .option("-o, --output <path>", "Output file path");

program.parse(process.argv);

const options = program.opts();
const inputFilePath = options.input ? path.resolve(options.input) : path.join(__dirname, "../app.log");
const outputFilePath = options.output ? path.resolve(options.output) : path.join(__dirname, "../errors.json");

try {
  const logParser = new LogParser();
  const logEntries = logParser.readLogFile(inputFilePath);
  logParser.writeErrorLogs(outputFilePath);
  console.log("Error logs written to the output file.");
} catch (error) {
  console.error("An error occurred:", error);
  process.exit(1);
}
