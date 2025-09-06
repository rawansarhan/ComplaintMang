const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Grass API',
      version: '1.0.0',
      description: 'API documentation for Grass project',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        RegisterUser: {
          type: 'object',
          required: ['email', 'password', 'first_name', 'last_name', 'mosque_id', 'birth_date'],
          properties: {
            email: { type: 'string', example: 'student@example.com' },
            password: { type: 'string', example: 'password123' },
            first_name: { type: 'string', example: 'Ali' },
            last_name: { type: 'string', example: 'Ahmad' },
            mosque_id: { type: 'integer', example: 1 },
            birth_date: { type: 'string', format: 'date', example: '2000-01-01' },
            is_save_quran: { type: 'boolean', example: true },
            phone: { type: 'string', example: '0999123456' },
            father_phone: { type: 'string', example: '0999112233' },
            address: { type: 'string', example: 'Damascus, Syria' },
            certificates: { type: 'string', example: 'Ijaza in Hafs' },
            experiences: { type: 'string', example: '5 years teaching Quran' },
            memorized_parts: { type: 'integer', example: 30 },
             fcm_token: { type: 'string', example: 'fcm_token_here', description: 'Optional FCM device token for push notifications' }
          }
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'student@example.com' },
            first_name: { type: 'string', example: 'Ali' },
            last_name: { type: 'string', example: 'Ahmad' },
            mosque_id: { type: 'integer', example: 1 },
            role_id: { type: 'integer', example: 3 },
             fcm_token: { type: 'string', example: 'fcm_token_here', description: 'FCM device token if provided' },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        RegisterTeacher: {
          type: 'object',
          required: ['email', 'password', 'first_name', 'last_name', 'mosque_id', 'birth_date'],
          properties: {
            email: { type: 'string', example: 'teacher@example.com' },
            password: { type: 'string', example: 'password123' },
            first_name: { type: 'string', example: 'Ali' },
            last_name: { type: 'string', example: 'Ahmad' },
            mosque_id: { type: 'integer', example: 1 },
            birth_date: { type: 'string', format: 'date', example: '2000-01-01' },
            is_save_quran: { type: 'boolean', example: true },
            phone: { type: 'string', example: '0999123456' },
            address: { type: 'string', example: 'Damascus, Syria' },
            certificates: { type: 'string', example: 'Ijaza in Hafs' },
            experiences: { type: 'string', example: '5 years teaching Quran' },
            memorized_parts: { type: 'integer', example: 30 },
             fcm_token: { type: 'string', example: 'fcm_token_here', description: 'FCM device token if provided' },
          }
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'student@example.com' },
            first_name: { type: 'string', example: 'Ali' },
            last_name: { type: 'string', example: 'Ahmad' },
            mosque_id: { type: 'integer', example: 1 },
            role_id: { type: 'integer', example: 3 },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
         RegisterAdmin: {
          type: 'object',
          required: ['email', 'password', 'first_name', 'last_name', 'mosque_id', 'birth_date'],
          properties: {
            email: { type: 'string', example: 'Admin@example.com' },
            password: { type: 'string', example: 'password123' },
            first_name: { type: 'string', example: 'Ali' },
            last_name: { type: 'string', example: 'Ahmad' },
            mosque_id: { type: 'integer', example: 1 },
            birth_date: { type: 'string', format: 'date', example: '2000-01-01' },
            phone: { type: 'string', example: '0999123456' },
            address: { type: 'string', example: 'Damascus, Syria' },
            experiences: { type: 'string', example: '5 years teaching Quran' },
          }
        },
        RegisterAdminResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'student@example.com' },
            first_name: { type: 'string', example: 'Ali' },
            last_name: { type: 'string', example: 'Ahmad' },
            mosque_id: { type: 'integer', example: 1 },
            role_id: { type: 'integer', example: 3 },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
       LoginByCodeRequest: {
  type: 'object',
  required: ['code_user', 'mosque_code'],
  properties: {
    code_user: { type: 'integer', example: 123456 },
    mosque_code: { type: 'integer', example: 15624 },
    fcm_token: { type: 'string', example: 'fcm_token_here', description: 'FCM device token if provided' },
  }
},

LoginByCodeResponse: {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    email: { type: 'string', example: 'user@example.com' },
    first_name: { type: 'string', example: 'Ali' },
    last_name: { type: 'string', example: 'Ahmad' },
    mosque_id: { type: 'integer', example: 1 },
    fcm_token: { type: 'string', example: 'fcm_token_here' },
    token: { type: 'string', example: 'jwt.token.here' }
  }
},

LoginByEmailRequest: {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', example: 'user@example.com' },
    password: { type: 'string', example: 'password123' }
  }
},

LoginByEmailResponse: {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    email: { type: 'string', example: 'user@example.com' },
    first_name: { type: 'string', example: 'Ali' },
    last_name: { type: 'string', example: 'Ahmad' },
    role_id: { type: 'integer', example: 2 },
    token: { type: 'string', example: 'jwt.token.here' }
  }
}
,
        mosqueCreateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Saad ibn Abi Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
            
          }
        },
        mosqueCreateResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Saad ibn Abi Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
            code: { type: 'string', example: 12345},
          }
        },
      
     mosqueUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Saad ibn Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
            
          }
        },
        mosqueUpdateResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Saad ibn Abi Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
          }
        },
        mosqueShowAllResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Saad ibn Abi Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
          }
        },
        
        mosqueShowResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Saad ibn Abi Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
            code: { type: 'string', example: 12345},
          }
        },
        mosqueDeleteResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Saad ibn Abi Waqqas' },
            address: { type: 'string', example: 'Bab Msalla' },
            code: { type: 'string', example: 12345},
          }
        },
   
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis:['./src/routes/*.js'],
};

console.log('Swagger docs generated with definitions from:', swaggerOptions.apis);

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwagger;
