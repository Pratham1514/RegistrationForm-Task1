import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.88y0yio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(
    "/Personal/Certificate_course/BharatIntern/RegistrationForm/pages/index.html"
  );
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      res.redirect("/existing");
    }
  } catch (error) {
    console.log(error);
    res.redirect("error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(
    "/Personal/Certificate_course/BharatIntern/RegistrationForm/pages/success.html"
  );
});

app.get("/error", (req, res) => {
  res.sendFile(
    "/Personal/Certificate_course/BharatIntern/RegistrationForm/pages/error.html"
  );
});

app.get("/existing", (req, res) => {
  res.sendFile(
    "/Personal/Certificate_course/BharatIntern/RegistrationForm/pages/existingUserError.html"
  );
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
