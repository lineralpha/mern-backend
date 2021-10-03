import mongoose, { Schema, Document, Model } from "mongoose";
import { generatePassword, validatePassword } from "../utils/passwordUtil"

export interface IUserProfile {
    firstName: string;
    lastName: string;
    middleInitial?: string;
    avatar?: string;
    address: {
        street1: string;
        street2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface IUser {
    username: string;
    email: string;
    password: string;
    salt: string;
    profile: IUserProfile;

    // Instance methods need to go with the document type
    validatePassword(password: string): boolean;
}

export type UserDoc = Document & IUser;

export interface UserModelInterface extends Model<UserDoc> {
    // Add static methods for the model here
    myStaticMethod(): number;
}

const userSchema = new Schema<UserDoc, UserModelInterface>({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleInitial: String,
        avatar: String,
        address: {
            street1: String,
            street2: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
    },
});

// Implement static methods this way
userSchema.static("myStaticMethod", function myStaticMethod() {
    return 42;
});

// Implement instance methods - do not use arrow function since it explicitly prevent binding `this`.
userSchema.methods.validatePassword = function (password: string) {
    return validatePassword(password, this.password, this.salt);
};

const User = mongoose.model<UserDoc, UserModelInterface>("User", userSchema);

export default User;
