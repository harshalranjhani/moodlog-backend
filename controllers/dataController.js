const axios = require("axios");
const OpenAI = require("openai");
const broadcastPrediction = require("../index.js");
console.log("broadcastPrediction", broadcastPrediction);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getSuggestions = async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).send({ error: "Mood is required" });
  }

  try {
    const suggestionResponse = await getSuggestion(mood);
    const suggestions = suggestionResponse.suggestions;

    res.status(200).send({
      suggestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get suggestion" });
  }
};

exports.predictMood = async (temperature, humidity) => {
  const prompt = `Given a body temperature of ${temperature}°C and a humidity level of ${humidity}%, predict the user's mood. Provide the mood in one word, a subtitle as a one-line message about the mood, and an icon from the following list:
  [
    'happy-outline',
    'sad-outline',
    'rocket-outline',
    'alert-circle',
    'warning-outline',
    'leaf-outline'
  ]. Format the response as:
  [mood]
  [subtitle]
  [icon]`;
  

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    model: "gpt-4",
  });

  const moodText = completion.choices[0].message.content;
  const moodParts = moodText.split("\n");
  const mood = moodParts[0].trim();
  const subtitle = moodParts[1]?.trim();
  const icon = moodParts[2]?.trim();

  return { mood, subtitle, icon };
};

const getSuggestion = async (mood) => {
  const prompt = `Based on the mood "${mood}", suggest some activities or ideas for what to do next. Provide a detailed and formatted list of suggestions in html format. Provide html format and nothing else with proper formatting for headings, lists, etc.`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    model: "gpt-4",
  });

  const suggestionText = completion.choices[0].message.content;
  const suggestions = suggestionText
    .split("\n")
    .filter((line) => line.trim() !== "");

  return { suggestions };
};
