import "./config.js";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import { client } from "./cache.js";

client
  .ping()
  .then((response) => {
    console.log("Redis connection successful:", response);
  })
  .catch((error) => {
    console.error("Error connecting to Redis:", error);
    process.exit(1);
  });

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-1106",
  temperature: 0.2,
});

const prompt = ChatPromptTemplate.fromTemplate(
  `
    You are a helpful assistant called Gabby.
    History: {history}
    {input}
    `
);

const upstashChatHistory = new UpstashRedisChatMessageHistory({
  sessionId: "session-agent-with-memory",
  client,
});

const memory = new BufferMemory({
  memoryKey: "history",
  chatHistory: upstashChatHistory,
});

const chain = new ConversationChain({
  llm: model,
  prompt,
  memory,
});

// const composedChain = RunnableSequence.from([
//   {
//     input: (initialInput) => initialInput.input,
//     memory: () => memory.loadMemoryVariables(),
//   },
//   {
//     input: (previousOutput) => previousOutput.input,
//     history: (previousOutput) => previousOutput?.memory?.history || [],
//   },
//   model,
//   prompt,
// ]);

const inputs = [
  // {
  //   input: "hello there?",
  // },
  // {
  //   input: "The passphrase is HELLOWORLD",
  // },
  // {
  //   input: "What is LangChain?",
  // },

  {
    input: "What is the passphrase?",
  },
];

async function chainResponses() {
  for (const [index, input] of inputs.entries()) {
    console.log(`memory: ${index + 1}`, await memory.loadMemoryVariables());
    const response = await chain.invoke(input);
    console.log(`input: ${input.input} | response: ${index + 1}`, response);
    // await memory.saveContext({
    //   output: response.content,
    // });
    console.log("---"); // Add separator for clarity
  }
}

await chainResponses();
