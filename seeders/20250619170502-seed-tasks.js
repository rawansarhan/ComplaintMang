'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      //1
      {
        name: 'قران',
        type: 'mandatory',
        point: 50,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //2
      {
        name: 'حديث',
        type: 'mandatory',
        point: 40,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //3
      {
        name: 'فقه',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //4
      {
        name: 'تجويد',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //5
      {
        name: 'قصص الانبياء',
        type: 'mandatory',
        point: 10,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //6
      {
        name: 'الصلاة',
        type: 'mandatory',
        point: 15,
        is_sublevels: false,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //7

      {
        name: 'قران',
        type: 'mandatory',
        point: 50,
        is_sublevels:false,
        level: 'تلقين',
        created_at: new Date(),
        updated_at: new Date()
      },
      //8
      {
        name: 'قران',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'حفظ جديد',
        created_at: new Date(),
        updated_at: new Date()
      },
      //9
      {
        name: 'فران',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'خمس اجزاء',
        created_at: new Date(),
        updated_at: new Date()
      },
      //10
      {
        name: 'قران',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: 'اوقاف',
        created_at: new Date(),
        updated_at: new Date()
      },
      //11
      {
        name: 'مهمة صلاة على النبي',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //12
      {
        name: 'حديث',
        type: 'mandatory',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //13
      {
        name: 'جزرية',
        type: 'optional',
        point: null,
        is_sublevels: true,
        level: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      //14
      {
        name: 'مهمة الصلاة على النبي',
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
