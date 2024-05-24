const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userAuthSchema = new mongoose.Schema({
  // fullName: {
  //   type: String,
  //   require: true,
  // },
  // {
//     "version": 2,
//     "builds": [
//       { "src": "index.js", "use": "@vercel/node" }
//     ],
//     "routes": [
//       { "src": "/(.*)", "dest": "/" }
//     ]
//   }
  
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (email) {
        const user = await this.constructor.findOne({ email });
        return !user;
      },
      message: "Email sudah digunakan",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  token: {
    type: String,
    default: null,
  },
});

userAuthSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userAuthSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw new Error("Email dan Password harus diisi");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email tidak valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password harus terdiri dari setidaknya 8 karakter, termasuk huruf besar, huruf kecil, angka, dan simbol"
    );
  }
  // if (!validator.isEmpty(fullName)) {
  //   throw new Error("Nama Lengkap wajib diisi");
  // }

  return this.create({ email, password });
};

userAuthSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Email atau Password tidak boleh kosong");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Password Salah");
  }

  return user;
};

const User = mongoose.model("User", userAuthSchema);

module.exports = User;
