import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const todoSchema = mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: new Date().getTime().toString(),
  },
  created_by: {
    type: String,
    required: true,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
});

// create a method which will remove the password from the response
todoSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

// todoSchema.statics.checkDuplicateTodo = async function (todo, created_by) {
//   const existingTodo = await this.findOne({ todo, created_by });
//   return existingTodo;
// };

// todoSchema.statics.passwordMatch = async function (password, id) {
//   const existingUser = await this.findOne({ id });
//   return bcrypt.compareSync(password, existingUser.password);
// };

// encrypt the password before saving the user
// todoSchema.pre("save", function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = bcrypt.hashSync(this.password, 10);
//   next();
// });

const Todo = mongoose.model("todos", todoSchema);

export default Todo;
