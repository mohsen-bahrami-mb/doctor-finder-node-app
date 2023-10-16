// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

const visitSchema = new mongoose.Schema({
    client_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    doctor_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    clinick_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", index: true, required: true },
    clinick_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clinick", index: true, required: true },
    date: { type: Date, index: true, required: true },
    hour: {
        start: {
            type: String,
            index: true,
            required: true
        },
        end: {
            type: String,
            index: true,
            required: true
        }
    },
});
// added crerate & update time in document
visitSchema.plugin(timeStamp);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;