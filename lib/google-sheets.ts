/**
 * Google Sheets API Client
 * Handles reading data from Google Sheets (Lancamentos2026, Orçamento2026)
 */

import axios, { AxiosInstance } from 'axios';
import type { SheetRow } from './types';

const GOOGLE_SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface GoogleSheetsClientConfig {
  spreadsheetId: string;
  apiKey: string;
}

export class GoogleSheetsClient {
  private spreadsheetId: string;
  private apiKey: string;
  private axios: AxiosInstance;

  constructor(config: GoogleSheetsClientConfig) {
    if (!config.spreadsheetId || !config.apiKey) {
      throw new Error('Missing Google Sheets configuration (spreadsheetId or apiKey)');
    }

    this.spreadsheetId = config.spreadsheetId;
    this.apiKey = config.apiKey;
    this.axios = axios.create({
      baseURL: GOOGLE_SHEETS_API_BASE,
      params: { key: this.apiKey },
    });
  }

  /**
   * Read data from a sheet range
   * @param sheetName - Sheet name (e.g., "Lancamentos2026")
   * @param range - Range (e.g., "A1:F1000"), defaults to all data
   */
  async readSheet(sheetName: string, range?: string): Promise<SheetRow[]> {
    try {
      const fullRange = range ? `${sheetName}!${range}` : `${sheetName}`;

      const response = await this.axios.get(
        `/${this.spreadsheetId}/values/${encodeURIComponent(fullRange)}`
      );

      const values = response.data.values || [];
      if (values.length === 0) {
        return [];
      }

      // First row is headers
      const headers = values[0];
      const rows: SheetRow[] = [];

      for (let i = 1; i < values.length; i++) {
        const row: SheetRow = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[i][j] || null;
        }
        rows.push(row);
      }

      return rows;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to read Google Sheet "${sheetName}": ${message}`);
    }
  }

  /**
   * Read Lancamentos2026 (Transactions)
   */
  async readLancamentos(): Promise<SheetRow[]> {
    return this.readSheet('Lancamentos2026');
  }

  /**
   * Read Orçamento2026 (Budgets)
   */
  async readOrcamento(): Promise<SheetRow[]> {
    return this.readSheet('Orçamento2026');
  }

  /**
   * Get sheet metadata
   */
  async getMetadata() {
    try {
      const response = await this.axios.get(`/${this.spreadsheetId}`);
      return {
        title: response.data.properties.title,
        sheets: response.data.sheets.map((s: { properties: { title: string } }) => s.properties.title),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch spreadsheet metadata: ${message}`);
    }
  }
}

/**
 * Create a Google Sheets client instance
 */
export function createGoogleSheetsClient(apiKey: string, spreadsheetId: string) {
  return new GoogleSheetsClient({ apiKey, spreadsheetId });
}

/**
 * Health check - verify connection to Google Sheets
 */
export async function googleSheetsHealthCheck(apiKey: string, spreadsheetId: string) {
  try {
    const client = createGoogleSheetsClient(apiKey, spreadsheetId);
    const metadata = await client.getMetadata();
    return {
      healthy: true,
      message: 'Google Sheets API connection OK',
      spreadsheet: metadata.title,
      sheets: metadata.sheets,
    };
  } catch (error) {
    return {
      healthy: false,
      message: `Google Sheets API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
