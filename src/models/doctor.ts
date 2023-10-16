// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
export const doctorVerifyEnum: string[] = ["medical_serial"];

const doctorSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    medical_serial: String,
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    verify: { type: [String], enum: doctorVerifyEnum },
    description: {
        biography: String,
        achievement: String,
        record_executive: String,
        record_scientific: String
    }
});
// added crerate & update time in document
doctorSchema.plugin(timeStamp);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;