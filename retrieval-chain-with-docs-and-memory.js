import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import "./config.js";

// Source -> Load -> Split(Transform) -> Embed -> Store -> Retrieve

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

const createChain = async (vectorStore) => {
  const model = new ChatOpenAI({
    model: "gpt-3.5-turbo",
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `
    Retrieve the answer to the question: {input}. 
    By using the following context: {context}.
    Chat history: {chat_history}
    `
  );

  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  const retrieverOrRephrasePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to retrieve relevant documents to the conversations.",
    ],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: retrieverOrRephrasePrompt,
  });

  const conversationChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: historyAwareRetriever,
  });

  return conversationChain;
};

const vectorStore = await createVectorStore();

const chain = await createChain(vectorStore);

// Chat history

const chatHistory = [
  new HumanMessage("hi, how are you?"),
  new HumanMessage("Hi, my name is Luffy"),
  new AIMessage("How can I assist you today, Luffy?"),
  new HumanMessage("What is LangChain?"),
  new AIMessage(
    "LangChain is a framework for developing applications powered by language models."
  ),
  new HumanMessage("What can I do with it?"),
  new AIMessage(
    "You can build applications like chatbots, question-answering systems, and more using LangChain."
  ),
  new HumanMessage("How does it work?"),
  new AIMessage(
    "LangChain works by combining language models with various components like retrievers, memory, and chains to create complex applications."
  ),
];

const response = await chain.invoke({
  // input: "It also uses memory?",
  // input: "what is my name?",
  input: "what is my name and age?",
  chat_history: chatHistory,
});

console.log("LLM Response:", response);
