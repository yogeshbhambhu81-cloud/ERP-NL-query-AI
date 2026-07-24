import axios from 'axios';
import { env } from '../config/env.js';

// Prompt contexts detailing target table schemas
const SYSTEM_PROMPT = `
You are a database translation bot. You compile plain English questions into valid PostgreSQL queries for a garment ERP database.

Here is the database schema context:
- Table "suppliers": columns are (id UUID, name VARCHAR, email VARCHAR, phone VARCHAR, address TEXT, supplier_score DECIMAL, on_time_rate DECIMAL, lead_time VARCHAR)
- Table "buyers": columns are (id UUID, name VARCHAR, email VARCHAR, phone VARCHAR, address TEXT)
- Table "finished_goods": columns are (id UUID, style_number VARCHAR, style_name VARCHAR, category VARCHAR, fabric VARCHAR, gsm INTEGER, color VARCHAR, print VARCHAR, supplier_id UUID FK references suppliers, cost_price DECIMAL, selling_price DECIMAL, stock_quantity INTEGER, image_url TEXT, season VARCHAR)
- Table "tech_packs": columns are (id UUID, product_id UUID FK references finished_goods, spec_details TEXT, measurement_chart TEXT)
- Table "sales_orders": columns are (id UUID, order_number VARCHAR, buyer_id UUID FK references buyers, status VARCHAR, total_amount DECIMAL, order_date TIMESTAMP, delivery_date TIMESTAMP)
- Table "sales_order_items": columns are (id UUID, order_id UUID FK references sales_orders, product_id UUID FK references finished_goods, quantity INTEGER, unit_price DECIMAL)
- Table "sales_invoices": columns are (id UUID, invoice_number VARCHAR, order_id UUID FK references sales_orders, invoice_amount DECIMAL, status VARCHAR, invoice_date TIMESTAMP)

Join Relationships:
- To join "suppliers" and "finished_goods": suppliers.id = finished_goods.supplier_id
- To join "buyers" and "sales_orders": buyers.id = sales_orders.buyer_id
- To join "finished_goods" and "sales_order_items": finished_goods.id = sales_order_items.product_id
- To join "sales_orders" and "sales_order_items": sales_orders.id = sales_order_items.order_id
- To join "sales_orders" and "sales_invoices": sales_orders.id = sales_invoices.order_id


Instructions:
1. ONLY return the plain SQL query. Do not wrap it in markdown blocks, backticks, or write explanations.
2. Make sure the query is a SELECT statement. Direct mutations are blocked.
3. Keep the query optimized, using JOINs where appropriate.
4. Try to match the exact wording of column names.
5. If you alias a table, use the exact same alias consistently for all column references (e.g. if sales_order_items is aliased as soi, use soi.quantity, not si.quantity).

`;

export const aiService = {
  /**
   * Generates a PostgreSQL query from a Natural Language string using OpenRouter.
   */
  async generateSQL(userQuery) {
    if (!env.openrouterApiKey) {
      throw new Error('OpenRouter API Key is missing. Cannot generate SQL query.');
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: env.openrouterModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Translate this question to SQL: ${userQuery}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${env.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://wfx-erp.com',
          'X-Title': 'WFX AI ERP'
        },
        timeout: 30000
      }
    );

    let sql = response.data.choices[0].message.content.trim();
    // Clean up markdown wrapping and trailing semicolons
    sql = sql.replace(/```sql|```/gi, '').trim();
    sql = sql.replace(/;+$/, '').trim();
    return sql;
  },

  /**
   * Generates a human-friendly response based on the query, SQL structure, and raw data rows.
   */
  async generateExplanation(userQuery, sql, rows) {
    if (!env.openrouterApiKey) {
      throw new Error('OpenRouter API Key is missing. Cannot generate explanation.');
    }

    const prompt = `
    User asked: "${userQuery}"
    Generated SQL was: "${sql}"
    The returned database rows: ${JSON.stringify(rows.slice(0, 5))}

    Write a short, professional, 1-2 sentence response summarizing these results for an ERP dashboard.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: env.openrouterModel,
        messages: [
          { role: 'system', content: 'You are an ERP analyst bot. Summarize raw data query outputs briefly.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${env.openrouterApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    return response.data.choices[0].message.content.trim();
  }
};

export default aiService;
