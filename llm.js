import { ChatOpenAI } from "@langchain/openai";

import config from "./config.js";
const llm = new ChatOpenAI({
  model: "gpt-4o",
  maxTokens: 50,
  temperature: 0.7,
  openAIApiKey: config.openAIApiKey,
});

const response = await llm.invoke("Hello, how are you?");

console.log("LLM Response 1:", response);
console.log("LLM Response 1.1:", response.text);
