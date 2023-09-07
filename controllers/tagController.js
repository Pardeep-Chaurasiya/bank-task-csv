const Tag = require("../model/tags");

// const createtag = async (req, res) => {
//   const { tag_name } = req.body;

//   const tag = await Tag.create({
//     tag_name: tag_name,
//   });

//   if (!tag) {
//     return res.status(500).json({
//       code: "Internal-Server-Error",
//       error: "Something went wrong while creating tag",
//     });
//   }
//   return res.status(200).json({
//     message: "Tag created Successfully !!",
//     Bank: savedBank,
//   });
// };

// const getTag = async (req, res) => {
//   try {
//     const tags = await Tag.find({});
//     if (!tags) {
//       res.status(404).json({
//         message: "no tag found",
//       });
//     }
//     res.status(200).json({
//       data: tags,
//     });
//   } catch (error) {}
// };

const createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    const newTag = new Tag(tag_name);
    const savedTag = await newTag.save();
    console.log("Tag created:", savedTag);
    if (!savedTag)
      return res.status(500).json({ message: "Internal server error" });
    res.status(200).json({ message: "Tag created successfully" });
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(400).json({ success: false }, err.message);
  }
};

const getAllTags = async () => {
  try {
    const tags = await Tag.find();
    console.log("All Tags:", tags);
    if (!tags)
      return res.status(500).json({ message: "Internal server error" });
    res.status(200).json({ message: "tags data retrive successfully" });
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(400).json({ success: false }, err.message);
  }
};

const updateTag = async (tagId, updatedData) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(tagId, updatedData, {
      new: true,
    });
    if (!updatedTag)
      return res.status(500).json({ message: "Internal server error" });
    res.status(200).json({ message: "tags updated successfully", updatedTag });
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(400).json({ success: false }, err.message);
  }
};

const deleteTag = async (tagId) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(tagId);
    console.log("Tag deleted:", deletedTag);
    if (!deletedTag)
      return res.status(500).json({ message: "Internal server error" });
    res.status(200).json({ message: "tags deleted successfully" });
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(400).json({ success: false }, err.message);
  }
};

module.exports = { createTag, getAllTags, updateTag, deleteTag };
