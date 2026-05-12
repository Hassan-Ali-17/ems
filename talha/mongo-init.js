db = db.getSiblingDB('ems_db');

db.createCollection('users');
db.createCollection('events');
db.createCollection('registrations');

db.users.createIndex({ email: 1 }, { unique: true });
db.events.createIndex({ title: 'text', description: 'text', location: 'text', category: 'text' });
db.events.createIndex({ category: 1, date: 1, status: 1 });
db.registrations.createIndex({ user: 1, event: 1 }, { unique: true });

print('MongoDB initialized successfully for EMS');