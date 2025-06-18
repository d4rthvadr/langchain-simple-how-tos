import dotenv from "dotenv";

dotenv.config();

const config = {
  openAIApiKey: process.env.OPENAI_API_KEY || "",
};

export default config;
