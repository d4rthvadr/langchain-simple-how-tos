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

## Running Specific Use-Cases

To run specific use-cases, use the following commands:

- **Output Parsers**:

  ```shell
  node output-parsers.js
  ```

- **Prompt Templates**:

  ```shell
  node prompt-templates.js
  ```

- **LLM Integration**:
  ```shell
  node llm.js
  ```

Each command corresponds to a specific functionality in the project. Ensure that all dependencies are installed and the `.env` file is properly configured before running these commands.

## Dependencies

- [@langchain/openai](https://www.npmjs.com/package/@langchain/openai)
- [langchain](https://www.npmjs.com/package/langchain)

## Notes

- Ensure your OpenAI API key has the necessary permissions to access GPT models.
- The default model used is `gpt-4o` with a maximum token limit of 1000.

For more information, refer to the [LangChain documentation](https://docs.langchain.com/) and [OpenAI API documentation](https://platform.openai.com/docs/).
