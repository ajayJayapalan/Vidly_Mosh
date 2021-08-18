const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });

    it("should return genre of given id is valid ", async () => {
      const theGenre = await new Genre({
        name: "genre1",
      }).save();

      const res = await request(server).get(`/api/genres/${theGenre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", theGenre._id.toHexString());
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("should return 404 if the given id is invalid", async () => {
      const res = await request(server).get(
        `/api/genres/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });

    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "12" });

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
  });

  it("should return the genre if it is valid", async () => {
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name", "genre1");
  });
});
