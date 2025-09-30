import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Show form on home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Joke form submission route
app.post("/get-jokes", async (req, res) => {
  try {
    let { categoryType, categories, language, flags, jokeType, amount } = req.body;

    // Ensure checkboxes come back as arrays
    if (!Array.isArray(categories) && categories) categories = [categories];
    if (!Array.isArray(flags) && flags) flags = [flags];
    if (!Array.isArray(jokeType) && jokeType) jokeType = [jokeType];

    // Handle category
    let categoryPart = "Any";
    if (categoryType === "custom" && categories && categories.length > 0) {
      categoryPart = categories.join(",");
    }

    // Start building API URL
    let url = `https://v2.jokeapi.dev/joke/${categoryPart}?lang=${language}`;

    // Blacklist flags
    if (flags && flags.length > 0) {
      url += `&blacklistFlags=${flags.join(",")}`;
    }

    // Joke type
    if (jokeType && jokeType.length > 0) {
      url += `&type=${jokeType.join(",")}`;
    }

    // Amount of jokes
    if (amount) {
      url += `&amount=${amount}`;
    }

    console.log("Requesting:", url);

    // Fetch jokes with axios
    const response = await axios.get(url);
    const data = response.data;

    // Render results
    res.render("jokes.ejs", { jokes: data });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error retrieving jokes");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
