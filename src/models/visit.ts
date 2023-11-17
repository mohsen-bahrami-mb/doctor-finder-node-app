// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

export const visitStateEnum: string[] = ["create", "set", "cancel", "done"];

const visitSchema = new mongoose.Schema({
    client_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    doctor_id: { type: [mongoose.Schema.Types.ObjectId], ref: "Doctor", index: true, required: true },
    clinick_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clinick", index: true, required: true },
    rome_id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true },
    hour_index: { type: Number, required: true },
    date: { type: Date, index: true, required: true },
    state: { type: String, enum: visitStateEnum, default: visitStateEnum[0] },
});
// added crerate & update time in document
visitSchema.plugin(timeStamp);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;