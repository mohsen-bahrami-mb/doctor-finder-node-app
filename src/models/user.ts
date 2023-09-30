// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
export const userVerifyEnum: string[] = ["phone", "email", "national_code"];
export const userRoleEnum: string[] = ["owner", "admin", "user", "doctor"];

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    first_name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    last_name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    national_code: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: [String], required: true, default: ["user"], enum: userRoleEnum, index: true },
    verify: { type: [String], enum: userVerifyEnum },
    profile_photo: {
        type: String, default: "/profile-photo/profile-photo.png",
        set: (p: string): string => p.replace(/\\/g, "/").replace(/(^public)(\/.*)/g, "$2")
    },
    birth_date: Date,
    country: String,
    city: String,
    description: String
});
// added crerate & update time in document
userSchema.plugin(timeStamp);

const User = mongoose.model("User", userSchema);
export default User;