const PORT = process.env.PORT || 8000;
var express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config({ path: ".env" });

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
console.log(process.env.OPENAI_API_KEY);

app.post(`${process.env.API_LINK}`, async (req, res) => {
  const question = req.body.question;
  console.log("question: ", question);

  try {
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      })
      .then((response) => {
        if (response.data.length == 0) {
          res.status(200).send([
            {
              status: 200,
              error: "No data found",
            },
          ]);
        } else {
          res.status(200).send(response.data);
        }
      });
  } catch (err) {
    res.send([
      {
        status: err.status,
        error: err.messages,
      },
    ]);
  }
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`server running on PORT ${PORT}`)
);
