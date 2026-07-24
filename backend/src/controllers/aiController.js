import { aiService } from '../services/aiService.js';
import { supabase } from '../config/supabase.js';
import CustomError from '../utils/CustomError.js';

export const aiController = {
  // 1. POST /ai/query
  async handleNLQuery(req, res, next) {
    const { query } = req.body;

    try {
      console.log(`[AI Controller] Compiling NL query: "${query}"`);

      // Step A: Generate SQL from English
      let sql;
      try {
        sql = await aiService.generateSQL(query);
      } catch (genErr) {
        console.error('[AI Controller] SQL generation failed:', genErr.message);
        throw new CustomError(`AI SQL generation failed: ${genErr.message}`, 502);
      }
      console.log(`[AI Controller] Generated SQL Statement:\n${sql}`);

      // Step B: Direct Safety Check (express-validator already checked but double-verify here)
      const sqlLower = sql.toLowerCase();
      const mutations = ['insert', 'update', 'delete', 'drop', 'truncate', 'alter', 'create', 'grant'];
      if (mutations.some(kw => sqlLower.includes(kw))) {
        throw new CustomError('Security Violation: Data modification queries are strictly prohibited.', 403);
      }

      let rows = [];
      let headers = [];

      // Step C: Execute SQL
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
        if (error) {
          console.error('[AI Controller] SQL execution error:', error.message);
          // Try a simpler fallback approach — return the SQL + error explanation
          return res.status(200).json({
            success: true,
            message: 'Natural language query parsed but SQL execution encountered an issue.',
            data: {
              query,
              sql,
              headers: [],
              rows: [],
              aiResponse: `The generated SQL query could not be executed on the database. Error: ${error.message}. The SQL attempted was: ${sql}`
            }
          });
        }

        if (data && data.length > 0) {
          headers = Object.keys(data[0]);
          rows = data.map(row => Object.values(row));
        }
      } catch (execErr) {
        console.error('[AI Controller] SQL RPC execution error:', execErr.message);
        // Return partial result with SQL shown
        return res.status(200).json({
          success: true,
          message: 'SQL execution error — partial result returned.',
          data: {
            query,
            sql,
            headers: [],
            rows: [],
            aiResponse: `The AI generated this SQL but it could not be executed: ${execErr.message}. You may need to create the exec_sql database function. The SQL was: ${sql}`
          }
        });
      }

      // Step D: AI Explanation (non-blocking — if this fails, still return data)
      let explanation = '';
      try {
        explanation = await aiService.generateExplanation(query, sql, rows);
      } catch (explainErr) {
        console.warn('[AI Controller] Explanation generation failed:', explainErr.message);
        explanation = rows.length > 0
          ? `Query returned ${rows.length} row(s). The AI summary is temporarily unavailable.`
          : 'No results were returned for this query.';
      }

      res.status(200).json({
        success: true,
        message: 'Natural language query parsed and executed.',
        data: {
          query,
          sql,
          headers,
          rows,
          aiResponse: explanation
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. POST /ai/sql
  async handleDirectSQL(req, res, next) {
    const { sql } = req.body;

    try {
      let rows = [];
      let headers = [];

      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
      if (error) throw error;
      if (data && data.length > 0) {
        headers = Object.keys(data[0]);
        rows = data.map(row => Object.values(row));
      }

      res.status(200).json({
        success: true,
        message: 'SQL executed successfully.',
        data: {
          sql,
          headers,
          rows
        }
      });
    } catch (err) {
      next(new CustomError(`SQL execution error: ${err.message}`, 400));
    }
  }
};

export default aiController;
