const stepTestRouter = require("express").Router();
const stepTestController = require("../controllers/stepTestController");
const upload = require("../config/multerConfig");
const authenticateToken = require('../middleware/auth');

stepTestRouter.post(
  "/",
  upload.array("images", 5),
  stepTestController.createStepTest
);

stepTestRouter.get("/info",authenticateToken, stepTestController.getStepTestInfo);
stepTestRouter.get("/", stepTestController.listStepTest);
stepTestRouter.get("/:id", stepTestController.getStepTestById);

stepTestRouter.put(
  "/:id",
  upload.array("images", 5),
  stepTestController.updateStepTest
);

stepTestRouter.delete("/:id", stepTestController.deleteStepTest);
module.exports = stepTestRouter;
