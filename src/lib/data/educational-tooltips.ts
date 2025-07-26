import type { EducationalTooltip } from '$lib/types/economic';

/**
 * Educational tooltips for macroeconomic indicators
 * Provides bilingual explanations of what each indicator means and why it matters
 */
export const EDUCATIONAL_TOOLTIPS: Record<string, EducationalTooltip> = {
	// Growth Indicators
	usd_gdp_growth: {
		title: 'GDP Growth Rate',
		title_de: 'BIP-Wachstumsrate',
		content: 'GDP measures the total value of all goods and services produced in the economy. A higher growth rate indicates economic expansion, which typically strengthens the currency as it suggests increased productivity and potential for higher interest rates.',
		content_de: 'Das BIP misst den Gesamtwert aller in der Wirtschaft produzierten Güter und Dienstleistungen. Eine höhere Wachstumsrate zeigt wirtschaftliche Expansion an, was typischerweise die Währung stärkt, da es erhöhte Produktivität und Potenzial für höhere Zinsen suggeriert.',
		learn_more_url: '/education/fundamental-analysis/gdp',
		related_indicators: ['usd_industrial_production', 'usd_retail_sales']
	},

	usd_industrial_production: {
		title: 'Industrial Production Index',
		title_de: 'Industrieproduktionsindex',
		content: 'Measures the real output of manufacturing, mining, and utilities. Rising industrial production indicates economic strength and can lead to increased employment and higher wages, supporting currency strength.',
		content_de: 'Misst die reale Produktion von Fertigung, Bergbau und Versorgungsunternehmen. Steigende Industrieproduktion zeigt wirtschaftliche Stärke an und kann zu erhöhter Beschäftigung und höheren Löhnen führen, was die Währungsstärke unterstützt.',
		learn_more_url: '/education/fundamental-analysis/industrial-production',
		related_indicators: ['usd_gdp_growth', 'usd_ism_manufacturing']
	},

	usd_retail_sales: {
		title: 'Retail Sales',
		title_de: 'Einzelhandelsumsätze',
		content: 'Consumer spending accounts for about 70% of US economic activity. Strong retail sales indicate robust consumer confidence and economic health, which typically supports the dollar.',
		content_de: 'Verbraucherausgaben machen etwa 70% der US-Wirtschaftsaktivität aus. Starke Einzelhandelsumsätze zeigen robustes Verbrauchervertrauen und wirtschaftliche Gesundheit an, was typischerweise den Dollar unterstützt.',
		learn_more_url: '/education/fundamental-analysis/retail-sales',
		related_indicators: ['usd_consumer_confidence', 'usd_gdp_growth']
	},

	// Inflation Metrics
	usd_cpi: {
		title: 'Consumer Price Index (CPI)',
		title_de: 'Verbraucherpreisindex (VPI)',
		content: 'CPI measures inflation by tracking price changes in a basket of consumer goods and services. Higher inflation may lead to interest rate increases, which typically strengthens the currency but can also signal economic overheating.',
		content_de: 'Der VPI misst Inflation durch Verfolgung von Preisveränderungen in einem Warenkorb von Verbrauchsgütern und -dienstleistungen. Höhere Inflation kann zu Zinserhöhungen führen, was typischerweise die Währung stärkt, aber auch wirtschaftliche Überhitzung signalisieren kann.',
		learn_more_url: '/education/fundamental-analysis/inflation',
		related_indicators: ['usd_core_cpi', 'usd_pce', 'usd_fed_funds']
	},

	usd_core_cpi: {
		title: 'Core CPI',
		title_de: 'Kern-VPI',
		content: 'Core CPI excludes volatile food and energy prices, providing a clearer view of underlying inflation trends. Central banks often focus on core inflation for monetary policy decisions.',
		content_de: 'Der Kern-VPI schließt volatile Lebensmittel- und Energiepreise aus und bietet eine klarere Sicht auf zugrundeliegende Inflationstrends. Zentralbanken konzentrieren sich oft auf Kerninflation für geldpolitische Entscheidungen.',
		learn_more_url: '/education/fundamental-analysis/core-inflation',
		related_indicators: ['usd_cpi', 'usd_core_pce', 'usd_fed_funds']
	},

	usd_pce: {
		title: 'Personal Consumption Expenditures (PCE)',
		title_de: 'Persönliche Konsumausgaben (PCE)',
		content: 'PCE is the Federal Reserve\'s preferred inflation measure. It tracks price changes in goods and services consumed by individuals and adjusts for changing consumer behavior.',
		content_de: 'PCE ist das bevorzugte Inflationsmaß der Federal Reserve. Es verfolgt Preisveränderungen bei Gütern und Dienstleistungen, die von Einzelpersonen konsumiert werden, und passt sich an veränderndes Verbraucherverhalten an.',
		learn_more_url: '/education/fundamental-analysis/pce',
		related_indicators: ['usd_core_pce', 'usd_cpi', 'usd_fed_funds']
	},

	// Labor Market
	usd_unemployment: {
		title: 'Unemployment Rate',
		title_de: 'Arbeitslosenquote',
		content: 'The percentage of the labor force that is unemployed and actively seeking work. Lower unemployment typically indicates a strong economy and can lead to wage inflation and higher interest rates.',
		content_de: 'Der Prozentsatz der Erwerbsbevölkerung, die arbeitslos ist und aktiv Arbeit sucht. Niedrigere Arbeitslosigkeit zeigt typischerweise eine starke Wirtschaft an und kann zu Lohninflation und höheren Zinsen führen.',
		learn_more_url: '/education/fundamental-analysis/unemployment',
		related_indicators: ['usd_nfp', 'usd_ahe', 'usd_lfpr']
	},

	usd_nfp: {
		title: 'Non-Farm Payrolls (NFP)',
		title_de: 'Beschäftigung außerhalb der Landwirtschaft (NFP)',
		content: 'NFP measures the change in employment excluding farm workers. It\'s one of the most watched economic indicators as it directly reflects economic health and can significantly impact currency movements.',
		content_de: 'NFP misst die Veränderung der Beschäftigung ohne Landarbeiter. Es ist einer der meistbeachteten Wirtschaftsindikatoren, da er direkt die wirtschaftliche Gesundheit widerspiegelt und Währungsbewegungen erheblich beeinflussen kann.',
		learn_more_url: '/education/fundamental-analysis/nfp',
		related_indicators: ['usd_unemployment', 'usd_ahe', 'usd_gdp_growth']
	},

	usd_ahe: {
		title: 'Average Hourly Earnings',
		title_de: 'Durchschnittlicher Stundenlohn',
		content: 'Measures wage inflation by tracking changes in hourly wages. Rising wages can fuel inflation concerns and influence Federal Reserve policy decisions.',
		content_de: 'Misst Lohninflation durch Verfolgung von Veränderungen der Stundenlöhne. Steigende Löhne können Inflationssorgen schüren und Entscheidungen der Federal Reserve beeinflussen.',
		learn_more_url: '/education/fundamental-analysis/wages',
		related_indicators: ['usd_nfp', 'usd_cpi', 'usd_fed_funds']
	},

	// Monetary Policy
	usd_fed_funds: {
		title: 'Federal Funds Rate',
		title_de: 'Federal Funds Rate',
		content: 'The interest rate at which banks lend to each other overnight. It\'s the primary tool of US monetary policy and directly affects all other interest rates, making it crucial for currency valuation.',
		content_de: 'Der Zinssatz, zu dem sich Banken über Nacht gegenseitig Geld leihen. Es ist das primäre Instrument der US-Geldpolitik und beeinflusst direkt alle anderen Zinssätze, was es für die Währungsbewertung entscheidend macht.',
		learn_more_url: '/education/fundamental-analysis/fed-funds-rate',
		related_indicators: ['usd_treasury_10y', 'usd_treasury_2y', 'usd_cpi']
	},

	usd_treasury_10y: {
		title: '10-Year Treasury Yield',
		title_de: '10-jährige Staatsanleihenrendite',
		content: 'Reflects long-term interest rate expectations and economic outlook. Higher yields often attract foreign investment, supporting the currency, but may also indicate inflation concerns.',
		content_de: 'Spiegelt langfristige Zinserwartungen und Wirtschaftsausblick wider. Höhere Renditen ziehen oft ausländische Investitionen an und stützen die Währung, können aber auch Inflationssorgen anzeigen.',
		learn_more_url: '/education/fundamental-analysis/treasury-yields',
		related_indicators: ['usd_treasury_2y', 'usd_fed_funds', 'usd_cpi']
	},

	// Sentiment Indicators
	usd_consumer_confidence: {
		title: 'Consumer Confidence Index',
		title_de: 'Verbrauchervertrauensindex',
		content: 'Measures consumer optimism about economic conditions. Higher confidence typically leads to increased spending, supporting economic growth and currency strength.',
		content_de: 'Misst Verbraucheroptimismus über wirtschaftliche Bedingungen. Höheres Vertrauen führt typischerweise zu erhöhten Ausgaben und unterstützt Wirtschaftswachstum und Währungsstärke.',
		learn_more_url: '/education/fundamental-analysis/consumer-confidence',
		related_indicators: ['usd_retail_sales', 'usd_michigan_sentiment', 'usd_gdp_growth']
	},

	usd_ism_manufacturing: {
		title: 'ISM Manufacturing PMI',
		title_de: 'ISM Verarbeitendes Gewerbe PMI',
		content: 'A leading indicator of economic health based on surveys of purchasing managers. Values above 50 indicate expansion, while below 50 suggests contraction.',
		content_de: 'Ein Frühindikator der Wirtschaftsgesundheit basierend auf Umfragen von Einkaufsleitern. Werte über 50 zeigen Expansion an, während unter 50 Kontraktion suggeriert.',
		learn_more_url: '/education/fundamental-analysis/pmi',
		related_indicators: ['usd_ism_services', 'usd_industrial_production', 'usd_gdp_growth']
	},

	// Trade Indicators
	usd_trade_balance: {
		title: 'Trade Balance',
		title_de: 'Handelsbilanz',
		content: 'The difference between exports and imports. A smaller deficit (or surplus) generally supports the currency as it indicates competitive exports and reduced reliance on foreign goods.',
		content_de: 'Die Differenz zwischen Exporten und Importen. Ein kleineres Defizit (oder Überschuss) stützt im Allgemeinen die Währung, da es wettbewerbsfähige Exporte und reduzierte Abhängigkeit von ausländischen Gütern anzeigt.',
		learn_more_url: '/education/fundamental-analysis/trade-balance',
		related_indicators: ['usd_current_account', 'usd_exports', 'usd_imports']
	},

	// Housing Indicators
	usd_building_permits: {
		title: 'Building Permits',
		title_de: 'Baugenehmigungen',
		content: 'A leading indicator of housing activity. More permits suggest future construction activity, which supports economic growth through job creation and increased spending.',
		content_de: 'Ein Frühindikator für Wohnungsaktivität. Mehr Genehmigungen deuten auf zukünftige Bautätigkeit hin, die Wirtschaftswachstum durch Arbeitsplatzschaffung und erhöhte Ausgaben unterstützt.',
		learn_more_url: '/education/fundamental-analysis/housing-indicators',
		related_indicators: ['usd_housing_starts', 'usd_new_home_sales', 'usd_gdp_growth']
	},

	// Fiscal Policy
	usd_budget_balance: {
		title: 'Federal Budget Balance',
		title_de: 'Bundeshaushaltssaldo',
		content: 'The difference between government revenues and expenditures. Large deficits may raise concerns about fiscal sustainability and long-term currency strength.',
		content_de: 'Die Differenz zwischen Regierungseinnahmen und -ausgaben. Große Defizite können Bedenken über fiskalische Nachhaltigkeit und langfristige Währungsstärke aufwerfen.',
		learn_more_url: '/education/fundamental-analysis/fiscal-policy',
		related_indicators: ['usd_debt_gdp', 'usd_gov_spending']
	},

	// EUR Growth Indicators
	eur_gdp_growth: {
		title: 'Eurozone GDP Growth Rate',
		title_de: 'Eurozone BIP-Wachstumsrate',
		content: 'Measures quarterly economic growth across the 19-member Eurozone. As a currency union, Eurozone GDP reflects the aggregate performance of diverse economies, making it crucial for EUR valuation.',
		content_de: 'Misst quartalsweises Wirtschaftswachstum in der 19-Mitglieder-Eurozone. Als Währungsunion spiegelt das Eurozone-BIP die Gesamtleistung verschiedener Volkswirtschaften wider und ist entscheidend für die EUR-Bewertung.',
		learn_more_url: '/education/fundamental-analysis/eurozone-gdp',
		related_indicators: ['eur_industrial_production', 'eur_retail_sales', 'eur_pmi_composite']
	},

	eur_industrial_production: {
		title: 'Eurozone Industrial Production',
		title_de: 'Eurozone Industrieproduktion',
		content: 'Tracks manufacturing output across the Eurozone, with particular importance given Germany\'s industrial dominance. Changes reflect the health of the export-oriented European economy.',
		content_de: 'Verfolgt die Fertigungsproduktion in der Eurozone, mit besonderer Bedeutung angesichts Deutschlands industrieller Dominanz. Veränderungen spiegeln die Gesundheit der exportorientierten europäischen Wirtschaft wider.',
		learn_more_url: '/education/fundamental-analysis/eurozone-industrial-production',
		related_indicators: ['eur_gdp_growth', 'eur_pmi_manufacturing', 'eur_trade_balance']
	},

	eur_retail_sales: {
		title: 'Eurozone Retail Sales',
		title_de: 'Eurozone Einzelhandelsumsätze',
		content: 'Measures consumer spending across the Eurozone. Given the diverse economic conditions across member states, this indicator provides insight into overall consumer health and confidence.',
		content_de: 'Misst Verbraucherausgaben in der Eurozone. Angesichts der unterschiedlichen wirtschaftlichen Bedingungen in den Mitgliedstaaten bietet dieser Indikator Einblick in die allgemeine Verbrauchergesundheit und das Vertrauen.',
		learn_more_url: '/education/fundamental-analysis/eurozone-retail-sales',
		related_indicators: ['eur_consumer_confidence', 'eur_gdp_growth', 'eur_employment_growth']
	},

	// EUR Inflation Metrics
	eur_hicp: {
		title: 'Eurozone HICP (Harmonized Index of Consumer Prices)',
		title_de: 'Eurozone HVPI (Harmonisierter Verbraucherpreisindex)',
		content: 'The ECB\'s primary inflation measure for the Eurozone, targeting 2% inflation. HICP harmonizes price measurements across all member states, making it crucial for ECB monetary policy decisions.',
		content_de: 'Das primäre Inflationsmaß der EZB für die Eurozone mit einem Inflationsziel von 2%. Der HVPI harmonisiert Preismessungen in allen Mitgliedstaaten und ist entscheidend für geldpolitische EZB-Entscheidungen.',
		learn_more_url: '/education/fundamental-analysis/eurozone-hicp',
		related_indicators: ['eur_core_hicp', 'eur_ecb_deposit_rate', 'eur_ppi']
	},

	eur_core_hicp: {
		title: 'Eurozone Core HICP',
		title_de: 'Eurozone Kern-HVPI',
		content: 'HICP excluding volatile energy and food prices, providing the ECB with a clearer view of underlying inflation trends across the currency union. Critical for assessing persistent inflation pressures.',
		content_de: 'HVPI ohne volatile Energie- und Lebensmittelpreise, bietet der EZB eine klarere Sicht auf zugrundeliegende Inflationstrends in der Währungsunion. Entscheidend für die Bewertung anhaltender Inflationsdrücke.',
		learn_more_url: '/education/fundamental-analysis/eurozone-core-hicp',
		related_indicators: ['eur_hicp', 'eur_wage_growth', 'eur_ecb_main_rate']
	},

	// EUR Labor Market
	eur_unemployment: {
		title: 'Eurozone Unemployment Rate',
		title_de: 'Eurozone Arbeitslosenquote',
		content: 'Aggregate unemployment across the 19 Eurozone countries. Significant disparities exist between member states, with this rate representing the weighted average of diverse labor market conditions.',
		content_de: 'Gesamtarbeitslosigkeit in den 19 Eurozone-Ländern. Erhebliche Unterschiede zwischen Mitgliedstaaten bestehen, wobei diese Rate den gewichteten Durchschnitt verschiedener Arbeitsmarktbedingungen darstellt.',
		learn_more_url: '/education/fundamental-analysis/eurozone-unemployment',
		related_indicators: ['eur_employment_growth', 'eur_wage_growth', 'eur_consumer_confidence']
	},

	eur_wage_growth: {
		title: 'Eurozone Wage Growth',
		title_de: 'Eurozone Lohnwachstum',
		content: 'Tracks negotiated wage increases across the Eurozone. The ECB closely monitors wage growth as a key driver of services inflation and potential second-round effects from energy price shocks.',
		content_de: 'Verfolgt ausgehandelte Lohnerhöhungen in der Eurozone. Die EZB überwacht Lohnwachstum genau als Haupttreiber der Dienstleistungsinflation und möglicher Zweitrundeneffekte von Energiepreisschocks.',
		learn_more_url: '/education/fundamental-analysis/eurozone-wages',
		related_indicators: ['eur_unit_labor_costs', 'eur_core_hicp', 'eur_employment_growth']
	},

	// EUR Monetary Policy
	eur_ecb_deposit_rate: {
		title: 'ECB Deposit Facility Rate',
		title_de: 'EZB Einlagefazilitätssatz',
		content: 'The ECB\'s key policy rate since 2014, setting the floor for money market rates. This rate directly influences EUR strength through its impact on yield differentials with other major currencies.',
		content_de: 'Der wichtigste Leitzins der EZB seit 2014, setzt die Untergrenze für Geldmarktzinsen. Dieser Zinssatz beeinflusst direkt die EUR-Stärke durch seine Auswirkung auf Renditedifferenzen zu anderen Hauptwährungen.',
		learn_more_url: '/education/fundamental-analysis/ecb-deposit-rate',
		related_indicators: ['eur_ecb_main_rate', 'eur_bund_10y', 'eur_hicp']
	},

	eur_bund_10y: {
		title: 'German 10-Year Bund Yield',
		title_de: '10-jährige deutsche Bundesanleihenrendite',
		content: 'The benchmark for Eurozone long-term interest rates. German Bunds are considered the safest Eurozone asset, with yields serving as the reference point for peripheral spreads and ECB policy effectiveness.',
		content_de: 'Der Maßstab für langfristige Zinssätze in der Eurozone. Deutsche Bundesanleihen gelten als sicherste Eurozone-Anlage, wobei Renditen als Referenzpunkt für periphere Spreads und EZB-Politikwirksamkeit dienen.',
		learn_more_url: '/education/fundamental-analysis/german-bunds',
		related_indicators: ['eur_italian_spread', 'eur_spanish_spread', 'eur_ecb_deposit_rate']
	},

	eur_italian_spread: {
		title: 'Italy-Germany 10Y Spread',
		title_de: 'Italien-Deutschland 10J-Spread',
		content: 'The yield difference between Italian and German 10-year bonds, indicating peripheral risk and Eurozone fragmentation. Widening spreads suggest increased political or fiscal concerns about Italy.',
		content_de: 'Die Renditedifferenz zwischen italienischen und deutschen 10-jährigen Anleihen, zeigt peripheres Risiko und Eurozone-Fragmentierung an. Sich weitende Spreads deuten auf erhöhte politische oder fiskalische Bedenken über Italien hin.',
		learn_more_url: '/education/fundamental-analysis/peripheral-spreads',
		related_indicators: ['eur_spanish_spread', 'eur_bund_10y', 'eur_debt_gdp']
	},

	// EUR Sentiment Indicators
	eur_esi: {
		title: 'Economic Sentiment Indicator (ESI)',
		title_de: 'Wirtschaftsstimmungsindikator (ESI)',
		content: 'A composite indicator measuring economic sentiment across industry, services, consumers, construction, and retail trade in the EU. Values above 100 indicate above-average confidence.',
		content_de: 'Ein zusammengesetzter Indikator, der die Wirtschaftsstimmung in Industrie, Dienstleistungen, Verbrauchern, Bau und Einzelhandel in der EU misst. Werte über 100 zeigen überdurchschnittliches Vertrauen an.',
		learn_more_url: '/education/fundamental-analysis/eurozone-esi',
		related_indicators: ['eur_consumer_confidence', 'eur_pmi_composite', 'eur_ifo']
	},

	eur_ifo: {
		title: 'IFO Business Climate Index',
		title_de: 'IFO Geschäftsklimaindex',
		content: 'Germany\'s premier business sentiment indicator, surveying 9,000 companies monthly. As Europe\'s largest economy, German business confidence significantly impacts overall Eurozone sentiment and EUR strength.',
		content_de: 'Deutschlands führender Geschäftsstimmungsindikator, befragt monatlich 9.000 Unternehmen. Als Europas größte Volkswirtschaft beeinflusst deutsches Geschäftsvertrauen erheblich die Gesamtstimmung der Eurozone und EUR-Stärke.',
		learn_more_url: '/education/fundamental-analysis/ifo-index',
		related_indicators: ['eur_zew', 'eur_pmi_manufacturing', 'eur_industrial_production']
	},

	eur_zew: {
		title: 'ZEW Economic Sentiment',
		title_de: 'ZEW Konjunkturerwartungen',
		content: 'Forward-looking indicator based on surveys of financial market experts about German economic expectations. Often serves as an early warning system for changes in economic direction.',
		content_de: 'Zukunftsorientierter Indikator basierend auf Umfragen von Finanzmarktexperten über deutsche Wirtschaftserwartungen. Dient oft als Frühwarnsystem für Änderungen der Wirtschaftsrichtung.',
		learn_more_url: '/education/fundamental-analysis/zew-indicator',
		related_indicators: ['eur_ifo', 'eur_gdp_growth', 'eur_bund_10y']
	},

	eur_pmi_composite: {
		title: 'Eurozone PMI Composite',
		title_de: 'Eurozone PMI Gesamt',
		content: 'Combines manufacturing and services PMI data across the Eurozone. Values above 50 indicate expansion, below 50 contraction. Critical for assessing real-time economic momentum across the currency union.',
		content_de: 'Kombiniert Fertigungs- und Dienstleistungs-PMI-Daten in der Eurozone. Werte über 50 zeigen Expansion an, unter 50 Kontraktion. Entscheidend für die Bewertung der Echtzeit-Wirtschaftsdynamik in der Währungsunion.',
		learn_more_url: '/education/fundamental-analysis/eurozone-pmi',
		related_indicators: ['eur_pmi_manufacturing', 'eur_pmi_services', 'eur_gdp_growth']
	},

	// EUR Trade Indicators
	eur_trade_balance: {
		title: 'Eurozone Trade Balance',
		title_de: 'Eurozone Handelsbilanz',
		content: 'The difference between Eurozone exports and imports. A strong trade surplus supports EUR demand, reflecting the competitiveness of European goods and services in global markets.',
		content_de: 'Die Differenz zwischen Eurozone-Exporten und -Importen. Ein starker Handelsüberschuss unterstützt EUR-Nachfrage und spiegelt die Wettbewerbsfähigkeit europäischer Güter und Dienstleistungen auf globalen Märkten wider.',
		learn_more_url: '/education/fundamental-analysis/eurozone-trade',
		related_indicators: ['eur_current_account', 'eur_industrial_production', 'eur_pmi_manufacturing']
	},

	eur_target2: {
		title: 'Target2 Balances',
		title_de: 'Target2-Salden',
		content: 'Imbalances in the Eurozone\'s payment system, reflecting capital flows between member countries. Large imbalances can indicate financial stress or fragmentation within the currency union.',
		content_de: 'Ungleichgewichte im Zahlungssystem der Eurozone, spiegeln Kapitalflüsse zwischen Mitgliedsländern wider. Große Ungleichgewichte können auf finanziellen Stress oder Fragmentierung in der Währungsunion hindeuten.',
		learn_more_url: '/education/fundamental-analysis/target2-balances',
		related_indicators: ['eur_italian_spread', 'eur_spanish_spread', 'eur_current_account']
	},

	// EUR Housing & Fiscal
	eur_house_prices: {
		title: 'Eurozone House Price Index',
		title_de: 'Eurozone Hauspreisindex',
		content: 'Tracks residential property price changes across the Eurozone. Rising house prices can indicate wealth effects supporting consumption, while rapid increases may signal bubble risks.',
		content_de: 'Verfolgt Wohnimmobilienpreisveränderungen in der Eurozone. Steigende Hauspreise können Vermögenseffekte anzeigen, die den Konsum unterstützen, während schnelle Anstiege Blasenrisiken signalisieren können.',
		learn_more_url: '/education/fundamental-analysis/eurozone-housing',
		related_indicators: ['eur_building_permits', 'eur_construction', 'eur_consumer_confidence']
	},

	eur_debt_gdp: {
		title: 'Eurozone Debt-to-GDP Ratio',
		title_de: 'Eurozone Schulden-zu-BIP-Verhältnis',
		content: 'Aggregate government debt across Eurozone countries as percentage of GDP. High debt levels can constrain fiscal policy and raise concerns about long-term sustainability, affecting EUR sentiment.',
		content_de: 'Gesamte Staatsschuld der Eurozone-Länder als Prozentsatz des BIP. Hohe Schuldenstände können Fiskalpolitik einschränken und Bedenken über langfristige Nachhaltigkeit aufwerfen, was EUR-Stimmung beeinflusst.',
		learn_more_url: '/education/fundamental-analysis/eurozone-fiscal',
		related_indicators: ['eur_deficit_ratio', 'eur_fiscal_impulse', 'eur_italian_spread']
	},

	// GBP Growth Indicators
	gbp_gdp_quarterly: {
		title: 'UK GDP Growth (Quarterly)',
		title_de: 'UK BIP-Wachstum (Quartalsweise)',
		content: 'Measures quarterly economic growth in the UK. The UK economy is heavily service-oriented (~80%), making services performance crucial for overall GDP.',
		content_de: 'Misst quartalsweises Wirtschaftswachstum im Vereinigten Königreich. Die britische Wirtschaft ist stark dienstleistungsorientiert (~80%), wodurch die Dienstleistungsleistung entscheidend für das Gesamt-BIP ist.',
		learn_more_url: '/education/fundamental-analysis/uk-gdp',
		related_indicators: ['gbp_gdp_monthly', 'gbp_services_pmi', 'gbp_retail_sales_excl']
	},

	gbp_gdp_monthly: {
		title: 'UK GDP Growth (Monthly)',
		title_de: 'UK BIP-Wachstum (Monatlich)',
		content: 'Unique monthly GDP estimate providing early insight into UK economic performance. The UK is the only major economy to publish monthly GDP data, offering traders early signals.',
		content_de: 'Einzigartige monatliche BIP-Schätzung, die frühe Einblicke in die britische Wirtschaftsleistung bietet. Das Vereinigte Königreich ist die einzige große Volkswirtschaft, die monatliche BIP-Daten veröffentlicht.',
		learn_more_url: '/education/fundamental-analysis/uk-monthly-gdp',
		related_indicators: ['gbp_gdp_quarterly', 'gbp_industrial_production', 'gbp_services_pmi']
	},

	gbp_services_pmi: {
		title: 'UK Services PMI',
		title_de: 'UK Dienstleistungs-PMI',
		content: 'Critical for GBP as services represent ~80% of the UK economy. Values above 50 indicate expansion in the dominant economic sector, strongly supporting GBP strength.',
		content_de: 'Entscheidend für GBP, da Dienstleistungen ~80% der britischen Wirtschaft ausmachen. Werte über 50 zeigen Expansion im dominanten Wirtschaftssektor an und unterstützen stark GBP-Stärke.',
		learn_more_url: '/education/fundamental-analysis/uk-services-pmi',
		related_indicators: ['gbp_pmi_manufacturing', 'gbp_retail_sales_excl', 'gbp_gdp_monthly']
	},

	// GBP Inflation Indicators
	gbp_cpi: {
		title: 'UK Consumer Price Index',
		title_de: 'UK Verbraucherpreisindex',
		content: 'The BoE\'s primary inflation measure targeting 2% inflation. UK inflation has been particularly volatile due to Brexit effects, energy prices, and supply chain disruptions.',
		content_de: 'Das primäre Inflationsmaß der BoE mit einem Inflationsziel von 2%. Die britische Inflation war besonders volatil aufgrund von Brexit-Effekten, Energiepreisen und Lieferkettenunterbrechungen.',
		learn_more_url: '/education/fundamental-analysis/uk-cpi',
		related_indicators: ['gbp_core_cpi', 'gbp_bank_rate', 'gbp_ppi_input']
	},

	gbp_core_cpi: {
		title: 'UK Core CPI',
		title_de: 'UK Kern-VPI',
		content: 'CPI excluding volatile energy and food prices. Core CPI remaining elevated above BoE target suggests persistent inflation pressures requiring continued restrictive monetary policy.',
		content_de: 'VPI ohne volatile Energie- und Lebensmittelpreise. Kern-VPI, der über dem BoE-Ziel erhöht bleibt, deutet auf anhaltende Inflationsdrücke hin, die weiterhin restriktive Geldpolitik erfordern.',
		learn_more_url: '/education/fundamental-analysis/uk-core-cpi',
		related_indicators: ['gbp_cpi', 'gbp_weekly_earnings', 'gbp_bank_rate']
	},

	gbp_hpi_halifax: {
		title: 'Halifax House Price Index',
		title_de: 'Halifax Hauspreisindex',
		content: 'UK house prices are crucial for economic sentiment due to high homeownership rates and variable rate mortgages. Falling prices reduce wealth effects and consumer spending.',
		content_de: 'Britische Hauspreise sind entscheidend für die Wirtschaftsstimmung aufgrund hoher Eigentumsquoten und variabler Hypothekenzinsen. Fallende Preise reduzieren Vermögenseffekte und Verbraucherausgaben.',
		learn_more_url: '/education/fundamental-analysis/uk-house-prices',
		related_indicators: ['gbp_nationwide_prices', 'gbp_mortgage_approvals', 'gbp_bank_rate']
	},

	// GBP Labor Market
	gbp_unemployment: {
		title: 'UK ILO Unemployment Rate',
		title_de: 'UK ILO Arbeitslosenquote',
		content: 'Rising unemployment indicates labor market softening, potentially supporting BoE dovish policy stance. The UK labor market has shown resilience but is now showing signs of cooling.',
		content_de: 'Steigende Arbeitslosigkeit zeigt Arbeitsmarktschwächung an, könnte BoE-taubenhafte Politikhaltung unterstützen. Der britische Arbeitsmarkt zeigte Widerstandsfähigkeit, zeigt aber nun Anzeichen einer Abkühlung.',
		learn_more_url: '/education/fundamental-analysis/uk-unemployment',
		related_indicators: ['gbp_employment_change', 'gbp_weekly_earnings', 'gbp_claimant_count']
	},

	gbp_weekly_earnings: {
		title: 'UK Average Weekly Earnings',
		title_de: 'UK Durchschnittliche Wochenlöhne',
		content: 'Wage growth is closely monitored by the BoE for inflation implications. Slowing wage growth reduces inflation pressures and supports dovish policy expectations.',
		content_de: 'Lohnwachstum wird von der BoE genau auf Inflationsauswirkungen überwacht. Verlangsamtes Lohnwachstum reduziert Inflationsdrücke und unterstützt taubenhafte Politikerwartungen.',
		learn_more_url: '/education/fundamental-analysis/uk-wages',
		related_indicators: ['gbp_unemployment', 'gbp_core_cpi', 'gbp_employment_change']
	},

	// GBP Monetary Policy
	gbp_bank_rate: {
		title: 'BoE Bank Rate',
		title_de: 'BoE Leitzins',
		content: 'The Bank of England\'s key policy rate directly influences GBP strength. Higher rates typically strengthen GBP through yield differentials and economic expectations.',
		content_de: 'Der wichtigste Leitzins der Bank of England beeinflusst direkt die GBP-Stärke. Höhere Zinsen stärken typischerweise GBP durch Renditedifferenzen und wirtschaftliche Erwartungen.',
		learn_more_url: '/education/fundamental-analysis/boe-bank-rate',
		related_indicators: ['gbp_gilt_2y', 'gbp_gilt_10y', 'gbp_cpi']
	},

	gbp_gilt_10y: {
		title: 'UK 10-Year Gilt Yield',
		title_de: 'UK 10-jährige Staatsanleihenrendite',
		content: 'Benchmark for UK long-term interest rates. Rising gilt yields attract foreign capital and support GBP strength, but also reflect fiscal and political risk premiums.',
		content_de: 'Maßstab für britische langfristige Zinssätze. Steigende Gilt-Renditen ziehen ausländisches Kapital an und unterstützen GBP-Stärke, spiegeln aber auch fiskalische und politische Risikoprämien wider.',
		learn_more_url: '/education/fundamental-analysis/uk-gilts',
		related_indicators: ['gbp_gilt_2y', 'gbp_bank_rate', 'gbp_psnb']
	},

	// GBP Trade Indicators
	gbp_current_account: {
		title: 'UK Current Account Balance',
		title_de: 'UK Leistungsbilanz',
		content: 'The UK runs a chronic current account deficit (~4-5% of GDP), requiring capital inflows to finance. This makes GBP vulnerable to sentiment shifts and risk-off periods.',
		content_de: 'Das Vereinigte Königreich hat ein chronisches Leistungsbilanzdefizit (~4-5% des BIP), das Kapitalzuflüsse zur Finanzierung erfordert. Dies macht GBP anfällig für Stimmungsveränderungen und Risk-off-Perioden.',
		learn_more_url: '/education/fundamental-analysis/uk-current-account',
		related_indicators: ['gbp_trade_balance', 'gbp_terms_of_trade', 'gbp_export_prices']
	},

	// GBP Housing Market
	gbp_mortgage_approvals: {
		title: 'UK Mortgage Approvals',
		title_de: 'UK Hypothekengenehmigungen',
		content: 'Leading indicator of housing market activity. Declining approvals indicate cooling housing market due to higher interest rates, affecting consumer wealth and spending.',
		content_de: 'Frühindikator für Wohnungsmarktaktivität. Sinkende Genehmigungen zeigen abkühlenden Wohnungsmarkt aufgrund höherer Zinsen an, beeinflussen Verbrauchervermögen und -ausgaben.',
		learn_more_url: '/education/fundamental-analysis/uk-mortgage-approvals',
		related_indicators: ['gbp_halifax_prices', 'gbp_nationwide_prices', 'gbp_bank_rate']
	},

	// GBP Fiscal Policy
	gbp_psnb: {
		title: 'Public Sector Net Borrowing (PSNB)',
		title_de: 'Öffentliche Nettokreditaufnahme (PSNB)',
		content: 'UK government\'s monthly borrowing requirement. Lower PSNB indicates improving fiscal position, supporting GBP and reducing gilt supply pressures. Politically sensitive metric.',
		content_de: 'Monatlicher Kreditbedarf der britischen Regierung. Niedrigere PSNB zeigt sich verbessernde fiskalische Position an, unterstützt GBP und reduziert Gilt-Angebotsdruck. Politisch sensibler Indikator.',
		learn_more_url: '/education/fundamental-analysis/uk-psnb',
		related_indicators: ['gbp_debt_gdp', 'gbp_gilt_10y', 'gbp_gov_investment']
	},

	// JPY Growth Indicators
	jpy_gdp_growth: {
		title: 'Japan GDP Growth Rate',
		content: 'Japan\'s GDP growth reflects the health of the world\'s third-largest economy. Despite structural challenges like aging demographics, positive growth can support JPY, though the impact is often muted by ultra-loose monetary policy.',
		learn_more_url: '/education/fundamental-analysis/japan-gdp',
		related_indicators: ['jpy_industrial_production', 'jpy_retail_sales', 'jpy_tankan_large_mfg']
	},

	jpy_industrial_production: {
		title: 'Japan Industrial Production',
		content: 'Critical for Japan\'s export-oriented economy. Rising industrial production indicates manufacturing strength and export competitiveness, which can support JPY especially during global growth periods.',
		learn_more_url: '/education/fundamental-analysis/japan-industrial-production',
		related_indicators: ['jpy_gdp_growth', 'jpy_exports', 'jpy_manufacturing_pmi']
	},

	jpy_retail_sales: {
		title: 'Japan Retail Sales',
		content: 'Measures domestic consumption in Japan. Strong retail sales are particularly significant given Japan\'s aging demographics and deflationary history, indicating improved consumer confidence.',
		learn_more_url: '/education/fundamental-analysis/japan-retail-sales',
		related_indicators: ['jpy_consumer_confidence', 'jpy_gdp_growth']
	},

	jpy_tankan_large_mfg: {
		title: 'Tankan Large Manufacturing Index',
		content: 'Bank of Japan\'s quarterly survey of large manufacturers. This is one of the most closely watched Japanese indicators as it reflects business sentiment in Japan\'s key export sector.',
		learn_more_url: '/education/fundamental-analysis/tankan-survey',
		related_indicators: ['jpy_tankan_large_non_mfg', 'jpy_industrial_production', 'jpy_exports']
	},

	jpy_tankan_large_non_mfg: {
		title: 'Tankan Large Non-Manufacturing Index',
		content: 'Measures sentiment among large service sector companies. Important for gauging domestic demand strength, which is crucial for Japan\'s transition from export-dependent to domestic-driven growth.',
		learn_more_url: '/education/fundamental-analysis/tankan-survey',
		related_indicators: ['jpy_tankan_large_mfg', 'jpy_retail_sales', 'jpy_services_pmi']
	},

	jpy_tankan_small_mfg: {
		title: 'Tankan Small Manufacturing Index',
		content: 'Reflects sentiment among smaller manufacturers. These companies are often more sensitive to domestic conditions and labor market tightness, providing insight into broader economic health.',
		learn_more_url: '/education/fundamental-analysis/tankan-survey',
		related_indicators: ['jpy_tankan_large_mfg', 'jpy_labor_shortage']
	},

	jpy_tankan_small_non_mfg: {
		title: 'Tankan Small Non-Manufacturing Index',
		content: 'Measures sentiment among small service companies. These businesses are closely tied to local economic conditions and consumer spending patterns.',
		learn_more_url: '/education/fundamental-analysis/tankan-survey',
		related_indicators: ['jpy_tankan_large_non_mfg', 'jpy_consumer_confidence']
	},

	// JPY Inflation Metrics
	jpy_cpi_national: {
		title: 'Japan CPI (National)',
		content: 'Japan\'s national inflation rate. After decades of deflation, sustained inflation above BoJ\'s 2% target is crucial for potential monetary policy normalization, which could significantly strengthen JPY.',
		learn_more_url: '/education/fundamental-analysis/japan-inflation',
		related_indicators: ['jpy_cpi_tokyo', 'jpy_core_cpi', 'jpy_boj_rate']
	},

	jpy_cpi_tokyo: {
		title: 'Japan CPI (Tokyo)',
		content: 'Tokyo area inflation, released earlier than national CPI. Serves as a leading indicator for national inflation trends and provides early insight into BoJ policy considerations.',
		learn_more_url: '/education/fundamental-analysis/japan-inflation',
		related_indicators: ['jpy_cpi_national', 'jpy_core_cpi']
	},

	jpy_core_cpi: {
		title: 'Japan Core CPI',
		content: 'CPI excluding fresh food. This is the BoJ\'s preferred inflation measure. Sustained readings above 2% could eventually lead to policy normalization, dramatically impacting JPY.',
		learn_more_url: '/education/fundamental-analysis/japan-inflation',
		related_indicators: ['jpy_cpi_national', 'jpy_boj_rate', 'jpy_jgb_10y']
	},

	jpy_cgpi: {
		title: 'Corporate Goods Price Index',
		content: 'Japan\'s producer price index. Leading indicator of consumer inflation, reflecting cost pressures in the production chain. Important for understanding inflation pipeline effects.',
		learn_more_url: '/education/fundamental-analysis/japan-inflation',
		related_indicators: ['jpy_cpi_national', 'jpy_core_cpi']
	},

	jpy_inflation_exp_5y: {
		title: '5-Year Inflation Expectations',
		content: 'Market-based measure of long-term inflation expectations. Rising expectations may signal changing views on BoJ policy normalization timeline and Japan\'s escape from deflation.',
		learn_more_url: '/education/fundamental-analysis/inflation-expectations',
		related_indicators: ['jpy_core_cpi', 'jpy_boj_rate', 'jpy_jgb_10y']
	},

	// JPY Labor Market
	jpy_unemployment: {
		title: 'Japan Unemployment Rate',
		content: 'Japan maintains structurally low unemployment due to demographic challenges and cultural employment practices. Changes in unemployment can signal shifts in labor market tightness and wage pressure.',
		learn_more_url: '/education/fundamental-analysis/japan-labor-market',
		related_indicators: ['jpy_job_applicant_ratio', 'jpy_labor_costs', 'jpy_shunto_wages']
	},

	jpy_job_applicant_ratio: {
		title: 'Job-to-Applicant Ratio',
		content: 'Unique Japanese indicator measuring job openings per applicant. Ratios above 1.0 indicate tight labor markets, potentially leading to wage pressures and inflation.',
		learn_more_url: '/education/fundamental-analysis/japan-labor-market',
		related_indicators: ['jpy_unemployment', 'jpy_labor_shortage', 'jpy_shunto_wages']
	},

	jpy_labor_costs: {
		title: 'Japan Labor Costs',
		content: 'Total labor costs including wages and benefits. Rising labor costs are crucial for Japan\'s inflation target achievement and potential BoJ policy normalization.',
		learn_more_url: '/education/fundamental-analysis/japan-labor-market',
		related_indicators: ['jpy_shunto_wages', 'jpy_core_cpi', 'jpy_boj_rate']
	},

	jpy_labor_shortage: {
		title: 'Labor Shortage Indicators',
		content: 'Reflects Japan\'s demographic challenges with an aging population. Widespread labor shortages drive automation investment and may eventually lead to wage inflation.',
		learn_more_url: '/education/fundamental-analysis/japan-demographics',
		related_indicators: ['jpy_job_applicant_ratio', 'jpy_shunto_wages']
	},

	jpy_shunto_wages: {
		title: 'Shunto Wage Negotiations',
		content: 'Annual spring wage negotiations setting wage trends across Japan. Strong Shunto results are crucial for BoJ\'s inflation target and policy normalization considerations.',
		learn_more_url: '/education/fundamental-analysis/shunto-wages',
		related_indicators: ['jpy_labor_costs', 'jpy_core_cpi', 'jpy_boj_rate']
	},

	// JPY Trade & Balance
	jpy_trade_balance: {
		title: 'Japan Trade Balance',
		content: 'Japan\'s trade balance reflects export competitiveness and import dependency, especially for energy. Improving balance supports JPY through increased foreign currency inflows.',
		learn_more_url: '/education/fundamental-analysis/japan-trade',
		related_indicators: ['jpy_current_account', 'jpy_exports', 'jpy_imports']
	},

	jpy_current_account: {
		title: 'Japan Current Account Balance',
		content: 'Japan maintains a persistent current account surplus, reflecting its net creditor status. This structural surplus provides fundamental support for JPY strength.',
		learn_more_url: '/education/fundamental-analysis/japan-trade',
		related_indicators: ['jpy_trade_balance', 'jpy_forex_reserves']
	},

	jpy_forex_reserves: {
		title: 'Japan Foreign Exchange Reserves',
		content: 'Large forex reserves provide policy flexibility and market confidence. Japan occasionally intervenes in FX markets to prevent excessive JPY strength that could hurt exports.',
		learn_more_url: '/education/fundamental-analysis/fx-intervention',
		related_indicators: ['jpy_current_account', 'jpy_trade_balance']
	},

	jpy_exports: {
		title: 'Japan Export Values',
		content: 'Japan\'s export performance reflects global demand for Japanese goods and competitiveness. Strong exports support JPY but may also attract BoJ intervention if JPY strengthens too much.',
		learn_more_url: '/education/fundamental-analysis/japan-trade',
		related_indicators: ['jpy_trade_balance', 'jpy_industrial_production']
	},

	jpy_imports: {
		title: 'Japan Import Values',
		content: 'Japan imports significant energy and raw materials. Import trends reflect domestic demand strength and energy price impacts on the trade balance.',
		learn_more_url: '/education/fundamental-analysis/japan-trade',
		related_indicators: ['jpy_trade_balance', 'jpy_retail_sales']
	},

	// JPY Monetary Policy
	jpy_boj_rate: {
		title: 'BoJ Policy Rate',
		content: 'Bank of Japan maintains negative interest rates as part of ultra-loose monetary policy. Any move toward normalization would have dramatic implications for JPY strength.',
		learn_more_url: '/education/fundamental-analysis/boj-policy',
		related_indicators: ['jpy_jgb_10y', 'jpy_core_cpi', 'jpy_expected_boj_6m']
	},

	jpy_jgb_10y: {
		title: '10-Year JGB Yield',
		content: 'Subject to BoJ\'s Yield Curve Control (YCC) targeting around 0%. Rising yields may signal market pressure for policy normalization or BoJ tolerance for higher rates.',
		learn_more_url: '/education/fundamental-analysis/yield-curve-control',
		related_indicators: ['jpy_boj_rate', 'jpy_boj_balance_sheet', 'jpy_core_cpi']
	},

	jpy_boj_balance_sheet: {
		title: 'BoJ Balance Sheet',
		content: 'Massive balance sheet reflects unprecedented monetary accommodation. Any reduction would signal policy normalization and could dramatically strengthen JPY.',
		learn_more_url: '/education/fundamental-analysis/boj-policy',
		related_indicators: ['jpy_boj_rate', 'jpy_jgb_10y']
	},

	jpy_tona: {
		title: 'TONA Rate',
		content: 'Tokyo Overnight Average Rate reflects actual money market conditions. Movements in TONA indicate effectiveness of BoJ policy transmission and market stress.',
		learn_more_url: '/education/fundamental-analysis/money-markets',
		related_indicators: ['jpy_boj_rate', 'jpy_expected_boj_6m']
	},

	jpy_expected_boj_6m: {
		title: 'Expected BoJ Rate (6M)',
		content: 'Market expectations for BoJ policy rate changes. Rising expectations indicate market anticipation of policy normalization, which would strongly support JPY.',
		learn_more_url: '/education/fundamental-analysis/rate-expectations',
		related_indicators: ['jpy_boj_rate', 'jpy_jgb_10y', 'jpy_core_cpi']
	},

	// JPY Sentiment & Confidence
	jpy_consumer_confidence: {
		title: 'Japan Consumer Confidence',
		content: 'Consumer confidence in Japan is particularly important given the country\'s deflationary history. Improving confidence suggests willingness to spend rather than save.',
		learn_more_url: '/education/fundamental-analysis/japan-consumer-sentiment',
		related_indicators: ['jpy_retail_sales', 'jpy_tankan_conditions']
	},

	jpy_tankan_conditions: {
		title: 'Tankan Business Conditions',
		content: 'Overall business sentiment from BoJ\'s comprehensive survey. This indicator heavily influences BoJ policy decisions and market expectations for economic growth.',
		learn_more_url: '/education/fundamental-analysis/tankan-survey',
		related_indicators: ['jpy_tankan_large_mfg', 'jpy_boj_rate', 'jpy_gdp_growth']
	},

	jpy_manufacturing_pmi: {
		title: 'Japan Manufacturing PMI',
		content: 'Leading indicator of manufacturing sector health. PMI above 50 indicates expansion, crucial for Japan\'s export-oriented economy and JPY strength.',
		learn_more_url: '/education/fundamental-analysis/japan-pmi',
		related_indicators: ['jpy_industrial_production', 'jpy_exports', 'jpy_tankan_large_mfg']
	},

	jpy_services_pmi: {
		title: 'Japan Services PMI',
		content: 'Measures service sector activity, important for domestic demand assessment. Strong services PMI indicates healthy domestic consumption patterns.',
		learn_more_url: '/education/fundamental-analysis/japan-pmi',
		related_indicators: ['jpy_retail_sales', 'jpy_consumer_confidence', 'jpy_tankan_large_non_mfg']
	},

	jpy_safe_haven: {
		title: 'JPY Safe Haven Status',
		content: 'JPY\'s negative correlation with global risk sentiment (VIX). Strong safe haven status means JPY strengthens during global market stress, regardless of domestic fundamentals.',
		learn_more_url: '/education/fundamental-analysis/safe-haven-currencies',
		related_indicators: ['jpy_current_account', 'jpy_forex_reserves']
	},

	// JPY Housing Market
	jpy_housing_starts: {
		title: 'Japan Housing Starts',
		content: 'Housing construction activity in Japan, influenced by demographic trends and urbanization patterns. Reflects domestic construction demand and economic activity.',
		learn_more_url: '/education/fundamental-analysis/japan-housing',
		related_indicators: ['jpy_construction_orders', 'jpy_real_estate_prices']
	},

	jpy_construction_orders: {
		title: 'Japan Construction Orders',
		content: 'Leading indicator of construction activity including infrastructure projects. Reflects both private and public sector investment in Japan.',
		learn_more_url: '/education/fundamental-analysis/japan-housing',
		related_indicators: ['jpy_housing_starts', 'jpy_fiscal_stimulus']
	},

	jpy_real_estate_prices: {
		title: 'Japan Real Estate Price Index',
		content: 'Property price trends in Japan, important for wealth effects and consumption. Rising prices can support domestic demand despite demographic challenges.',
		learn_more_url: '/education/fundamental-analysis/japan-housing',
		related_indicators: ['jpy_housing_starts', 'jpy_consumer_confidence']
	},

	jpy_building_permits: {
		title: 'Japan Building Permits',
		content: 'Leading indicator of future housing construction. Provides early insight into construction activity and domestic investment trends.',
		learn_more_url: '/education/fundamental-analysis/japan-housing',
		related_indicators: ['jpy_housing_starts', 'jpy_construction_orders']
	},

	// JPY Fiscal Policy
	jpy_debt_gdp: {
		title: 'Japan Debt-to-GDP Ratio',
		content: 'Japan has the highest debt-to-GDP ratio among developed nations at over 260%. This constrains fiscal policy and requires ultra-low interest rates to remain sustainable.',
		learn_more_url: '/education/fundamental-analysis/japan-fiscal-policy',
		related_indicators: ['jpy_boj_rate', 'jpy_budget_deficit', 'jpy_primary_balance']
	},

	jpy_budget_deficit: {
		title: 'Japan Budget Deficit',
		content: 'Persistent budget deficits add to Japan\'s debt burden but provide necessary economic stimulus in a deflationary environment. Fiscal sustainability is a long-term concern.',
		learn_more_url: '/education/fundamental-analysis/japan-fiscal-policy',
		related_indicators: ['jpy_debt_gdp', 'jpy_fiscal_stimulus', 'jpy_primary_balance']
	},

	jpy_primary_balance: {
		title: 'Japan Primary Balance',
		content: 'Budget balance excluding interest payments. Achieving primary balance surplus is a key fiscal target for Japan to stabilize debt dynamics.',
		learn_more_url: '/education/fundamental-analysis/japan-fiscal-policy',
		related_indicators: ['jpy_debt_gdp', 'jpy_budget_deficit']
	},

	jpy_fiscal_stimulus: {
		title: 'Japan Fiscal Stimulus Packages',
		content: 'Government stimulus measures to support economic growth. Large packages support growth but increase debt burden and may weaken JPY long-term through fiscal concerns.',
		learn_more_url: '/education/fundamental-analysis/japan-fiscal-policy',
		related_indicators: ['jpy_debt_gdp', 'jpy_gdp_growth', 'jpy_construction_orders']
	},

	// NZD Growth Indicators
	nzd_gdp_growth_rate: {
		title: 'New Zealand GDP Growth Rate',
		content: 'NZ GDP is highly volatile due to weather impacts, tourism fluctuations, and commodity cycles. As a small open economy, growth is sensitive to global conditions and China\'s economic performance.',
		learn_more_url: '/education/fundamental-analysis/nz-gdp',
		related_indicators: ['nzd_retail_sales', 'nzd_milk_production_index', 'nzd_international_visitor_arrivals']
	},

	nzd_retail_sales: {
		title: 'New Zealand Retail Sales',
		content: 'Consumer spending in NZ is influenced by housing wealth effects, migration flows, and tourism. Strong retail sales support domestic demand and can offset external sector weakness.',
		learn_more_url: '/education/fundamental-analysis/nz-retail-sales',
		related_indicators: ['nzd_electronic_card_transactions', 'nzd_anz_consumer_confidence', 'nzd_reinz_house_price_index']
	},

	nzd_electronic_card_transactions: {
		title: 'Electronic Card Transactions',
		content: 'Monthly proxy for retail sales providing timely insight into consumer spending patterns. More frequent than quarterly retail data and includes tourism spending.',
		learn_more_url: '/education/fundamental-analysis/nz-consumer-spending',
		related_indicators: ['nzd_retail_sales', 'nzd_international_visitor_arrivals']
	},

	nzd_milk_production_index: {
		title: 'Milk Production Index',
		content: 'Critical for NZ economy as dairy represents 25% of exports. Production affects Global Dairy Trade auction prices and farmer incomes, directly impacting NZD through commodity price channels.',
		learn_more_url: '/education/fundamental-analysis/nz-dairy-sector',
		related_indicators: ['nzd_global_dairy_trade_index', 'nzd_anz_commodity_price_index', 'nzd_terms_of_trade']
	},

	nzd_international_visitor_arrivals: {
		title: 'International Visitor Arrivals',
		content: 'Tourism recovery post-COVID is crucial for NZ services sector. Visitor arrivals drive accommodation, retail, and transport sectors, supporting employment and NZD.',
		learn_more_url: '/education/fundamental-analysis/nz-tourism',
		related_indicators: ['nzd_services_psi', 'nzd_electronic_card_transactions', 'nzd_employment_change']
	},

	nzd_nzier_business_confidence: {
		title: 'NZIER Business Confidence',
		content: 'Quarterly business sentiment survey providing comprehensive view of economic outlook. Negative readings reflect concerns about inflation, interest rates, and global uncertainty.',
		learn_more_url: '/education/fundamental-analysis/nz-business-confidence',
		related_indicators: ['nzd_anz_business_outlook', 'nzd_gdp_growth_rate']
	},

	nzd_anz_business_outlook: {
		title: 'ANZ Business Outlook',
		content: 'Monthly business sentiment indicator, more volatile than NZIER but provides timely economic pulse. Distinguishes between general confidence and own activity expectations.',
		learn_more_url: '/education/fundamental-analysis/nz-business-confidence',
		related_indicators: ['nzd_anz_own_activity_expectations', 'nzd_nzier_business_confidence']
	},

	nzd_manufacturing_pmi: {
		title: 'Performance of Manufacturing Index',
		content: 'BNZ-BusinessNZ manufacturing activity indicator. Below 50 indicates contraction, reflecting global demand weakness and domestic cost pressures.',
		learn_more_url: '/education/fundamental-analysis/nz-pmi',
		related_indicators: ['nzd_services_psi', 'nzd_anz_commodity_price_index']
	},

	nzd_services_psi: {
		title: 'Performance of Services Index',
		content: 'Services sector activity indicator. Above 50 indicates expansion, supported by tourism recovery and domestic demand. Services represent majority of NZ economy.',
		learn_more_url: '/education/fundamental-analysis/nz-pmi',
		related_indicators: ['nzd_manufacturing_pmi', 'nzd_international_visitor_arrivals']
	},

	// NZD Inflation Metrics
	nzd_consumer_price_index: {
		title: 'New Zealand Consumer Price Index',
		content: 'RBNZ targets 1-3% inflation. Current elevated levels (4-7%) drive aggressive monetary tightening. Housing costs represent significant portion of CPI basket.',
		learn_more_url: '/education/fundamental-analysis/nz-inflation',
		related_indicators: ['nzd_housing_cost_component', 'nzd_rbnz_official_cash_rate', 'nzd_inflation_expectations_2y']
	},

	nzd_producer_price_index: {
		title: 'New Zealand Producer Price Index',
		content: 'Input cost pressures affecting business margins. Semi-annual release provides insight into pipeline inflation pressures and business cost environment.',
		learn_more_url: '/education/fundamental-analysis/nz-inflation',
		related_indicators: ['nzd_consumer_price_index', 'nzd_anz_commodity_price_index']
	},

	nzd_inflation_expectations_2y: {
		title: '2-Year Inflation Expectations',
		content: 'RBNZ survey of inflation expectations. Critical for policy decisions as RBNZ aims to anchor expectations near 2% target. Rising expectations may prompt further tightening.',
		learn_more_url: '/education/fundamental-analysis/inflation-expectations',
		related_indicators: ['nzd_consumer_price_index', 'nzd_rbnz_official_cash_rate']
	},

	nzd_housing_cost_component: {
		title: 'Housing Cost Component (CPI)',
		content: 'Housing costs represent 15-20% of CPI basket. Major driver of inflation volatility due to NZ\'s housing market dynamics and wealth effects.',
		learn_more_url: '/education/fundamental-analysis/nz-housing-inflation',
		related_indicators: ['nzd_reinz_house_price_index', 'nzd_consumer_price_index']
	},

	nzd_non_tradeable_inflation: {
		title: 'Non-tradeable Inflation',
		content: 'Domestic price pressures reflecting local demand and cost conditions. Higher than tradeable inflation indicates domestic demand strength and services sector pricing power.',
		learn_more_url: '/education/fundamental-analysis/nz-inflation-components',
		related_indicators: ['nzd_tradeable_inflation', 'nzd_consumer_price_index']
	},

	nzd_tradeable_inflation: {
		title: 'Tradeable Inflation',
		content: 'Import price pressures and global commodity price impacts. Declining due to stronger NZD and lower global commodity prices, helping overall inflation moderation.',
		learn_more_url: '/education/fundamental-analysis/nz-inflation-components',
		related_indicators: ['nzd_non_tradeable_inflation', 'nzd_anz_commodity_price_index']
	},

	// NZD Labor Market
	nzd_unemployment_rate: {
		title: 'New Zealand Unemployment Rate',
		content: 'Near historic lows around 3.5%. RBNZ monitors for Maximum Sustainable Employment concept. Rising trend expected as economy cools from monetary tightening.',
		learn_more_url: '/education/fundamental-analysis/nz-labor-market',
		related_indicators: ['nzd_employment_change', 'nzd_labour_cost_index', 'nzd_rbnz_official_cash_rate']
	},

	nzd_employment_change: {
		title: 'Employment Change',
		content: 'Quarterly employment growth from HLFS survey. Slowing growth as economy cools. RBNZ tracks for Maximum Sustainable Employment assessment.',
		learn_more_url: '/education/fundamental-analysis/nz-labor-market',
		related_indicators: ['nzd_unemployment_rate', 'nzd_participation_rate']
	},

	nzd_labour_cost_index: {
		title: 'Labour Cost Index',
		content: 'Wage growth indicator excluding compositional effects. Elevated levels support consumer spending but add to inflation pressures, influencing RBNZ policy.',
		learn_more_url: '/education/fundamental-analysis/nz-wages',
		related_indicators: ['nzd_average_hourly_earnings', 'nzd_consumer_price_index']
	},

	nzd_participation_rate: {
		title: 'Labour Force Participation Rate',
		content: 'Labor supply indicator. High participation supports economic capacity and helps meet labor demand in tight market conditions.',
		learn_more_url: '/education/fundamental-analysis/nz-labor-market',
		related_indicators: ['nzd_unemployment_rate', 'nzd_net_migration']
	},

	nzd_net_migration: {
		title: 'Net Migration',
		content: 'Affects labor supply and housing demand. High inflows support growth but strain infrastructure. Major driver of population growth and economic capacity.',
		learn_more_url: '/education/fundamental-analysis/nz-migration',
		related_indicators: ['nzd_unemployment_rate', 'nzd_reinz_house_price_index', 'nzd_building_consents']
	},

	// NZD Trade & Balance
	nzd_trade_balance: {
		title: 'New Zealand Trade Balance',
		content: 'Monthly trade flows typically show deficit due to import demand. Commodity prices drive export values, making balance volatile and weather-dependent.',
		learn_more_url: '/education/fundamental-analysis/nz-trade',
		related_indicators: ['nzd_global_dairy_trade_index', 'nzd_anz_commodity_price_index']
	},

	nzd_global_dairy_trade_index: {
		title: 'Global Dairy Trade Price Index',
		content: 'Bi-weekly dairy auctions directly impact NZD. Dairy represents 25% of NZ exports. Price volatility significantly affects farmer incomes and export revenues.',
		learn_more_url: '/education/fundamental-analysis/global-dairy-trade',
		related_indicators: ['nzd_milk_production_index', 'nzd_terms_of_trade', 'nzd_trade_balance']
	},

	nzd_current_account_deficit: {
		title: 'Current Account Balance',
		content: 'Structural deficit reflecting investment needs and consumption patterns. Widening deficit pressures NZD by increasing reliance on foreign capital.',
		learn_more_url: '/education/fundamental-analysis/nz-current-account',
		related_indicators: ['nzd_trade_balance', 'nzd_net_migration']
	},

	nzd_anz_commodity_price_index: {
		title: 'ANZ World Commodity Price Index',
		content: 'Covers 60% of NZ exports including meat, timber, fruit, wine. Key NZD driver as commodity prices directly affect export revenues and terms of trade.',
		learn_more_url: '/education/fundamental-analysis/nz-commodities',
		related_indicators: ['nzd_terms_of_trade', 'nzd_trade_balance']
	},

	nzd_terms_of_trade: {
		title: 'Terms of Trade',
		content: 'Export vs import price ratio. Commodity cycle dependent. Improving terms support NZD through increased purchasing power and export revenues.',
		learn_more_url: '/education/fundamental-analysis/terms-of-trade',
		related_indicators: ['nzd_anz_commodity_price_index', 'nzd_global_dairy_trade_index']
	},

	// NZD Monetary Policy
	nzd_rbnz_official_cash_rate: {
		title: 'RBNZ Official Cash Rate',
		content: 'Primary monetary policy tool at 5.50%. RBNZ pioneered inflation targeting. At restrictive levels to combat inflation. Peak likely reached in current cycle.',
		learn_more_url: '/education/fundamental-analysis/rbnz-policy',
		related_indicators: ['nzd_consumer_price_index', 'nzd_nz_2y_government_bond', 'nzd_inflation_expectations_2y']
	},

	nzd_nz_2y_government_bond: {
		title: '2-Year Government Bond Yield',
		content: 'Carry trade benchmark. High yields attract foreign investment and support NZD. Key indicator for short-term interest rate expectations.',
		learn_more_url: '/education/fundamental-analysis/nz-carry-trade',
		related_indicators: ['nzd_rbnz_official_cash_rate', 'nzd_nz_us_10y_spread']
	},

	nzd_nz_us_10y_spread: {
		title: 'NZ-US 10Y Bond Spread',
		content: 'Carry trade indicator. Wider spreads attract foreign capital and support NZD. Reflects relative monetary policy stance and economic outlook.',
		learn_more_url: '/education/fundamental-analysis/nz-carry-trade',
		related_indicators: ['nzd_nz_2y_government_bond', 'nzd_global_risk_appetite']
	}
};

/**
 * Get educational tooltip for a specific indicator
 */
export function getEducationalTooltip(indicatorId: string): EducationalTooltip | null {
	return EDUCATIONAL_TOOLTIPS[indicatorId] || null;
}

/**
 * Get all tooltips for a specific category
 */
export function getTooltipsByCategory(category: string): EducationalTooltip[] {
	const categoryIndicators: Record<string, string[]> = {
		growth: ['usd_gdp_growth', 'usd_industrial_production', 'usd_retail_sales'],
		inflation: ['usd_cpi', 'usd_core_cpi', 'usd_pce'],
		labor: ['usd_unemployment', 'usd_nfp', 'usd_ahe'],
		monetary_policy: ['usd_fed_funds', 'usd_treasury_10y'],
		sentiment: ['usd_consumer_confidence', 'usd_ism_manufacturing'],
		trade: ['usd_trade_balance'],
		housing: ['usd_building_permits'],
		fiscal_policy: ['usd_budget_balance']
	};

	const indicators = categoryIndicators[category] || [];
	return indicators.map(id => EDUCATIONAL_TOOLTIPS[id]).filter(Boolean);
}

/**
 * Search tooltips by keyword
 */
export function searchTooltips(keyword: string, language: 'en' | 'de' = 'en'): EducationalTooltip[] {
	const searchTerm = keyword.toLowerCase();
	
	return Object.values(EDUCATIONAL_TOOLTIPS).filter(tooltip => {
		const title = language === 'de' ? (tooltip.title_de || tooltip.title) : tooltip.title;
		const content = language === 'de' ? (tooltip.content_de || tooltip.content) : tooltip.content;
		
		return title.toLowerCase().includes(searchTerm) || 
			   content.toLowerCase().includes(searchTerm);
	});
}
