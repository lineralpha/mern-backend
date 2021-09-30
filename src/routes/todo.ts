import express from "express";
import { StatusCodes } from "http-status-codes";
import { connectMongoDb, closeConnection } from "../db/dbConntion";
import Todo from "../models/todo";

const router = express.Router();

// GET 
router.get("/api/todo", async (req, res) => {
    console.log("get all");
    await connectMongoDb();
    const all = await Todo.find({});
    await closeConnection();

    // no need to return and shouldn't.
    // instead, call next() after this line if you want other handler to process this request.
    return res.status(StatusCodes.OK).json(all); //.send(all);
});

router.get("/api/todo/:id", async (req, res) => {
    console.log(`get one: ${req.params.id}`);
    await connectMongoDb();
    const one = await Todo.findOne({ _id: req.params.id });
    await closeConnection();

    return res.status(StatusCodes.OK).send(one);
});

// POST
router.post("/api/todo", async (req, res, next) => {
    const { title, description } = req.body;
    console.log("post ...")

    try {
        await connectMongoDb();

        const todo = new Todo({ title, description });
        await todo.save();

        // or:
        // const todo = await Todo.create({title, description})
        // await todo.save();

        // or:
        // const todo = Todo.build({title, description});
        // await todo.save();

        await closeConnection();
        return res.status(StatusCodes.CREATED).send(todo);
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            next();
        }
    }
});

export { router as todoRouter };
