// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
// export const Enum: string[] = [];

const tagSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, index: true },
    doctors: { type: [mongoose.Schema.Types.ObjectId], ref: "Doctor", index: true },
    clinicks: { type: [mongoose.Schema.Types.ObjectId], ref: "Clinick", index: true },
    articles: { type: [mongoose.Schema.Types.ObjectId], ref: "Article" },
});
// added crerate & update time in document
tagSchema.plugin(timeStamp);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;