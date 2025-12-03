const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Confession = require("./models/Confession");
const Comment = require("./models/Comment"); // MUST ADD THIS LIN
const app = express();
//app.use(cors());
app.use(express.json());


app.use(cors({
  origin: 'http://localhost:3000', // Your React app's address
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Better error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const MONGO_URI = "mongodb+srv://azios111:b4HjNQRqWZaLo12v@azios.7l0tqqc.mongodb.net/";

// mongoose.connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB connect error:", err));

//   app.get("/", (req, res) => {
//     res.send("✅ Server is running!");
//   });

  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
  
  // Add error handling middleware
  // app.use((err, req, res, next) => {
  //   console.error(err.stack);
  //   res.status(500).send('Something broke!');
  // });

// Lấy danh sách confession
app.get('/api/confessions', async (req, res) => {
  const list = await Confession.find().sort({ createdAt: -1 });
  res.json(list);
});

app.get('/api/comments/:confessionId', async (req, res) => {
  try {
    const comments = await Comment.find({ confessionId: req.params.confessionId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("❌ Failed to fetch comments:", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
});


app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});


// Gửi confession mới
app.post('/api/confessions', async (req, res) => {
  const newConfession = new Confession({ text: req.body.text });
  await newConfession.save();
  res.json(newConfession);
});

// Thả reaction
app.post('/api/confessions/:id/react', async (req, res) => {
  const { type } = req.body; // like, haha, wow, sad
  const confession = await Confession.findById(req.params.id);
  if (confession && confession.reactions[type] !== undefined) {
    confession.reactions[type]++;
    await confession.save();
    res.json(confession);
  } else {
    res.status(400).json({ error: 'Invalid reaction type' });
  }
});

// Gửi bình luận


app.post('/api/comments', async (req, res) => {
  const comment = new Comment({
    confessionId: req.body.confessionId,
    text: req.body.text,
  });
  await comment.save();
  res.json(comment);
});

// Lấy bình luận theo confession
// app.get('/api/comments/:confessionId', async (req, res) => {
//   const comments = await Comment.find({ confessionId: req.params.confessionId }).sort({ createdAt: -1 });
//   res.json(comments);
// });

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));

//kGBdUjJe4sESn8A2

//b4HjNQRqWZaLo12v