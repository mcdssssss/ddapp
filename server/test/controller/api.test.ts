import { createApp, close, createHttpRequest } from "@midwayjs/mock";
import { Framework } from "@midwayjs/web";
import { Application } from "egg";

describe("test/controller/api.test.ts", () => {
  let app: Application;

  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it("should POST /api/get_user", async () => {
    // make request
    const result = await createHttpRequest(app)
      .post("/api/get_user")
      .query({ uid: 123 });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("OK");
  });
});
