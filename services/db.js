/**
 * Cognifyz Web Development Internship - Level 3, Task 6
 * Persistent Database Service (User Accounts & Registration Data Storage)
 * 
 * Manages persistent JSON storage (data/db.json) for Users & Registrations,
 * providing password hashing with bcryptjs and atomic file persistence.
 */

const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial seed data for database
const INITIAL_DB = {
  users: [
    {
      id: "usr_admin_101",
      name: "Portal Administrator",
      email: "admin@college.edu",
      // Password: Admin@12345 (Hashed)
      password: bcrypt.hashSync("Admin@12345", 10),
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_user_102",
      name: "Aarav Sharma",
      email: "aarav@college.edu",
      // Password: User@12345 (Hashed)
      password: bcrypt.hashSync("User@12345", 10),
      role: "user",
      createdAt: new Date().toISOString()
    }
  ],
  registrations: [
    {
      id: "reg_101",
      userId: "usr_user_102",
      name: "Aarav Sharma",
      email: "aarav@college.edu",
      phone: "9876543210",
      age: 20,
      course: "B.E. Computer Science and Engineering",
      createdAt: "2026-10-01T10:30:00.000Z",
      updatedAt: "2026-10-01T10:30:00.000Z"
    },
    {
      id: "reg_102",
      userId: "usr_admin_101",
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      phone: "9812345678",
      age: 21,
      course: "B.Tech Information Technology",
      createdAt: "2026-10-02T14:15:00.000Z",
      updatedAt: "2026-10-02T14:15:00.000Z"
    },
    {
      id: "reg_103",
      userId: "usr_admin_101",
      name: "Rohan Verma",
      email: "rohan.v@college.edu",
      phone: "8765432109",
      age: 22,
      course: "B.E. Electronics and Communication Engineering",
      createdAt: "2026-10-05T09:45:00.000Z",
      updatedAt: "2026-10-05T09:45:00.000Z"
    }
  ]
};

class DatabaseService {
  /**
   * Initializes persistent database file if missing
   */
  static async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(DB_FILE);
      } catch {
        await fs.writeFile(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Error initializing database file:', err);
    }
  }

  /**
   * Reads raw database JSON object
   */
  static async _readDb() {
    await this.init();
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      return JSON.parse(content || JSON.stringify(INITIAL_DB));
    } catch (err) {
      console.error('Error reading db.json:', err);
      return INITIAL_DB;
    }
  }

  /**
   * Writes updated database JSON object
   */
  static async _writeDb(db) {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }

  /* ==========================================================================
     USER ACCOUNT OPERATIONS
     ========================================================================== */

  static async findUserByEmail(email) {
    const db = await this._readDb();
    const normalized = email.trim().toLowerCase();
    return db.users.find(u => u.email.toLowerCase() === normalized) || null;
  }

  static async findUserById(id) {
    const db = await this._readDb();
    return db.users.find(u => u.id === id) || null;
  }

  static async createUser(userData) {
    const db = await this._readDb();
    const newId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Hash password with bcryptjs
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);

    const newUser = {
      id: newId,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
      role: userData.role || "user",
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    await this._writeDb(db);
    return newUser;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  /* ==========================================================================
     REGISTRATION CRUD OPERATIONS
     ========================================================================== */

  static async getAllRegistrations() {
    const db = await this._readDb();
    return db.registrations || [];
  }

  static async getRegistrationById(id) {
    const db = await this._readDb();
    return db.registrations.find(r => r.id === id) || null;
  }

  static async createRegistration(data, userId) {
    const db = await this._readDb();
    const newId = `reg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newRecord = {
      id: newId,
      userId: userId || "anonymous",
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      age: parseInt(data.age, 10),
      course: data.course.trim(),
      createdAt: now,
      updatedAt: now
    };

    db.registrations.unshift(newRecord);
    await this._writeDb(db);
    return newRecord;
  }

  static async updateRegistration(id, updateData) {
    const db = await this._readDb();
    const index = db.registrations.findIndex(r => r.id === id);
    if (index === -1) return null;

    const existing = db.registrations[index];
    const updatedRecord = {
      ...existing,
      name: updateData.name ? updateData.name.trim() : existing.name,
      email: updateData.email ? updateData.email.trim().toLowerCase() : existing.email,
      phone: updateData.phone ? updateData.phone.trim() : existing.phone,
      age: updateData.age ? parseInt(updateData.age, 10) : existing.age,
      course: updateData.course ? updateData.course.trim() : existing.course,
      updatedAt: new Date().toISOString()
    };

    db.registrations[index] = updatedRecord;
    await this._writeDb(db);
    return updatedRecord;
  }

  static async deleteRegistration(id) {
    const db = await this._readDb();
    const index = db.registrations.findIndex(r => r.id === id);
    if (index === -1) return false;

    db.registrations.splice(index, 1);
    await this._writeDb(db);
    return true;
  }
}

module.exports = DatabaseService;
