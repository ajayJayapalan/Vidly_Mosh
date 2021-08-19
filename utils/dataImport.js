const fs = require("fs");
require("../startup/db")();
const { Customer } = require("../models/customer");
const { Genre } = require("../models/genres");
const { Movie } = require("../models/movies");
const { Rental } = require("../models/rental");
const { User } = require("../models/users");

const importData = async (Collection) => {
  const data = await Collection.find();
  let json = JSON.stringify(data);

  fs.writeFile(
    `${__dirname}/${new Collection().constructor.modelName}.json`,
    json,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
  //process.exit();
};

const exportData = async (Collection) => {
  const datas = JSON.parse(
    fs.readFileSync(
      `${__dirname}/${new Collection().constructor.modelName}.json`,
      "utf-8"
    )
  );

  await Collection.create(datas);
  console.log("Data Successfully imported 👌");
  //process.exit();
};

const deleteData = async (Collection) => {
  await Collection.deleteMany({});
  console.log("Data successfully deleted");
  //process.exit();
};

const Col = [Customer, Genre, Movie, Rental, User];

if (process.argv[2] === "--import") {
  Col.forEach((i) => importData(i));
} else if (process.argv[2] === "--export") {
  Col.forEach((i) => exportData(i));
} else if (process.argv[2] === "--delete") {
  Col.forEach((i) => deleteData(i));
} else {
  console.log("please provide arguments --import || --export || --delete");
  process.exit();
}
