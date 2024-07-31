const axios = require("axios");
const OpenAI = require("openai");
const broadcastPrediction = require("../index.js");
console.log("broadcastPrediction", broadcastPrediction);
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    res.status(200).send({
      suggestionResponse,
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
    'alert-outline',
    'warning-outline',
    'leaf-outline'
  ]. Format the response as:
  Mood: [mood]
  Subtitle: [subtitle]
  Icon: [icon]`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
  });

  const moodText = completion.choices[0].message.content;

  // Parsing the response to extract mood, subtitle, and icon
  const mood = moodText.match(/Mood:\s*(.*)/)?.[1]?.trim();
  const subtitle = moodText.match(/Subtitle:\s*(.*)/)?.[1]?.trim();
  const icon = moodText.match(/Icon:\s*(.*)/)?.[1]?.trim();

  return { mood, subtitle, icon };
};



const getSuggestion = async (mood) => {
  // const prompt = `Based on the mood "${mood}", suggest some activities or ideas for what to do next. Provide a detailed and formatted list of suggestions. Maximum 3 points. Do not mention anything other than the 3 points.`;

  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     { role: "system", content: "You are a helpful assistant." },
  //     { role: "user", content: prompt },
  //   ],
  //   model: "gpt-4o-mini",
  // });

  // const suggestionText = completion.choices[0].message.content;
  // console.log(suggestionText)

  // return { suggestionText };
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Based on the mood "${mood}", suggest some activities or ideas for what to do next. Provide a detailed and formatted list of suggestions. Maximum 3 points. Do not mention anything other than the 3 points. Specify atmost 3 subpoints for each of those 3 points. Make the subpoint headings brief. And the subpoint description should also be short. Do not provide any headings.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestionText = response.text();
    console.log(suggestionText);

    return { suggestionText };
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
};
