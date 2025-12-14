const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => console.error('❌ Redis Error:', err));
client.on('connect', () => console.log('🚀 Redis Connected'));

client.connect();

module.exports = client;
