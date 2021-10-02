import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
    name: string;
    password: string;
    salt: string;
}

// Not necessary
// export interface UserDoc extends Document {
//     name: string,
//     password: string,
//     salt: string,
// }

export interface UserModelInterface extends Model<IUser> {
    // addition query methods go here
    validatePassword(password: string) : boolean;
}

const userSchema = new Schema<IUser, UserModelInterface>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
});

// This uses the default connection - mongoose.connection
const User = mongoose.model<IUser, UserModelInterface>("users", userSchema);

export default User;
