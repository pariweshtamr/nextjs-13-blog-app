import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 4,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      index: 1,
      deafult: "",
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Nature",
        "Mountain",
        "Life",
        "Wildlife",
        "Ocean",
        "Forest",
        "AI",
        "God",
      ],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
)

export default mongoose?.models?.Blog || mongoose.model("Blog", BlogSchema)
