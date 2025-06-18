import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import "./config.js";
const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  maxTokens: 500,
});

// Documents to be used as context
const documentA = new Document({
  pageContent: "LCEL stands for LangChain Enhanced Language model.",
});

const documentB = new Document({
  pageContent:
    "LangChain is a framework for developing applications powered by language models.",
});

const prompt = ChatPromptTemplate.fromTemplate(
  `Retrieve the answer to the question: {question}. 
  By using the following context: {context}`
);

//const chain = prompt.pipe(model);
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});

const response = await chain.invoke({
  //   question: "What is LCEL?",
  question: "What is LangChain?",
  context: [documentA, documentB],
});

console.log("LLM Response:", response);
