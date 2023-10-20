// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
// export const Enum: string[] = [];

const categorySchema = new mongoose.Schema({
    name: { type: String, trim: true },
    doctors: { type: [mongoose.Schema.Types.ObjectId], ref: "Doctor", index: true },
    clinicks: { type: [mongoose.Schema.Types.ObjectId], ref: "Clinick", index: true },
});
// added crerate & update time in document
categorySchema.plugin(timeStamp);

const Category = mongoose.model("Category", categorySchema);
export default Category;