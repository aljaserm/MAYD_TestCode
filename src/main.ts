import { LogParser } from "./LogParser";
import { Command } from "commander";

const program = new Command();

program
  .option("-i, --input <path>", "Input log file path")
  .option("-o, --output <path>", "Output file path");

program.parse(process.argv);

const options = program.opts();
const inputFilePath = options.input;
const outputFilePath = options.output;

if (!inputFilePath || !outputFilePath) {
  console.error("Please provide input and output file paths");
  process.exit(1);
}

const logParser = new LogParser();
const logEntries = logParser.readLogFile(inputFilePath);
const errorLogs = logParser.filterErrorLogs();
logParser.writeErrorLogs(outputFilePath);

console.log("Error logs written to the output file.");
