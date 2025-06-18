import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";
import config from "./config.js";
import z from "zod";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  maxTokens: 500,
  temperature: 0.7,
  openAIApiKey: config.openAIApiKey,
});

async function callStringOutputParser(input) {
  // Define a prompt template
  const prompt = ChatPromptTemplate.fromMessages(
    ["system", "Tell me a joke about a word {input}"],
    ["human", "{input}"]
  );

  // Create parser
  const parser = new StringOutputParser();

  // create a chain
  const chain = prompt.pipe(model).pipe(parser);

  // Invoke the chain with input
  return chain.invoke({ input });
}

async function callStructuredOutputParser(phrase) {
  // Define a prompt template
  const prompt = ChatPromptTemplate.fromTemplate(
    `
    Extract information from the following phrase. 
    Formatting Instructions: {format_instructions}
    Phrase: {phrase}`
  );

  // Create parser
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    age: "The age of the person in years",
  });

  // Create a chain
  const chain = prompt.pipe(model).pipe(outputParser);

  // Invoke the chain with input
  return chain.invoke({
    phrase,
    format_instructions: outputParser.getFormatInstructions(),
  });
}

async function callZodOutputParser(phrase) {
  // Define a prompt template
  const prompt = ChatPromptTemplate.fromTemplate(
    `
    Extract information from the following phrase. 
    Formatting Instructions: {format_instructions}
    Phrase: {phrase}`
  );

  // Create parser
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      recipe: z.string().describe("the name of recipe"),
      ingredients: z.array(z.string()).describe("ingredients"),
    })
  );

  // create a chain
  const chain = prompt.pipe(model).pipe(outputParser);

  // Invoke the chain with input
  return chain.invoke({
    phrase,
    format_instructions: outputParser.getFormatInstructions(),
  });
}

// const response = await callStringOutputParser("banana");
// const response = await callStructuredOutputParser(
//   "John is 30 years old and lives in New York."
// );
const response = await callZodOutputParser(
  "The recipe for chicken ramen includes chicken, noodles, and broth."
);

console.log("LLM Response 1:", response);
