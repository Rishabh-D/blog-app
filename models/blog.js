const mongoose = require("mongoose");

const Schmea = mongoose.Schema;

const blogSchema = new Schmea(
  {
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// name has to be same as database present on the server (mongodb)
//remember to name it in lowercase always. else mongoose will create a new database
const Blog = mongoose.model("financeblogs", blogSchema);

module.exports = Blog;
