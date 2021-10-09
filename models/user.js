// import libs
const mongoose = require("mongoose");
const crypto = require("crypto");
const uuid = require("uuid");

// user schema

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    address: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: Number,
      minlength: 6,
      maxlength: 6,
    },
    transaction: {
      type: Array,
      default: [],
    },
    salt: String,
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual fields

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuid.v4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// user methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
