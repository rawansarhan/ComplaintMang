'use strict';
const axios = require('axios');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. Insert parts
    const parts = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Juz ${i + 1}`,
      description: null,
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('parts', parts);

    const surahs = new Map();
    const ayahs = [];

    // 2. Fetch ayahs for each juz
    for (let part = 1; part <= 30; part++) {
      const res = await axios.get(`https://api.alquran.cloud/v1/juz/${part}/quran-uthmani`);
      for (const ay of res.data.data.ayahs) {
        const sNum = ay.surah.number;
        if (!surahs.has(sNum)) {
          surahs.set(sNum, {
            id: sNum,
            name: ay.surah.englishName,
            ayat_counts: ay.surah.numberOfAyahs,
            part_id: part,
            description: null,
            created_at: now,
            updated_at: now,
          });
        }

        ayahs.push({
          surah_id: sNum,
          ayah_number: ay.numberInSurah,
          page_number: ay.page,
          created_at: now,
          updated_at: now,
        });
      }
    }

    // 3. Insert surahs
    await queryInterface.bulkInsert('surahs', Array.from(surahs.values()));

    // 4. Insert ayahs
    await queryInterface.bulkInsert('ayahs', ayahs);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ayahs', null, {});
    await queryInterface.bulkDelete('surahs', null, {});
    await queryInterface.bulkDelete('parts', null, {});
  }
};
