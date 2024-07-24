const axios = require("axios");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.receiveData = async (req, res) => {
  const { temperature, humidity } = req.body;

  if (!temperature || !humidity) {
    return res
      .status(400)
      .send({ error: "Temperature and humidity are required" });
  }

  try {
    res
      .status(200)
      .send({ message: "Data received successfully", temperature, humidity });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to receive data" });
  }
};

exports.predict = async (req, res) => {
  const { temperature, humidity } = req.body;

  if (!temperature || !humidity) {
    return res
      .status(400)
      .send({ error: "Temperature and humidity are required" });
  }

  try {
    const mood = await predictMood(temperature, humidity);
    const suggestion = await getSuggestion(mood?.message?.content);

    res
      .status(200)
      .send({
        mood: mood?.message?.content,
        suggestion: suggestion?.message?.content,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Failed to predict mood and get suggestion" });
  }
};

const predictMood = async (temperature, humidity) => {
  const prompt = `Based on a body temperature of ${temperature}°C and a humidity level of ${humidity}%, predict the user's mood.`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
  });

  const mood = completion.choices[0];
  return mood;
};

const getSuggestion = async (mood) => {
  const prompt = `Based on the mood "${mood}", suggest some activities or ideas for what to do next.`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
  });

  const suggestion = completion.choices[0];
  return suggestion;
};
