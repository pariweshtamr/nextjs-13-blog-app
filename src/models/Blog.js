import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 4,
    },
    desc: {
      type: String,
      required: true,
      min: 6,
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
