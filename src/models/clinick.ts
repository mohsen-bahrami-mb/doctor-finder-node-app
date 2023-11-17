// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
export const clinickVerifyEnum: string[] = ["medical_serial"];

const clinickSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    category: { type: [mongoose.Schema.Types.ObjectId], ref: "Category" },
    tag: { type: [mongoose.Schema.Types.ObjectId], ref: "Tag" },
    location: {
        country: { type: String, trim: true },
        city: { type: String, trim: true },
        address: { type: String, trim: true },
        map: { type: String, trim: true }
    },
    doctors: { type: [mongoose.Schema.Types.ObjectId], ref: "Doctor" },
    rome: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId, required: true,
                default: new mongoose.Types.ObjectId(),
                index: true
            },
            name: String,
            doctors: { type: [mongoose.Schema.Types.ObjectId], ref: "Doctor" },
            hour: [
                {
                    start: String,
                    end: String
                }
            ]
        }
    ],
    description: String
});
// added crerate & update time in document
clinickSchema.plugin(timeStamp);

const Clinick = mongoose.model("Clinick", clinickSchema);
export default Clinick;