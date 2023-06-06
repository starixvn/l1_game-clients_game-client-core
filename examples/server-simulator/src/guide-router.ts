import * as express from "express";
const guideRouter = express.Router();

guideRouter.get("/*", (req, res) => {
    res.send(`this is game guide, query= ${JSON.stringify(req.query)}`);
});

export default guideRouter;
