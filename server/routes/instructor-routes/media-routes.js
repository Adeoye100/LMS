const express = require("express");
const admin = require("../../helpers/firebase-admin");
const authMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

// All routes in this file are protected and require an authenticated instructor
router.use(authMiddleware);

/**
 * @route   DELETE /media/delete
 * @desc    Deletes a file from Firebase Storage
 * @access  Private (Instructor only)
 * @body    { "filePath": "courses/162987654321-my-video.mp4" }
 */
router.delete("/delete", async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({
      success: false,
      message: "File path is required for deletion.",
    });
  }

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "File not found in storage.",
      });
    }

    // Delete the file
    await file.delete();

    console.log(`Successfully deleted ${filePath} from Firebase Storage.`);
    res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error(`Failed to delete file from Firebase Storage: ${filePath}`, error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the file.",
      error: error.message,
    });
  }
});

module.exports = router;
