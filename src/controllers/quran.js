const asyncHandler = require('express-async-handler');
const { Mosque, User, Ayah, Surah } = require('../models');

const AllAyahAndSurah = asyncHandler(async (req, res) => {
  try {
    const surahAll = await Surah.findAll();
    const result = [];

    for (const surah of surahAll) {
      const ayahs = await Ayah.findAll({
        where: { surah_id: surah.id }
      });

      result.push({
        surah,
        ayahs
      });
    }

    return res.status(200).json({
      message: "All surahs with their ayahs",
      result
    });
  } catch (error) {
    console.error('Error fetching ayahs:', error);
    return res.status(500).json({
      message: "Internal server error",
      details: error.message
    });
  }
});
module.exports = {
 AllAyahAndSurah
}