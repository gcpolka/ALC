const express = require("express");
const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const pipeRouter = require("./pipeRoutes");
const caseRouter = require("./caseRoutes");
const stepTestRouter = require("./stepTestRoutes");

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/pipe", pipeRouter);
rootRouter.use("/case", caseRouter);
rootRouter.use("/step-test", stepTestRouter);
module.exports = rootRouter;
