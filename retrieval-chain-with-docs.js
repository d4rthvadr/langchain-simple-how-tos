import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "./config.js";

// Source -> Load -> Split(Transform) -> Embed -> Store -> Retrieve
const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  maxTokens: 500,
});

const prompt = ChatPromptTemplate.fromTemplate(
  `Retrieve the answer to the question: {input}.
  By using the following context: {context}`
);

//const chain = prompt.pipe(model);
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});

// Load documents from a web page
// You can replace the URL with any other web page you want to scrape
const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/introduction/"
);

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await textSplitter.splitDocuments(docs);
const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

const retriever = vectorStore.asRetriever({
  k: 2,
});

const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

console.log("Loading documents from the web...", retriever);

const response = await retrievalChain.invoke({
  input: "What is LangChain?",
});

console.log("LLM Response:", response);
