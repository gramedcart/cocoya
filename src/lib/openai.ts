import { Configuration, OpenAIApi } from "openai";
import { env } from '$env/dynamic/private';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAIKEY,
});
export const openai = new OpenAIApi(configuration);
