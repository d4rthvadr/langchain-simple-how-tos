import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import config from "./config.js";
const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  maxTokens: 500,
  temperature: 0.7,
  openAIApiKey: config.openAIApiKey,
});

// Define a prompt template
const prompt = ChatPromptTemplate.fromMessages(
  ["system", "How to cook {meal}"],
  ["user", "{meal}"]
);

// create a chain
const chain = prompt.pipe(model);
const response = await chain.invoke({ meal: "chicken ramen" });
console.log("LLM Response 1:", response.text);
