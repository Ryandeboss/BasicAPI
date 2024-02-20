const express = require("express");
// const bodyParser = require('body-parser')
const mongoose = require("mongoose"); // mongoose
const asyncHandler = require("express-async-handler");

const ArticleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const connectToDb = asyncHandler(async () => {
  await mongoose.connect("mongodb://localhost/WikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
});

connectToDb();

const Articles = mongoose.model("Article", ArticleSchema);

function FindArticle(T) {
  return;
}

const app = express();
app.use(express.urlencoded({ extended: true })); // replaces body parser
app.use(express.json()); // replaces body parser
app.use(express.static("public")); // enables ejs
app.set("view engine", "ejs");

////////////////////////////////////////////// Request targeting all articles

app.get("/articles", function (req, res) {
  Articles.find()
    .exec()
    .then((results) => res.send(results))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to fetch articles.");
    });
});

app.post("/articles", function (req, res) {
  const newArticle = new Articles({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle
    .save()
    .then(() => {
      console.log("Saved Document");
      res.status(201).send("Document saved successfully!");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to save document.");
    });
});

app.delete("/articles", function (req, res) {
  Articles.deleteMany()
    .exec()
    .then(() => {
      console.log("Deleted Everything");
      res.status(204).send(); // 204 No Content
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to delete articles.");
    });
});

////////////////////////////////////////////// Request targeting a specific articles

app
  .route("/articles/:title")

  .get(function (req, res) {
    var Query = req.params.title;
    Articles.findOne({ title: Query })
      .then((results) => {
        res.send(results);
        console.log(results);
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  })

  .put(function (req, res) {
    var Query = req.params.title;

    Articles.updateOne(
      { title: Query },
      { title: req.body.title, content: req.body.content }
    )
      .exec()
      .then(() => {
        res.send("Updated");
        console.log("Updated");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  })

  .patch(function (req, res) {
    Articles.updateOne({ title: req.params.title }, { $set: req.body })
      .exec()
      .then(() => {
        res.send("Patched");
        console.log("Patched");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  })
  .delete(function (req, res) {
    Articles.deleteOne({ title: req.params.title })
      .exec()
      .then(() => {
        res.send(req.params.title + " deleted");
        console.log(req.params.title + " deleted");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  });

app.listen(3000, function (req, res) {
  console.log("Server started on port 3000");
});
