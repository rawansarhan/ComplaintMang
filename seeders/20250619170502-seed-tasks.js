'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        name: 'Quran',
        type: 'mandatory',
        point: 50,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hadith',
        type: 'mandatory',
        point: 40,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fiqh',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Tajweed',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Qisas Al-Anbiya',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Salah',
        type: 'mandatory',
        point: 15,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels:false,
        level: 'talkeen',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'save_new',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'five_part',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'awqaf',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mohimmat Salah Ala Al-Nabi',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hadith',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Jazariyyah',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mohimmat Salah Ala Al-Nabi',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
