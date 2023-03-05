const PORT = process.env.PORT || 8000;
var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: ".env" });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
console.log(process.env.OPENAI_API_KEY);

app.get(`${process.env.API_LINK}`, (req, res) => {
  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.question }],
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
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`server running on PORT ${PORT}`)
);
