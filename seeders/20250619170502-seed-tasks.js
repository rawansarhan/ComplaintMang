'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      //1
      {
        name: 'Quran',
        type: 'mandatory',
        point: 50,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //2
      {
        name: 'Hadith',
        type: 'mandatory',
        point: 40,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //3
      {
        name: 'Fiqh',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //4
      {
        name: 'Tajweed',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //5
      {
        name: 'Qisas Al-Anbiya',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //6
      {
        name: 'Salah',
        type: 'mandatory',
        point: 15,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //7

      {
        name: 'Quran',
        type: 'mandatory',
        point: 50,
        is_sublevels:false,
        level: 'talkeen',
        created_at: new Date(),
        updated_at: new Date()
      },
      //8
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'save_new',
        created_at: new Date(),
        updated_at: new Date()
      },
      //9
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'five_part',
        created_at: new Date(),
        updated_at: new Date()
      },
      //10
      {
        name: 'Quran',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'awqaf',
        created_at: new Date(),
        updated_at: new Date()
      },
      //11
      {
        name: 'Mohimmat Salah Ala Al-Nabi',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //12
      {
        name: 'Hadith',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //13
      {
        name: 'Jazariyyah',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //14
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
