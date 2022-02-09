const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: { type: String, required: false, max: 50, unique: true },
  password: { type: String, required: true, max: true, min: 6 },
  image: {
    type: String,
    default: function () {
      return `https://joeschmoe.io/api/v1/${this.username}`;
    },
  },
  // jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobs" }],
  createAt: {
    type: Date,
    default: Date.now,
  },
  //   role: { type: String, enum: ["admin", "user"] },
});
const UserCollection = mongoose.model("user", usersSchema);
module.exports = UserCollection;
