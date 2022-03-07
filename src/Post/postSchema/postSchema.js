const mongoose = require("mongoose");


const postSchema = mongoose.Schema(
    {
        title: { type: String },
        desc: { type: String },
        blocked: { type: Boolean, default: false },
        CreatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
            // 

        reported: { type: Boolean, default: false },
        reportedBy: [{user:{ type: mongoose.Types.ObjectId, ref: "user"}, comment: { type: String } }],
    },
    {
        timestamps: true
    }
);

module.exports = postSchema 