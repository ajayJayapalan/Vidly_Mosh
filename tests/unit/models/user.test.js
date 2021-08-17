const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user.generateAuthTOken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    expect(decoded).toMatchObject(payload);
  });
});
