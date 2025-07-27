/**
 * CFTC COT (Commitment of Traders) Data Pipeline
 * Comprehensive data collection for all 11 assets using CFTC Socrata API
 */

export interface COTDataPoint {
  asset: string;
  report_date: string;
  report_type: 'disaggregated' | 'tff';
  commercial_long: number;
  commercial_short: number;
  commercial_net: number;
  noncommercial_long: number;
  noncommercial_short: number;
  noncommercial_net: number;
  nonreportable_long: number;
  nonreportable_short: number;
  nonreportable_net: number;
  open_interest: number;
  commercial_pct: number;
  noncommercial_pct: number;
  week_change_commercial: number;
  week_change_noncommercial: number;
  data_source: string;
  last_updated: string;
  validation_passed: boolean;
}

export interface COTSymbolMapping {
  asset: string;
  cftc_code: string;
  cftc_name: string;
  dataset_id: string;
  report_type: 'disaggregated' | 'tff';
}

export class CFTCCOTScraper {
  private readonly BASE_URL = 'https://publicreporting.cftc.gov/resource';
  private readonly RATE_LIMIT_MS = 2000; // 2 seconds between requests
  private readonly MAX_RETRIES = 3;
  
  // Symbol mapping for all 11 assets (using correct CFTC contract codes)
  private readonly SYMBOL_MAPPINGS: COTSymbolMapping[] = [
    // Currencies (TFF - Traders in Financial Futures) - Using actual CFTC codes
    { asset: 'USD', cftc_code: '098662', cftc_name: 'U.S. DOLLAR INDEX', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'EUR', cftc_code: '099741', cftc_name: 'EURO FX', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'GBP', cftc_code: '096742', cftc_name: 'BRITISH POUND STERLING', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'JPY', cftc_code: '097741', cftc_name: 'JAPANESE YEN', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'AUD', cftc_code: '232741', cftc_name: 'AUSTRALIAN DOLLAR', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'CAD', cftc_code: '090741', cftc_name: 'CANADIAN DOLLAR', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'CHF', cftc_code: '092741', cftc_name: 'SWISS FRANC', dataset_id: 'jun7-fc8e', report_type: 'tff' },
    { asset: 'NZD', cftc_code: '112741', cftc_name: 'NEW ZEALAND DOLLAR', dataset_id: 'jun7-fc8e', report_type: 'tff' },

    // Precious Metals (Disaggregated) - Using actual CFTC codes
    { asset: 'XAU', cftc_code: '088691', cftc_name: 'GOLD', dataset_id: 'kh3c-gbw2', report_type: 'disaggregated' },
    { asset: 'XAG', cftc_code: '084691', cftc_name: 'SILVER', dataset_id: 'kh3c-gbw2', report_type: 'disaggregated' },

    // CNY (Synthetic - use USD index as proxy)
    { asset: 'CNY', cftc_code: '098662', cftc_name: 'U.S. DOLLAR INDEX (CNY PROXY)', dataset_id: 'jun7-fc8e', report_type: 'tff' }
  ];

  constructor() {
    console.log('[CFTC_COT] Initializing CFTC COT Data Scraper');
  }

  /**
   * Fetch COT data for all assets
   */
  async fetchAllCOTData(): Promise<COTDataPoint[]> {
    const allData: COTDataPoint[] = [];
    
    console.log('[CFTC_COT] Starting COT data collection for all assets...');
    
    for (const mapping of this.SYMBOL_MAPPINGS) {
      try {
        console.log(`[CFTC_COT] Fetching data for ${mapping.asset} (${mapping.cftc_code})`);
        
        const data = await this.fetchAssetCOTData(mapping);
        if (data) {
          allData.push(data);
          console.log(`[CFTC_COT] ✅ Successfully fetched ${mapping.asset} COT data`);
        } else {
          console.warn(`[CFTC_COT] ⚠️ No data returned for ${mapping.asset}`);
        }
        
        // Rate limiting
        await this.delay(this.RATE_LIMIT_MS);
        
      } catch (error) {
        console.error(`[CFTC_COT] ❌ Error fetching ${mapping.asset} COT data:`, error);
      }
    }
    
    console.log(`[CFTC_COT] Completed COT data collection. Retrieved ${allData.length}/${this.SYMBOL_MAPPINGS.length} assets`);
    return allData;
  }

  /**
   * Fetch COT data for a specific asset
   */
  private async fetchAssetCOTData(mapping: COTSymbolMapping): Promise<COTDataPoint | null> {
    const url = `${this.BASE_URL}/${mapping.dataset_id}.json`;
    const params = new URLSearchParams({
      '$where': `cftc_contract_market_code='${mapping.cftc_code}'`,
      '$order': 'report_date_as_yyyy_mm_dd DESC',
      '$limit': '1'
    });

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
          console.warn(`[CFTC_COT] No data found for ${mapping.asset}`);
          return null;
        }
        
        const latestRecord = data[0];
        return this.processCOTRecord(latestRecord, mapping);
        
      } catch (error) {
        console.error(`[CFTC_COT] Attempt ${attempt}/${this.MAX_RETRIES} failed for ${mapping.asset}:`, error);
        
        if (attempt === this.MAX_RETRIES) {
          throw error;
        }
        
        // Exponential backoff
        await this.delay(this.RATE_LIMIT_MS * Math.pow(2, attempt - 1));
      }
    }
    
    return null;
  }

  /**
   * Process raw CFTC record into standardized format
   */
  private processCOTRecord(record: any, mapping: COTSymbolMapping): COTDataPoint {
    // Extract positions based on report type
    let commercial_long: number, commercial_short: number;
    let noncommercial_long: number, noncommercial_short: number;
    let nonreportable_long: number, nonreportable_short: number;
    let open_interest: number;

    if (mapping.report_type === 'disaggregated') {
      // Disaggregated report (precious metals)
      commercial_long = parseInt(record.comm_positions_long_all) || 0;
      commercial_short = parseInt(record.comm_positions_short_all) || 0;
      noncommercial_long = parseInt(record.noncomm_positions_long_all) || 0;
      noncommercial_short = parseInt(record.noncomm_positions_short_all) || 0;
      nonreportable_long = parseInt(record.nonrept_positions_long_all) || 0;
      nonreportable_short = parseInt(record.nonrept_positions_short_all) || 0;
      open_interest = parseInt(record.open_interest_all) || 0;
    } else {
      // TFF report (currencies)
      commercial_long = parseInt(record.comm_positions_long_all) || 0;
      commercial_short = parseInt(record.comm_positions_short_all) || 0;
      noncommercial_long = parseInt(record.noncomm_positions_long_all) || 0;
      noncommercial_short = parseInt(record.noncomm_positions_short_all) || 0;
      nonreportable_long = parseInt(record.nonrept_positions_long_all) || 0;
      nonreportable_short = parseInt(record.nonrept_positions_short_all) || 0;
      open_interest = parseInt(record.open_interest_all) || 0;
    }

    // Calculate net positions
    const commercial_net = commercial_long - commercial_short;
    const noncommercial_net = noncommercial_long - noncommercial_short;
    const nonreportable_net = nonreportable_long - nonreportable_short;

    // Calculate percentages of open interest
    const commercial_pct = open_interest > 0 ? (Math.abs(commercial_net) / open_interest) * 100 : 0;
    const noncommercial_pct = open_interest > 0 ? (Math.abs(noncommercial_net) / open_interest) * 100 : 0;

    // Validation
    const validation_passed = this.validateCOTData({
      commercial_long,
      commercial_short,
      noncommercial_long,
      noncommercial_short,
      open_interest
    });

    return {
      asset: mapping.asset,
      report_date: record.report_date_as_yyyy_mm_dd,
      report_type: mapping.report_type,
      commercial_long,
      commercial_short,
      commercial_net,
      noncommercial_long,
      noncommercial_short,
      noncommercial_net,
      nonreportable_long,
      nonreportable_short,
      nonreportable_net,
      open_interest,
      commercial_pct,
      noncommercial_pct,
      week_change_commercial: 0, // Will be calculated with historical data
      week_change_noncommercial: 0, // Will be calculated with historical data
      data_source: 'CFTC_SOCRATA',
      last_updated: new Date().toISOString(),
      validation_passed
    };
  }

  /**
   * Validate COT data for accuracy
   */
  private validateCOTData(data: {
    commercial_long: number;
    commercial_short: number;
    noncommercial_long: number;
    noncommercial_short: number;
    open_interest: number;
  }): boolean {
    // Basic validation checks
    if (data.open_interest <= 0) return false;
    if (data.commercial_long < 0 || data.commercial_short < 0) return false;
    if (data.noncommercial_long < 0 || data.noncommercial_short < 0) return false;
    
    // Check if positions are reasonable relative to open interest
    const total_positions = data.commercial_long + data.commercial_short + 
                           data.noncommercial_long + data.noncommercial_short;
    
    // Total positions should be roughly 2x open interest (long + short)
    const ratio = total_positions / (data.open_interest * 2);
    if (ratio < 0.8 || ratio > 1.2) {
      console.warn('[CFTC_COT] Position/OI ratio outside expected range:', ratio);
      return false;
    }
    
    return true;
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get latest COT data for a specific asset
   */
  async getCOTDataForAsset(asset: string): Promise<COTDataPoint | null> {
    const mapping = this.SYMBOL_MAPPINGS.find(m => m.asset === asset);
    if (!mapping) {
      console.error(`[CFTC_COT] No mapping found for asset: ${asset}`);
      return null;
    }
    
    return await this.fetchAssetCOTData(mapping);
  }

  /**
   * Get supported assets
   */
  getSupportedAssets(): string[] {
    return this.SYMBOL_MAPPINGS.map(m => m.asset);
  }
}
