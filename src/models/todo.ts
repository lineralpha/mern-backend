import Mongoose from "mongoose";

// 1. create a schema matching the model (the document interface).
const todoSchema = new Mongoose.Schema<TodoDoc, TodoModelInterface>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

// 2. define the model interfaces (ensure all the interfaces line up with the schema)

// 2.1. an interface representing business entity
export interface ITodo {
    title: string;
    description: string;
}

// 2.2. an interface representing a document in mongodb
export interface TodoDoc extends Mongoose.Document {
    title: string;
    description: string;
}

// 2.3. an interface representing the model
export interface TodoModelInterface extends Mongoose.Model<TodoDoc> {
    build(attr: ITodo): TodoDoc;
}

// 3. define the model.
const Todo = Mongoose.model<TodoDoc, TodoModelInterface>("Todo", todoSchema);

// https://mongoosejs.com/docs/guide.html#statics
// doesn't seem to work!?
todoSchema.statics.build = function (attr: ITodo) {
    return new Todo(attr);
};

export default Todo;
