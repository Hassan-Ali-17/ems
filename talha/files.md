bash

`mkdir -p /home/claude/ems-project/{backend/{src/{config,controllers,middleware,models,routes,utils,validators}},frontend/{src/{assets,components/{common,layout,events,auth,admin,organizer},contexts,hooks,pages/{admin,organizer},services,utils}}} echo "Structure created"`

docker

version: "3.9"

services:

\# MongoDB Service

mongodb:

image: mongo:7.0

container\_name: ems\_mongodb

restart: unless-stopped

environment:

MONGO\_INITDB\_ROOT\_USERNAME: ${MONGO\_ROOT\_USERNAME:-admin}

MONGO\_INITDB\_ROOT\_PASSWORD: ${MONGO\_ROOT\_PASSWORD:-password123}

MONGO\_INITDB\_DATABASE: ${MONGO\_DB\_NAME:-ems\_db}

ports:

\- "27017:27017"

volumes:

\- mongodb\_data:/data/db

\- ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

networks:

\- ems\_network

healthcheck:

test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test \--quiet

interval: 10s

timeout: 10s

retries: 5

start\_period: 40s

\# Backend Service

backend:

build:

context: ./backend

dockerfile: Dockerfile

container\_name: ems\_backend

restart: unless-stopped

environment:

NODE\_ENV: ${NODE\_ENV:-development}

PORT: ${PORT:-5000}

MONGODB\_URI: mongodb://${MONGO\_ROOT\_USERNAME:-admin}:${MONGO\_ROOT\_PASSWORD:-password123}@mongodb:27017/${MONGO\_DB\_NAME:-ems\_db}?authSource=admin

JWT\_SECRET: ${JWT\_SECRET:-supersecretjwtkey\_changeme\_in\_production}

JWT\_EXPIRE: ${JWT\_EXPIRE:-7d}

FRONTEND\_URL: ${FRONTEND\_URL:-http://localhost:5173}

ports:

\- "${PORT:-5000}:5000"

depends\_on:

mongodb:

condition: service\_healthy

volumes:

\- ./backend:/app

\- /app/node\_modules

\- uploads\_data:/app/uploads

networks:

\- ems\_network

volumes:

mongodb\_data:

driver: local

uploads\_data:

driver: local

networks:

ems\_network:

driver: bridge

docker backend

\# Use official Node.js LTS image

FROM node:20-alpine

\# Set working directory

WORKDIR /app

\# Install dependencies for native modules

RUN apk add \--no-cache python3 make g++

\# Copy package files first (for better Docker cache layering)

COPY package\*.json ./

\# Install all dependencies

RUN npm ci \--only=production

\# Copy source code

COPY . .

\# Create uploads directory

RUN mkdir \-p uploads/tickets

\# Expose port

EXPOSE 5000

\# Health check

HEALTHCHECK \--interval=30s \--timeout=10s \--start-period=30s \--retries=3 \\

CMD wget \--no-verbose \--tries=1 \--spider [http://localhost:5000/api/health](http://localhost:5000/api/health) || exit 1

\# Start the application

CMD \["node", "src/server.js"\]

mongo

// MongoDB initialization script

// This runs when the container is first created

db \= db.getSiblingDB('ems\_db');

// Create collections with validation

db.createCollection('users');

db.createCollection('events');

db.createCollection('registrations');

// Create indexes for performance

db.users.createIndex({ email: 1 }, { unique: true });

db.events.createIndex({ title: 'text', description: 'text', location: 'text' });

db.events.createIndex({ category: 1, date: 1, status: 1 });

db.registrations.createIndex({ user: 1, event: 1 }, { unique: true });

print('MongoDB initialized successfully for EMS');

/\*\*

\* MongoDB connection configuration using Mongoose

\*/

const mongoose \= require('mongoose');

const connectDB \= async () \=\> {

try {

const mongoURI \= process.env.MONGODB\_URI || 'mongodb://localhost:27017/ems\_db';

const conn \= await mongoose.connect(mongoURI, {

serverSelectionTimeoutMS: 5000,

socketTimeoutMS: 45000,

});

console.log(\`✅ MongoDB Connected: ${conn.connection.host}\`);

// Handle connection events

mongoose.connection.on('error', (err) \=\> {

console.error('❌ MongoDB connection error:', err);

});

mongoose.connection.on('disconnected', () \=\> {

console.warn('⚠️ MongoDB disconnected');

});

} catch (error) {

console.error('❌ MongoDB connection failed:', error.message);

process.exit(1);

}

};

module.exports \= connectDB;

/\*\*

\* User Model

\* Defines schema for users with roles: admin, organizer, attendee

\*/

const mongoose \= require('mongoose');

const bcrypt \= require('bcryptjs');

const userSchema \= new mongoose.Schema(

{

name: {

type: String,

required: \[true, 'Name is required'\],

trim: true,

minlength: \[2, 'Name must be at least 2 characters'\],

maxlength: \[50, 'Name cannot exceed 50 characters'\],

},

email: {

type: String,

required: \[true, 'Email is required'\],

unique: true,

lowercase: true,

trim: true,

match: \[/^\\S+@\\S+\\.\\S+$/, 'Please provide a valid email'\],

},

password: {

type: String,

required: \[true, 'Password is required'\],

minlength: \[6, 'Password must be at least 6 characters'\],

select: false, // Don't return password by default

},

role: {

type: String,

enum: \['admin', 'organizer', 'attendee'\],

default: 'attendee',

},

avatar: {

type: String,

default: '',

},

phone: {

type: String,

trim: true,

default: '',

},

bio: {

type: String,

maxlength: \[500, 'Bio cannot exceed 500 characters'\],

default: '',

},

isActive: {

type: Boolean,

default: true,

},

// For organizers: their organization name

organization: {

type: String,

default: '',

},

// Track last login

lastLogin: {

type: Date,

},

},

{

timestamps: true, // Adds createdAt and updatedAt

toJSON: { virtuals: true },

toObject: { virtuals: true },

}

);

// ─── Virtual: Events created by organizer ────────────────────────────────────

userSchema.virtual('eventsCreated', {

ref: 'Event',

localField: '\_id',

foreignField: 'organizer',

count: true,

});

// ─── Pre-save Hook: Hash password before saving ───────────────────────────────

userSchema.pre('save', async function (next) {

// Only hash if password was modified

if (\!this.isModified('password')) return next();

const salt \= await bcrypt.genSalt(12);

this.password \= await bcrypt.hash(this.password, salt);

next();

});

// ─── Method: Compare password ─────────────────────────────────────────────────

userSchema.methods.comparePassword \= async function (candidatePassword) {

return bcrypt.compare(candidatePassword, this.password);

};

// ─── Method: Get public profile (no sensitive data) ───────────────────────────

userSchema.methods.toPublicJSON \= function () {

const obj \= this.toObject();

delete obj.password;

return obj;

};

const User \= mongoose.model('User', userSchema);

module.exports \= User;

/\*\*

\* Registration Model

\* Tracks event registrations/bookings by users

\*/

const mongoose \= require('mongoose');

const { v4: uuidv4 } \= require('uuid');

const registrationSchema \= new mongoose.Schema(

{

user: {

type: mongoose.Schema.Types.ObjectId,

ref: 'User',

required: \[true, 'User is required'\],

},

event: {

type: mongoose.Schema.Types.ObjectId,

ref: 'Event',

required: \[true, 'Event is required'\],

},

// Unique ticket ID for QR code

ticketId: {

type: String,

unique: true,

default: () \=\> \`TKT-${uuidv4().split('-')\[0\].toUpperCase()}\`,

},

status: {

type: String,

enum: \['confirmed', 'cancelled', 'attended', 'pending'\],

default: 'confirmed',

},

// Payment info (for paid events)

paymentStatus: {

type: String,

enum: \['free', 'paid', 'pending', 'refunded'\],

default: 'free',

},

amountPaid: {

type: Number,

default: 0,

},

// Attendee details at time of registration

attendeeInfo: {

name: String,

email: String,

phone: String,

},

// For check-in at the event

checkedIn: {

type: Boolean,

default: false,

},

checkedInAt: {

type: Date,

},

// Path to generated PDF ticket

ticketPath: {

type: String,

default: '',

},

notes: {

type: String,

default: '',

},

},

{

timestamps: true,

}

);

// ─── Compound index to prevent duplicate registrations ────────────────────────

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// ─── Post-save: Increment event registeredCount ───────────────────────────────

registrationSchema.post('save', async function (doc) {

if (doc.status \=== 'confirmed') {

const Event \= mongoose.model('Event');

await Event.findByIdAndUpdate(doc.event, { $inc: { registeredCount: 1 } });

}

});

// ─── Pre-remove: Decrement event registeredCount ──────────────────────────────

registrationSchema.pre('findOneAndDelete', async function () {

const doc \= await this.model.findOne(this.getFilter());

if (doc && doc.status \=== 'confirmed') {

const Event \= mongoose.model('Event');

await Event.findByIdAndUpdate(doc.event, { $inc: { registeredCount: \-1 } });

}

});

const Registration \= mongoose.model('Registration', registrationSchema);

module.exports \= Registration;

/\*\*

\* JWT Utility Functions

\*/

const jwt \= require('jsonwebtoken');

/\*\*

\* Generate a signed JWT token for a user

\* @param {string} userId \- The user's MongoDB ObjectId

\* @param {string} role \- The user's role

\* @returns {string} JWT token

\*/

const generateToken \= (userId, role) \=\> {

return jwt.sign(

{ id: userId, role },

process.env.JWT\_SECRET,

{ expiresIn: process.env.JWT\_EXPIRE || '7d' }

);

};

/\*\*

\* Verify and decode a JWT token

\* @param {string} token \- The JWT token to verify

\* @returns {object} Decoded payload

\*/

const verifyToken \= (token) \=\> {

return jwt.verify(token, process.env.JWT\_SECRET);

};

module.exports \= { generateToken, verifyToken };

/\*\*

\* Authentication & Authorization Middleware

\*/

const { verifyToken } \= require('../utils/jwt');

const User \= require('../models/User');

/\*\*

\* Protect routes \- requires valid JWT

\*/

const protect \= async (req, res, next) \=\> {

let token;

// Extract token from Authorization header

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {

token \= req.headers.authorization.split(' ')\[1\];

}

if (\!token) {

return res.status(401).json({

success: false,

message: 'Not authorized. No token provided.',

});

}

try {

// Verify token

const decoded \= verifyToken(token);

// Get user from DB (to ensure they still exist and are active)

const user \= await User.findById(decoded.id).select('-password');

if (\!user) {

return res.status(401).json({

success: false,

message: 'User not found. Token invalid.',

});

}

if (\!user.isActive) {

return res.status(403).json({

success: false,

message: 'Your account has been deactivated. Contact support.',

});

}

// Attach user to request

req.user \= user;

next();

} catch (error) {

return res.status(401).json({

success: false,

message: 'Token invalid or expired. Please log in again.',

});

}

};

/\*\*

\* Authorize specific roles

\* @param {...string} roles \- Allowed roles

\*/

const authorize \= (...roles) \=\> {

return (req, res, next) \=\> {

if (\!roles.includes(req.user.role)) {

return res.status(403).json({

success: false,

message: \`Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}\`,

});

}

next();

};

};

module.exports \= { protect, authorize };

/\*\*

\* Global Error Handler Middleware

\* Catches all errors and returns consistent JSON responses

\*/

const errorHandler \= (err, req, res, next) \=\> {

let error \= { ...err };

error.message \= err.message;

// Log error in development

if (process.env.NODE\_ENV \=== 'development') {

console.error('Error:', err);

}

// Mongoose: Bad ObjectId

if (err.name \=== 'CastError') {

error.message \= \`Resource not found with id: ${err.value}\`;

return res.status(404).json({ success: false, message: error.message });

}

// Mongoose: Duplicate key error

if (err.code \=== 11000\) {

const field \= Object.keys(err.keyValue)\[0\];

const value \= err.keyValue\[field\];

error.message \= \`${field.charAt(0).toUpperCase() \+ field.slice(1)} '${value}' already exists.\`;

return res.status(400).json({ success: false, message: error.message });

}

// Mongoose: Validation error

if (err.name \=== 'ValidationError') {

const messages \= Object.values(err.errors).map((e) \=\> e.message);

error.message \= messages.join('. ');

return res.status(400).json({ success: false, message: error.message });

}

// JWT errors

if (err.name \=== 'JsonWebTokenError') {

error.message \= 'Invalid token. Please log in again.';

return res.status(401).json({ success: false, message: error.message });

}

if (err.name \=== 'TokenExpiredError') {

error.message \= 'Token expired. Please log in again.';

return res.status(401).json({ success: false, message: error.message });

}

// Default error response

res.status(err.statusCode || 500).json({

success: false,

message: error.message || 'Internal Server Error',

...(process.env.NODE\_ENV \=== 'development' && { stack: err.stack }),

});

};

module.exports \= errorHandler;

/\*\*

\* 404 Not Found Middleware

\*/

const notFound \= (req, res, next) \=\> {

res.status(404).json({

success: false,

message: \`Route ${req.originalUrl} not found\`,

});

};

module.exports \= notFound;

/\*\*

\* Request Validation Middleware using Joi

\*/

const Joi \= require('joi');

/\*\*

\* Validate request body against a Joi schema

\* @param {Joi.Schema} schema

\*/

const validate \= (schema) \=\> (req, res, next) \=\> {

const { error } \= schema.validate(req.body, { abortEarly: false });

if (error) {

const messages \= error.details.map((d) \=\> d.message.replace(/"/g, "'")).join('. ');

return res.status(400).json({

success: false,

message: messages,

});

}

next();

};

module.exports \= validate;

/\*\*

\* Joi Validation Schemas

\*/

const Joi \= require('joi');

// ─── Auth Validators ──────────────────────────────────────────────────────────

const registerSchema \= Joi.object({

name: Joi.string().min(2).max(50).required().messages({

'string.min': 'Name must be at least 2 characters',

'string.max': 'Name cannot exceed 50 characters',

'any.required': 'Name is required',

}),

email: Joi.string().email().required().messages({

'string.email': 'Please provide a valid email',

'any.required': 'Email is required',

}),

password: Joi.string().min(6).required().messages({

'string.min': 'Password must be at least 6 characters',

'any.required': 'Password is required',

}),

role: Joi.string().valid('attendee', 'organizer').default('attendee'),

organization: Joi.string().max(100).optional().allow(''),

phone: Joi.string().optional().allow(''),

});

const loginSchema \= Joi.object({

email: Joi.string().email().required().messages({

'string.email': 'Please provide a valid email',

'any.required': 'Email is required',

}),

password: Joi.string().required().messages({

'any.required': 'Password is required',

}),

});

// ─── Event Validators ─────────────────────────────────────────────────────────

const createEventSchema \= Joi.object({

title: Joi.string().min(3).max(100).required(),

description: Joi.string().min(10).max(5000).required(),

category: Joi.string().valid(

'Technology', 'Business', 'Education', 'Entertainment',

'Sports', 'Health & Wellness', 'Arts & Culture', 'Food & Drink',

'Music', 'Networking', 'Other'

).required(),

date: Joi.date().iso().required(),

endDate: Joi.date().iso().optional().allow(null, ''),

location: Joi.string().required(),

venue: Joi.string().optional().allow(''),

isOnline: Joi.boolean().default(false),

onlineLink: Joi.string().uri().optional().allow(''),

image: Joi.string().optional().allow(''),

price: Joi.number().min(0).required(),

capacity: Joi.number().integer().min(1).required(),

schedule: Joi.array().items(

Joi.object({

time: Joi.string().required(),

title: Joi.string().required(),

description: Joi.string().optional().allow(''),

speaker: Joi.string().optional().allow(''),

})

).optional(),

tags: Joi.array().items(Joi.string()).optional(),

status: Joi.string().valid('draft', 'published').default('published'),

});

const updateEventSchema \= createEventSchema.fork(

\['title', 'description', 'category', 'date', 'location', 'price', 'capacity'\],

(field) \=\> field.optional()

);

// ─── Profile Update Validator ─────────────────────────────────────────────────

const updateProfileSchema \= Joi.object({

name: Joi.string().min(2).max(50).optional(),

phone: Joi.string().optional().allow(''),

bio: Joi.string().max(500).optional().allow(''),

organization: Joi.string().max(100).optional().allow(''),

avatar: Joi.string().optional().allow(''),

});

const changePasswordSchema \= Joi.object({

currentPassword: Joi.string().required(),

newPassword: Joi.string().min(6).required(),

});

module.exports \= {

registerSchema,

loginSchema,

createEventSchema,

updateEventSchema,

updateProfileSchema,

changePasswordSchema,

};

/\*\*

\* Auth Controller

\* Handles registration, login, profile operations

\*/

const User \= require('../models/User');

const { generateToken } \= require('../utils/jwt');

/\*\*

\* @desc Register new user

\* @route POST /api/auth/register

\* @access Public

\*/

const register \= async (req, res) \=\> {

const { name, email, password, role, organization, phone } \= req.body;

// Check if user already exists

const existingUser \= await User.findOne({ email });

if (existingUser) {

return res.status(400).json({

success: false,

message: 'An account with this email already exists.',

});

}

// Create user (password hashing handled in model pre-save hook)

const user \= await User.create({

name,

email,

password,

role: role || 'attendee',

organization: organization || '',

phone: phone || '',

});

const token \= generateToken(user.\_id, user.role);

res.status(201).json({

success: true,

message: 'Account created successfully\!',

token,

user: {

id: user.\_id,

name: user.name,

email: user.email,

role: user.role,

organization: user.organization,

avatar: user.avatar,

},

});

};

/\*\*

\* @desc Login user

\* @route POST /api/auth/login

\* @access Public

\*/

const login \= async (req, res) \=\> {

const { email, password } \= req.body;

// Get user with password field (excluded by default)

const user \= await User.findOne({ email }).select('+password');

if (\!user) {

return res.status(401).json({

success: false,

message: 'Invalid email or password.',

});

}

if (\!user.isActive) {

return res.status(403).json({

success: false,

message: 'Your account has been deactivated. Contact support.',

});

}

// Verify password

const isMatch \= await user.comparePassword(password);

if (\!isMatch) {

return res.status(401).json({

success: false,

message: 'Invalid email or password.',

});

}

// Update last login

user.lastLogin \= new Date();

await user.save({ validateBeforeSave: false });

const token \= generateToken(user.\_id, user.role);

res.json({

success: true,

message: 'Login successful\!',

token,

user: {

id: user.\_id,

name: user.name,

email: user.email,

role: user.role,

organization: user.organization,

avatar: user.avatar,

phone: user.phone,

bio: user.bio,

},

});

};

/\*\*

\* @desc Get current logged-in user

\* @route GET /api/auth/me

\* @access Protected

\*/

const getMe \= async (req, res) \=\> {

const user \= await User.findById(req.user.\_id);

res.json({

success: true,

user,

});

};

/\*\*

\* @desc Update user profile

\* @route PUT /api/auth/profile

\* @access Protected

\*/

const updateProfile \= async (req, res) \=\> {

const { name, phone, bio, organization, avatar } \= req.body;

const user \= await User.findByIdAndUpdate(

req.user.\_id,

{ name, phone, bio, organization, avatar },

{ new: true, runValidators: true }

);

res.json({

success: true,

message: 'Profile updated successfully\!',

user,

});

};

/\*\*

\* @desc Change password

\* @route PUT /api/auth/change-password

\* @access Protected

\*/

const changePassword \= async (req, res) \=\> {

const { currentPassword, newPassword } \= req.body;

const user \= await User.findById(req.user.\_id).select('+password');

const isMatch \= await user.comparePassword(currentPassword);

if (\!isMatch) {

return res.status(400).json({

success: false,

message: 'Current password is incorrect.',

});

}

user.password \= newPassword;

await user.save();

res.json({

success: true,

message: 'Password changed successfully\!',

});

};

module.exports \= { register, login, getMe, updateProfile, changePassword };

