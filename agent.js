import "./config.js";
import { ChatOpenAI } from "@langchain/openai";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createInterface } from "readline";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { createRetrieverTool } from "langchain/tools/retriever";

const createVectorStore = async () => {
  // Load documents from a web page
  // You can replace the URL with any other web page you want to scrape
  const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/docs/introduction/"
  );

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);

  const validDocs = splitDocs.filter((doc) => doc && doc.pageContent);
  const embeddings = new OpenAIEmbeddings();

  return MemoryVectorStore.fromDocuments(validDocs, embeddings);
};

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-1106",
  temperature: 0.2,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant called Gabby."],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const vectorStore = await createVectorStore();

const retriever = vectorStore.asRetriever({
  k: 2,
});

const retrievalTool = createRetrieverTool(retriever, {
  name: "langchain_retriever",
  description:
    "Use this tool to retrieve relevant documents from a vector store based on the user's query. It can be used to answer questions by providing context from the retrieved documents.",
});

// Create and assign tools
const tools = [new TavilySearchResults(), retrievalTool];

const agent = await createOpenAIFunctionsAgent({
  llm: model,
  prompt,
  tools,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

const r1 = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chatHistory = [];

const defaultQuestion = "Ask me anything: ";
const getNextQuestion = (question) =>
  question?.trim() ? `${question}: ` : defaultQuestion;

const askQuestion = (lineQuestion = defaultQuestion) => {
  r1.question(lineQuestion, async (question) => {
    if (question.trim() === "") {
      return askQuestion("Please ask a valid question: ");
    }

    if (question.toLowerCase() === "quit") {
      console.log("Quitting...");
      r1.close();
      return;
    }

    const response = await agentExecutor.invoke({
      input: question,
      chat_history: chatHistory,
    });

    chatHistory.push(
      ...[new HumanMessage(question), new AIMessage(response.output)]
    );
    console.log("Response from agent:", response);
    askQuestion(getNextQuestion(response.output));
  });
};

askQuestion();
