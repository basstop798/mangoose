/**************************************************
 * Import required packages
 **************************************************/
const mongoose = require("mongoose");
require("dotenv").config();

/**************************************************
 * Connect to MongoDB Atlas using Mongoose
 **************************************************/
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**************************************************
 * Create Person Schema
 * - name is required
 * - age is a Number
 * - favoriteFoods is an array of Strings
 **************************************************/
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // name is mandatory
  },
  age: Number,
  favoriteFoods: [String],
});

/**************************************************
 * Create Person Model
 **************************************************/
const Person = mongoose.model("Person", personSchema);

/**************************************************
 * Create and Save a Single Person
 **************************************************/
const person = new Person({
  name: "John Doe",
  age: 25,
  favoriteFoods: ["pizza", "pasta"],
});

person.save(function (err, data) {
  if (err) return console.error(err);
  console.log("Person saved:", data);
});

/**************************************************
 * Create Many Records using Model.create()
 **************************************************/
const arrayOfPeople = [
  { name: "Mary", age: 22, favoriteFoods: ["burritos", "salad"] },
  { name: "Ali", age: 30, favoriteFoods: ["couscous", "burritos"] },
  { name: "Sarah", age: 19, favoriteFoods: ["pizza"] },
];

Person.create(arrayOfPeople, function (err, data) {
  if (err) return console.error(err);
  console.log("Multiple people added:", data);
});

/**************************************************
 * Find all people with a given name
 **************************************************/
Person.find({ name: "Mary" }, function (err, data) {
  if (err) return console.error(err);
  console.log("People named Mary:", data);
});

/**************************************************
 * Find ONE person who likes a specific food
 **************************************************/
const food = "burritos";

Person.findOne({ favoriteFoods: food }, function (err, data) {
  if (err) return console.error(err);
  console.log("Person who likes burritos:", data);
});

/**************************************************
 * Find a person by ID
 **************************************************/
const personId = "PUT_PERSON_ID_HERE";

Person.findById(personId, function (err, data) {
  if (err) return console.error(err);
  console.log("Found by ID:", data);
});

/**************************************************
 * Classic Update: Find → Edit → Save
 * Add "hamburger" to favoriteFoods
 **************************************************/
Person.findById(personId, function (err, person) {
  if (err) return console.error(err);

  person.favoriteFoods.push("hamburger");

  person.save(function (err, updatedPerson) {
    if (err) return console.error(err);
    console.log("Updated person:", updatedPerson);
  });
});

/**************************************************
 * Update using findOneAndUpdate()
 * Set age to 20 and return updated document
 **************************************************/
const personName = "Ali";

Person.findOneAndUpdate(
  { name: personName },
  { age: 20 },
  { new: true }, // return updated document
  function (err, data) {
    if (err) return console.error(err);
    console.log("Age updated:", data);
  }
);

/**************************************************
 * Delete ONE person by ID
 **************************************************/
Person.findByIdAndRemove(personId, function (err, data) {
  if (err) return console.error(err);
  console.log("Deleted person:", data);
});

/**************************************************
 * Delete MANY people named "Mary"
 **************************************************/
Person.remove({ name: "Mary" }, function (err, result) {
  if (err) return console.error(err);
  console.log("Delete result:", result);
});

/**************************************************
 * Chain Search Query Helpers
 * - Find people who like burritos
 * - Sort by name
 * - Limit to 2 results
 * - Hide age field
 **************************************************/
Person.find({ favoriteFoods: "burritos" })
  .sort({ name: 1 })
  .limit(2)
  .select("-age")
  .exec(function (err, data) {
    if (err) return console.error(err);
    console.log("Chained query result:", data);
  });
