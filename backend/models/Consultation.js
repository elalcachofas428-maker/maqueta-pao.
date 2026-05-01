/**
 * Consultation model — SQLite queries via sql.js
 */
const { getDb, saveDb } = require('../database/init');

const Consultation = {
  async create(data) {
    const db = await getDb();
    db.run(
      `INSERT INTO consultations (name, email, phone, audience, message, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.email, data.phone || null, data.audience, data.message, data.ip_address || null, data.user_agent || null]
    );
    saveDb();
    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    const found = await this.findById(id);
    if (found) return found;
    // Fallback: return the data we have
    return { id, name: data.name, email: data.email, phone: data.phone, audience: data.audience, message: data.message, status: 'pending', created_at: new Date().toISOString(), ip_address: data.ip_address, user_agent: data.user_agent };
  },

  async findAll(filters = {}) {
    const db = await getDb();
    let query = 'SELECT * FROM consultations WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.dateFrom) {
      query += ' AND created_at >= ?';
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      query += ' AND created_at <= ?';
      params.push(filters.dateTo);
    }

    query += ' ORDER BY created_at DESC';

    const result = db.exec(query, params);
    if (!result.length) return [];
    return result[0].values.map(row => this._rowToObj(result[0].columns, row));
  },

  async findById(id) {
    const db = await getDb();
    const result = db.exec('SELECT * FROM consultations WHERE id = ?', [id]);
    if (!result.length || !result[0].values.length) return null;
    return this._rowToObj(result[0].columns, result[0].values[0]);
  },

  async updateStatus(id, status) {
    const db = await getDb();
    const valid = ['pending', 'contacted', 'closed'];
    if (!valid.includes(status)) throw new Error(`Estado inválido: ${status}`);

    db.run('UPDATE consultations SET status = ? WHERE id = ?', [status, id]);
    saveDb();
    const changes = db.getRowsModified();
    if (changes === 0) return null;
    return this.findById(id);
  },

  async getStats() {
    const db = await getDb();
    const get = (q) => { const r = db.exec(q); return r.length ? r[0].values[0][0] : 0; };

    return {
      total: get('SELECT COUNT(*) FROM consultations'),
      pending: get("SELECT COUNT(*) FROM consultations WHERE status = 'pending'"),
      contacted: get("SELECT COUNT(*) FROM consultations WHERE status = 'contacted'"),
      closed: get("SELECT COUNT(*) FROM consultations WHERE status = 'closed'"),
      thisWeek: get("SELECT COUNT(*) FROM consultations WHERE created_at >= datetime('now', '-7 days')")
    };
  },

  _rowToObj(columns, row) {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  }
};

module.exports = Consultation;
