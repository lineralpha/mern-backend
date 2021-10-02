import Joi from "joi";

const schema = Joi.object({
    username: Joi.string().min(6).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9@#$%^&*.~!]{}$")),
});
