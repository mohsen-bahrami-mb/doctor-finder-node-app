// import modules
import mongoose from "mongoose";
import timeStamp from "mongoose-timestamp";

// define enums
// export const Enum: string[] = [];

const articleSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true, index: true },
    route: { type: String, trim: true, required: true },
    visible: { type: Boolean, default: true },
    category: { type: [mongoose.Schema.Types.ObjectId], ref: "Category" },
    tag: { type: [mongoose.Schema.Types.ObjectId], ref: "Tag" },
    seo_config: {
        page_title: String,
        open_graph: { type: [{ key: String, value: String }] },
        robots: String,
        description: String,
        keywords: String,
    },
    content: { type: String }
});
// added crerate & update time in document
articleSchema.plugin(timeStamp);

const Article = mongoose.model("Article", articleSchema);
export default Article;