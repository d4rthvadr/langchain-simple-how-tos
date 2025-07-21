# Lang-Chain Project

This project integrates OpenAI's GPT models using the LangChain library. To get started, ensure you have your OpenAI API key set up correctly.

## Setup Instructions

1. Clone the repository:

   ```shell
   git clone <repository-url>
   cd langchain-simple-how-tos
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Configure your OpenAI API key:

   - Create a `.env` file in the root directory (if not already present).
   - Add the following line to the `.env` file:
     ```env
     OPENAI_API_KEY=your_openai_api_key_here
     ```
     Alternatively, you can use the [`.env.example`](.env.example) file as a template.

4. Export the API key in your shell (optional):
   ```shell
   export OPENAI_API_KEY=your_openai_api_key_here
   ```

## How to Get Your OpenAI API Key

1. Visit the [OpenAI API Keys page](https://platform.openai.com/account/api-keys).
2. Log in with your OpenAI account credentials. (Create one if you don't have an account)
3. Click on the "Create new secret key" button.
4. Copy the generated API key and store it securely.

> **Note:** Keep your API key private and do not share it publicly. If your key is compromised, you can revoke it and generate a new one from the same page.

## How to Sign Up and Generate a Tavily API Key

1. Visit the [Tavily API Signup Page](https://tavily.ai/signup).
2. Create an account by providing your email address and setting a password.
3. Verify your email address by clicking on the verification link sent to your inbox.
4. Log in to your Tavily account.
5. Navigate to the "API Keys" section in your account dashboard.
6. Click on "Generate New API Key" and provide a name for the key (e.g., "LangChain Project").
7. Copy the generated API key and store it securely.

> **Note:** Keep your Tavily API key private and do not share it publicly. If your key is compromised, you can revoke it and generate a new one from the dashboard.

## Running Specific Use-Cases

To run specific use-cases, use the following commands:

### Basic Examples

- **LLM Integration**:

  ```shell
  node llm.js
  ```

  Demonstrates basic OpenAI model interaction and text generation.

- **Prompt Templates**:

  ```shell
  node prompt-templates.js
  ```

  Shows how to create and use structured prompt templates for consistent outputs.

- **Output Parsers**:
  ```shell
  node output-parsers.js
  ```
  Examples of parsing and structuring LLM responses using Zod schemas.

### Intermediate Examples

- **Document Retrieval**:

  ```shell
  node retrieval-chain.js
  ```

  Implements RAG (Retrieval-Augmented Generation) with web scraping and vector search.

- **Retrieval with Documents**:

  ```shell
  node retrieval-chain-with-docs.js
  ```

  Advanced document retrieval with multiple document sources.

- **Memory-based Retrieval**:
  ```shell
  node retrieval-chain-with-docs-and-memory.js
  ```
  Combines document retrieval with conversation memory.

### Advanced Examples

- **Agent with Memory**:

  ```shell
  node agent-with-memory.js
  ```

  Shows persistent conversation memory using Redis/Upstash for stateful interactions.

- **Agent with Tools**:

  ```shell
  node agent.js
  ```

  Building intelligent agents that can use external tools like Tavily for enhanced capabilities.

- **Caching**:
  ```shell
  node cache.js
  ```
  Demonstrates response caching for improved performance.

### Prerequisites

- **Basic Examples**: Only require OpenAI API key
- **Advanced Examples with Memory**: Require Redis setup or Upstash account
- **Tool-based Examples**: May require additional API keys (e.g., Tavily)

Each command corresponds to a specific functionality in the project. Ensure that all dependencies are installed and the `.env` file is properly configured before running these commands.

## Dependencies

- **@langchain/tavily**: Integrates Tavily as a tool for building agents and processing user inputs.
- **zod**: Provides schema validation and type safety for inputs and outputs.
- **cheerio**: Used for web scraping and parsing HTML documents.
- **@langchain/openai**: Provides integration with OpenAI's GPT models.
- **langchain**: Core library for building chains and agents.

Ensure these dependencies are installed before running the project.

## Notes

- Ensure your OpenAI API key has the necessary permissions to access GPT models.
- The default model used is `gpt-4o` with a maximum token limit of 1000.

For more information, refer to the [LangChain documentation](https://docs.langchain.com/) and [OpenAI API documentation](https://platform.openai.com/docs/).
