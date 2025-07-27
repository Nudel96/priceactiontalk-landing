/**
 * CFTC (Commodity Futures Trading Commission) Scraper
 * Collects Commitment of Traders (COT) data for sentiment analysis
 */

import { BaseScraper } from './base-scraper';
import type { 
  AssetCode, 
  COTData,
  ScrapingResult 
} from '$lib/types/advanced-economic';

interface CFTCContract {
  asset: AssetCode;
  contractName: string;
  cftcCode: string;
  contractSize: number;
}

export class CFTCScraper extends BaseScraper {
  private readonly BASE_URL = 'https://www.cftc.gov/dea/newcot';

  // CFTC contract codes for our assets
  private readonly CONTRACTS: CFTCContract[] = [
    {
      asset: 'USD',
      contractName: 'US Dollar Index',
      cftcCode: '098662', // DX - US Dollar Index
      contractSize: 1000
    },
    {
      asset: 'EUR',
      contractName: 'Euro FX',
      cftcCode: '099741', // EC - Euro FX
      contractSize: 125000
    },
    {
      asset: 'GBP',
      contractName: 'British Pound',
      cftcCode: '096742', // BP - British Pound
      contractSize: 62500
    },
    {
      asset: 'JPY',
      contractName: 'Japanese Yen',
      cftcCode: '097741', // JY - Japanese Yen
      contractSize: 12500000
    },
    {
      asset: 'AUD',
      contractName: 'Australian Dollar',
      cftcCode: '232741', // AD - Australian Dollar
      contractSize: 100000
    },
    {
      asset: 'CAD',
      contractName: 'Canadian Dollar',
      cftcCode: '090741', // CD - Canadian Dollar
      contractSize: 100000
    },
    {
      asset: 'CHF',
      contractName: 'Swiss Franc',
      cftcCode: '092741', // SF - Swiss Franc
      contractSize: 125000
    },
    {
      asset: 'NZD',
      contractName: 'New Zealand Dollar',
      cftcCode: '112741', // NE - New Zealand Dollar
      contractSize: 100000
    },
    {
      asset: 'XAU',
      contractName: 'Gold',
      cftcCode: '088691', // GC - Gold
      contractSize: 100
    },
    {
      asset: 'XAG',
      contractName: 'Silver',
      cftcCode: '084691', // SI - Silver
      contractSize: 5000
    }
  ];

  constructor() {
    super({
      source: 'CFTC',
      base_url: 'https://www.cftc.gov',
      endpoints: {
        disaggregated: '/dea/newcot/FinFutWk.txt',
        legacy: '/dea/newcot/deacot.txt',
        supplemental: '/dea/newcot/FinFutYY.txt'
      },
      headers: {
        'Accept': 'text/plain, text/csv, application/csv',
        'User-Agent': 'PriceActionTalk-EconomicBot/1.0'
      },
      rate_limit_ms: 5000, // Be respectful to CFTC servers
      retry_attempts: 3,
      timeout_ms: 30000, // Large files may take time
      respect_robots_txt: true,
      user_agent: 'PriceActionTalk-EconomicBot/1.0'
    });
  }

  async scrapeData(assets?: AssetCode[]): Promise<ScrapingResult> {
    const startTime = Date.now();
    const cotDataList: COTData[] = [];
    const errors: string[] = [];

    try {
      console.log('[CFTC] Starting COT data collection...');

      // Filter contracts for requested assets
      const relevantContracts = this.CONTRACTS.filter(contract => 
        !assets || assets.includes(contract.asset)
      );

      // Get disaggregated COT data (most detailed)
      try {
        const disaggregatedData = await this.scrapeDisaggregatedCOT();
        
        for (const contract of relevantContracts) {
          try {
            const cotData = this.parseContractData(disaggregatedData, contract);
            if (cotData) {
              cotDataList.push(cotData);
            }
          } catch (error) {
            const errorMsg = `Failed to parse COT data for ${contract.asset}: ${error}`;
            errors.push(errorMsg);
            console.error(`[CFTC] ${errorMsg}`);
          }
        }
      } catch (error) {
        errors.push(`Failed to fetch disaggregated COT data: ${error}`);
        console.error('[CFTC] Failed to fetch disaggregated data:', error);
      }

      console.log(`[CFTC] Collected COT data for ${cotDataList.length} assets`);

      return {
        source: 'CFTC',
        success: errors.length === 0,
        data_points: [], // COT data is stored separately
        errors,
        execution_time_ms: Date.now() - startTime,
        timestamp: this.getCurrentTimestamp()
      };

    } catch (error) {
      console.error('[CFTC] Scraping failed:', error);
      return {
        source: 'CFTC',
        success: false,
        data_points: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        execution_time_ms: Date.now() - startTime,
        timestamp: this.getCurrentTimestamp()
      };
    }
  }

  private async scrapeDisaggregatedCOT(): Promise<string[][]> {
    const url = `${this.config.base_url}${this.config.endpoints.disaggregated}`;

    try {
      const response = await this.makeRequest(url);
      const csvText = await response.text();

      // Parse CSV data
      const lines = csvText.split('\n');
      const data: string[][] = [];

      for (const line of lines) {
        if (line.trim()) {
          // Split by comma, handling quoted fields
          const fields = this.parseCSVLine(line);
          data.push(fields);
        }
      }

      return data;

    } catch (error) {
      console.error('[CFTC] Error fetching disaggregated COT data:', error);
      throw error;
    }
  }

  private parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    fields.push(current.trim());
    return fields;
  }

  private parseContractData(data: string[][], contract: CFTCContract): COTData | null {
    if (data.length < 2) return null;

    // Find header row
    const headerRow = data[0];
    const codeIndex = headerRow.findIndex(h => h.toLowerCase().includes('cftc_contract_market_code'));
    const dateIndex = headerRow.findIndex(h => h.toLowerCase().includes('report_date'));

    if (codeIndex === -1 || dateIndex === -1) {
      throw new Error('Required columns not found in COT data');
    }

    // Find the latest data for this contract
    let latestRow: string[] | null = null;
    let latestDate = '';

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[codeIndex] === contract.cftcCode) {
        const rowDate = row[dateIndex];
        if (rowDate > latestDate) {
          latestDate = rowDate;
          latestRow = row;
        }
      }
    }

    if (!latestRow) {
      return null;
    }

    // Parse COT positions
    const commercialLong = this.parseNumber(this.getColumnValue(headerRow, latestRow, 'dealer_positions_long_all')) || 0;
    const commercialShort = this.parseNumber(this.getColumnValue(headerRow, latestRow, 'dealer_positions_short_all')) || 0;
    const nonCommercialLong = this.parseNumber(this.getColumnValue(headerRow, latestRow, 'asset_mgr_positions_long_all')) || 0;
    const nonCommercialShort = this.parseNumber(this.getColumnValue(headerRow, latestRow, 'asset_mgr_positions_short_all')) || 0;
    const retailLong = this.parseNumber(this.getColumnValue(headerRow, latestRow, 'lev_money_positions_long_all')) || 0;
    const retailShort = this.parseNumber(this.getColumnValue(headerRow, latestRow, 'lev_money_positions_short_all')) || 0;

    // Calculate net positions
    const commercialNet = commercialLong - commercialShort;
    const nonCommercialNet = nonCommercialLong - nonCommercialShort;
    const retailNet = retailLong - retailShort;

    // Determine sentiment
    const commercialSentiment = this.determineSentiment(commercialNet);
    const retailSentiment = this.determineSentiment(retailNet);
    
    // Contrarian signal (opposite of retail sentiment)
    const contrarian_signal = retailSentiment === 'BULLISH' ? 'SELL' : 
                             retailSentiment === 'BEARISH' ? 'BUY' : 'HOLD';

    return {
      asset: contract.asset,
      report_date: latestDate,
      commercial_long: commercialLong,
      commercial_short: commercialShort,
      commercial_net: commercialNet,
      non_commercial_long: nonCommercialLong,
      non_commercial_short: nonCommercialShort,
      non_commercial_net: nonCommercialNet,
      retail_long: retailLong,
      retail_short: retailShort,
      retail_net: retailNet,
      commercial_sentiment: commercialSentiment,
      retail_sentiment: retailSentiment,
      contrarian_signal,
      source: 'CFTC',
      last_updated: this.getCurrentTimestamp()
    };
  }

  private getColumnValue(headers: string[], row: string[], columnName: string): string {
    const index = headers.findIndex(h => h.toLowerCase().includes(columnName.toLowerCase()));
    return index !== -1 ? row[index] : '';
  }

  private determineSentiment(netPosition: number): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    const threshold = 1000; // Adjust based on contract size
    
    if (netPosition > threshold) return 'BULLISH';
    if (netPosition < -threshold) return 'BEARISH';
    return 'NEUTRAL';
  }

  /**
   * Get historical COT data for trend analysis
   */
  async getHistoricalCOT(asset: AssetCode, weeks: number = 52): Promise<COTData[]> {
    // This would require parsing multiple weeks of data
    // For now, return current data
    const result = await this.scrapeData([asset]);
    return []; // Placeholder - implement historical parsing
  }

  /**
   * Calculate COT-based score for an asset
   */
  calculateCOTScore(cotData: COTData): number {
    let score = 0;

    // Commercial sentiment (smart money) - follow
    if (cotData.commercial_sentiment === 'BULLISH') score += 2;
    else if (cotData.commercial_sentiment === 'BEARISH') score -= 2;

    // Retail sentiment (dumb money) - contrarian
    if (cotData.retail_sentiment === 'BULLISH') score -= 1;
    else if (cotData.retail_sentiment === 'BEARISH') score += 1;

    // Non-commercial (speculators) - moderate weight
    if (cotData.non_commercial_net > 0) score += 0.5;
    else if (cotData.non_commercial_net < 0) score -= 0.5;

    return Math.max(-3, Math.min(3, score)); // Clamp to -3 to +3
  }
}
