/**
 * Complete country database with coordinates and language info.
 *
 * Each country has a **tier** that controls when its label appears on the globe:
 *   • Tier 1 – Major language representative (visible at world-level zoom)
 *   • Tier 2 – Important secondary country (visible at continent-level zoom)
 *   • Tier 3 – All remaining countries (visible at country-level zoom)
 */

export interface CountryData {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  language: string;
  languageCode: string;
  tier: 1 | 2 | 3;
}

// ── Tier assignments ──────────────────────────────────────────────────────────

const TIER_1 = new Set([
  'United States', 'Spain', 'France', 'Germany', 'Brazil', 'Russia',
  'China', 'Japan', 'South Korea', 'Saudi Arabia', 'India', 'Italy',
  'Turkey', 'Thailand', 'Vietnam', 'Indonesia', 'Poland', 'Sweden',
  'Netherlands', 'Greece',
]);

const TIER_2 = new Set([
  'United Kingdom', 'Canada', 'Australia', 'Mexico', 'Argentina',
  'Colombia', 'Portugal', 'Ukraine', 'Romania', 'Hungary',
  'Czech Republic', 'Finland', 'Norway', 'Denmark', 'Egypt',
  'Morocco', 'Pakistan', 'Bangladesh', 'Israel', 'Nigeria',
  'Kenya', 'South Africa', 'Ethiopia', 'Taiwan', 'Philippines',
  'Malaysia', 'Ireland', 'Switzerland', 'Austria', 'Belgium',
  'Peru', 'Chile', 'Tanzania', 'New Zealand', 'Singapore',
]);

function tier(name: string): 1 | 2 | 3 {
  if (TIER_1.has(name)) return 1;
  if (TIER_2.has(name)) return 2;
  return 3;
}

// ── Raw data ──────────────────────────────────────────────────────────────────

type Raw = Omit<CountryData, 'tier'>;

const RAW: Raw[] = [
  // North America
  { name: 'United States', coordinates: [-95.7129, 37.0902], language: 'English', languageCode: 'en' },
  { name: 'Canada', coordinates: [-106.3468, 56.1304], language: 'English', languageCode: 'en' },
  { name: 'Mexico', coordinates: [-102.5528, 23.6345], language: 'Spanish', languageCode: 'es' },

  // Central America & Caribbean
  { name: 'Guatemala', coordinates: [-90.2308, 15.7835], language: 'Spanish', languageCode: 'es' },
  { name: 'Belize', coordinates: [-88.4976, 17.1899], language: 'English', languageCode: 'en' },
  { name: 'El Salvador', coordinates: [-88.8965, 13.7942], language: 'Spanish', languageCode: 'es' },
  { name: 'Honduras', coordinates: [-87.1734, 15.2000], language: 'Spanish', languageCode: 'es' },
  { name: 'Nicaragua', coordinates: [-85.2072, 12.2650], language: 'Spanish', languageCode: 'es' },
  { name: 'Costa Rica', coordinates: [-83.7534, 9.7489], language: 'Spanish', languageCode: 'es' },
  { name: 'Panama', coordinates: [-80.7821, 8.5380], language: 'Spanish', languageCode: 'es' },
  { name: 'Cuba', coordinates: [-77.7812, 21.5218], language: 'Spanish', languageCode: 'es' },
  { name: 'Jamaica', coordinates: [-77.2975, 18.1096], language: 'English', languageCode: 'en' },
  { name: 'Haiti', coordinates: [-72.2852, 18.9712], language: 'French', languageCode: 'fr' },
  { name: 'Dominican Republic', coordinates: [-70.1627, 18.7357], language: 'Spanish', languageCode: 'es' },

  // South America
  { name: 'Brazil', coordinates: [-51.9253, -14.2350], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Argentina', coordinates: [-63.6167, -38.4161], language: 'Spanish', languageCode: 'es' },
  { name: 'Chile', coordinates: [-71.5430, -35.6751], language: 'Spanish', languageCode: 'es' },
  { name: 'Peru', coordinates: [-75.0152, -9.1900], language: 'Spanish', languageCode: 'es' },
  { name: 'Colombia', coordinates: [-74.2973, 4.5709], language: 'Spanish', languageCode: 'es' },
  { name: 'Venezuela', coordinates: [-66.5897, 6.4238], language: 'Spanish', languageCode: 'es' },
  { name: 'Ecuador', coordinates: [-78.1834, -1.8312], language: 'Spanish', languageCode: 'es' },
  { name: 'Bolivia', coordinates: [-63.5887, -16.2902], language: 'Spanish', languageCode: 'es' },
  { name: 'Paraguay', coordinates: [-58.4438, -23.4425], language: 'Spanish', languageCode: 'es' },
  { name: 'Uruguay', coordinates: [-55.7658, -32.5228], language: 'Spanish', languageCode: 'es' },
  { name: 'Guyana', coordinates: [-58.9302, 4.8604], language: 'English', languageCode: 'en' },
  { name: 'Suriname', coordinates: [-56.0278, 3.9193], language: 'Dutch', languageCode: 'nl' },
  { name: 'French Guiana', coordinates: [-53.1258, 3.9339], language: 'French', languageCode: 'fr' },

  // Europe
  { name: 'United Kingdom', coordinates: [-3.4360, 55.3781], language: 'English', languageCode: 'en' },
  { name: 'Ireland', coordinates: [-8.2439, 53.4129], language: 'English', languageCode: 'en' },
  { name: 'France', coordinates: [2.3522, 48.8566], language: 'French', languageCode: 'fr' },
  { name: 'Germany', coordinates: [10.4515, 51.1657], language: 'German', languageCode: 'de' },
  { name: 'Spain', coordinates: [-3.7492, 40.4637], language: 'Spanish', languageCode: 'es' },
  { name: 'Italy', coordinates: [12.5674, 41.8719], language: 'Italian', languageCode: 'it' },
  { name: 'Portugal', coordinates: [-8.2245, 39.3999], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Netherlands', coordinates: [5.2913, 52.1326], language: 'Dutch', languageCode: 'nl' },
  { name: 'Belgium', coordinates: [4.4699, 50.5039], language: 'French', languageCode: 'fr' },
  { name: 'Switzerland', coordinates: [8.2275, 46.8182], language: 'German', languageCode: 'de' },
  { name: 'Austria', coordinates: [14.5501, 47.5162], language: 'German', languageCode: 'de' },
  { name: 'Sweden', coordinates: [18.6435, 60.1282], language: 'Swedish', languageCode: 'sv' },
  { name: 'Norway', coordinates: [8.4689, 60.4720], language: 'Norwegian', languageCode: 'no' },
  { name: 'Denmark', coordinates: [9.5018, 56.2639], language: 'Danish', languageCode: 'da' },
  { name: 'Finland', coordinates: [25.7482, 61.9241], language: 'Finnish', languageCode: 'fi' },
  { name: 'Poland', coordinates: [19.1340, 51.9194], language: 'Polish', languageCode: 'pl' },
  { name: 'Czech Republic', coordinates: [15.4730, 49.8175], language: 'Czech', languageCode: 'cs' },
  { name: 'Slovakia', coordinates: [19.6990, 48.6690], language: 'Slovak', languageCode: 'sk' },
  { name: 'Hungary', coordinates: [19.5033, 47.1625], language: 'Hungarian', languageCode: 'hu' },
  { name: 'Romania', coordinates: [24.9668, 45.9432], language: 'Romanian', languageCode: 'ro' },
  { name: 'Bulgaria', coordinates: [25.4858, 42.7339], language: 'Bulgarian', languageCode: 'bg' },
  { name: 'Greece', coordinates: [21.8243, 39.0742], language: 'Greek', languageCode: 'el' },
  { name: 'Turkey', coordinates: [35.2433, 38.9637], language: 'Turkish', languageCode: 'tr' },
  { name: 'Russia', coordinates: [105.3188, 61.5240], language: 'Russian', languageCode: 'ru' },
  { name: 'Ukraine', coordinates: [31.1656, 48.3794], language: 'Ukrainian', languageCode: 'uk' },
  { name: 'Belarus', coordinates: [27.9534, 53.7098], language: 'Belarusian', languageCode: 'be' },
  { name: 'Lithuania', coordinates: [23.8813, 55.1694], language: 'Lithuanian', languageCode: 'lt' },
  { name: 'Latvia', coordinates: [24.6032, 56.8796], language: 'Latvian', languageCode: 'lv' },
  { name: 'Estonia', coordinates: [25.0136, 58.5953], language: 'Estonian', languageCode: 'et' },
  { name: 'Croatia', coordinates: [15.2000, 45.1000], language: 'Croatian', languageCode: 'hr' },
  { name: 'Serbia', coordinates: [21.0059, 44.0165], language: 'Serbian', languageCode: 'sr' },
  { name: 'Bosnia and Herzegovina', coordinates: [17.6791, 43.9159], language: 'Bosnian', languageCode: 'bs' },
  { name: 'Montenegro', coordinates: [19.3744, 42.7087], language: 'Montenegrin', languageCode: 'me' },
  { name: 'Albania', coordinates: [20.1683, 41.1533], language: 'Albanian', languageCode: 'sq' },
  { name: 'North Macedonia', coordinates: [21.7453, 41.6086], language: 'Macedonian', languageCode: 'mk' },
  { name: 'Slovenia', coordinates: [14.9955, 46.1512], language: 'Slovenian', languageCode: 'sl' },
  { name: 'Luxembourg', coordinates: [6.1296, 49.8153], language: 'French', languageCode: 'fr' },
  { name: 'Liechtenstein', coordinates: [9.5554, 47.1660], language: 'German', languageCode: 'de' },
  { name: 'Malta', coordinates: [14.3754, 35.9375], language: 'Maltese', languageCode: 'mt' },
  { name: 'Cyprus', coordinates: [33.4299, 35.1264], language: 'Greek', languageCode: 'el' },
  { name: 'Iceland', coordinates: [-19.0208, 64.9631], language: 'Icelandic', languageCode: 'is' },

  // Africa
  { name: 'Nigeria', coordinates: [8.6753, 9.0820], language: 'English', languageCode: 'en' },
  { name: 'Ethiopia', coordinates: [40.4897, 9.1450], language: 'Amharic', languageCode: 'am' },
  { name: 'Egypt', coordinates: [30.8025, 26.8206], language: 'Arabic', languageCode: 'ar' },
  { name: 'South Africa', coordinates: [22.9375, -30.5595], language: 'English', languageCode: 'en' },
  { name: 'Kenya', coordinates: [37.9062, -0.0236], language: 'English', languageCode: 'en' },
  { name: 'Tanzania', coordinates: [34.8888, -6.3690], language: 'Swahili', languageCode: 'sw' },
  { name: 'Uganda', coordinates: [32.2903, 1.3733], language: 'English', languageCode: 'en' },
  { name: 'Algeria', coordinates: [1.6596, 28.0339], language: 'Arabic', languageCode: 'ar' },
  { name: 'Sudan', coordinates: [30.2178, 12.8628], language: 'Arabic', languageCode: 'ar' },
  { name: 'Morocco', coordinates: [-7.0926, 31.7917], language: 'Arabic', languageCode: 'ar' },
  { name: 'Ghana', coordinates: [-1.0232, 7.9465], language: 'English', languageCode: 'en' },
  { name: 'Mozambique', coordinates: [35.5296, -18.6657], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Madagascar', coordinates: [46.8691, -18.7669], language: 'Malagasy', languageCode: 'mg' },
  { name: 'Cameroon', coordinates: [12.3547, 7.3697], language: 'French', languageCode: 'fr' },
  { name: 'Angola', coordinates: [17.8739, -11.2027], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Niger', coordinates: [8.0817, 17.6078], language: 'French', languageCode: 'fr' },
  { name: 'Burkina Faso', coordinates: [-2.1976, 12.2383], language: 'French', languageCode: 'fr' },
  { name: 'Mali', coordinates: [-3.9962, 17.5707], language: 'French', languageCode: 'fr' },
  { name: 'Malawi', coordinates: [34.3015, -13.2543], language: 'English', languageCode: 'en' },
  { name: 'Zambia', coordinates: [27.8493, -13.1339], language: 'English', languageCode: 'en' },
  { name: 'Somalia', coordinates: [46.1996, 5.1521], language: 'Somali', languageCode: 'so' },
  { name: 'Senegal', coordinates: [-14.4524, 14.4974], language: 'French', languageCode: 'fr' },
  { name: 'Chad', coordinates: [18.7322, 15.4542], language: 'French', languageCode: 'fr' },
  { name: 'Sierra Leone', coordinates: [-11.7799, 8.4606], language: 'English', languageCode: 'en' },
  { name: 'Libya', coordinates: [17.2283, 26.3351], language: 'Arabic', languageCode: 'ar' },
  { name: 'Liberia', coordinates: [-9.4295, 6.4281], language: 'English', languageCode: 'en' },
  { name: 'Central African Republic', coordinates: [21.7587, 6.6111], language: 'French', languageCode: 'fr' },
  { name: 'Mauritania', coordinates: [-10.9408, 21.0079], language: 'Arabic', languageCode: 'ar' },
  { name: 'Eritrea', coordinates: [39.7823, 15.1794], language: 'Tigrinya', languageCode: 'ti' },
  { name: 'Gambia', coordinates: [-15.3101, 13.4432], language: 'English', languageCode: 'en' },
  { name: 'Botswana', coordinates: [24.6849, -22.3285], language: 'English', languageCode: 'en' },
  { name: 'Gabon', coordinates: [11.6094, -0.8037], language: 'French', languageCode: 'fr' },
  { name: 'Lesotho', coordinates: [28.2336, -29.6100], language: 'Sesotho', languageCode: 'st' },
  { name: 'Guinea-Bissau', coordinates: [-15.1804, 11.8037], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Equatorial Guinea', coordinates: [10.2679, 1.6508], language: 'Spanish', languageCode: 'es' },
  { name: 'Mauritius', coordinates: [57.5522, -20.3484], language: 'English', languageCode: 'en' },
  { name: 'Eswatini', coordinates: [31.4659, -26.5225], language: 'English', languageCode: 'en' },
  { name: 'Djibouti', coordinates: [42.5903, 11.8251], language: 'French', languageCode: 'fr' },
  { name: 'Comoros', coordinates: [43.8722, -11.6455], language: 'French', languageCode: 'fr' },
  { name: 'Cape Verde', coordinates: [-24.0132, 16.0021], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Seychelles', coordinates: [55.4919, -4.6796], language: 'English', languageCode: 'en' },

  // Asia
  { name: 'China', coordinates: [104.1954, 35.8617], language: 'Chinese', languageCode: 'zh' },
  { name: 'India', coordinates: [78.9629, 20.5937], language: 'Hindi', languageCode: 'hi' },
  { name: 'Indonesia', coordinates: [113.9213, -0.7893], language: 'Indonesian', languageCode: 'id' },
  { name: 'Pakistan', coordinates: [69.3451, 30.3753], language: 'Urdu', languageCode: 'ur' },
  { name: 'Bangladesh', coordinates: [90.3563, 23.6850], language: 'Bengali', languageCode: 'bn' },
  { name: 'Japan', coordinates: [138.2529, 36.2048], language: 'Japanese', languageCode: 'ja' },
  { name: 'Philippines', coordinates: [121.7740, 12.8797], language: 'Filipino', languageCode: 'tl' },
  { name: 'Vietnam', coordinates: [108.2772, 14.0583], language: 'Vietnamese', languageCode: 'vi' },
  { name: 'Thailand', coordinates: [100.9925, 15.8700], language: 'Thai', languageCode: 'th' },
  { name: 'Myanmar', coordinates: [95.9562, 21.9162], language: 'Burmese', languageCode: 'my' },
  { name: 'South Korea', coordinates: [127.7669, 35.9078], language: 'Korean', languageCode: 'ko' },
  { name: 'North Korea', coordinates: [127.5101, 40.3399], language: 'Korean', languageCode: 'ko' },
  { name: 'Afghanistan', coordinates: [67.7101, 33.9391], language: 'Pashto', languageCode: 'ps' },
  { name: 'Iraq', coordinates: [43.6793, 33.2232], language: 'Arabic', languageCode: 'ar' },
  { name: 'Saudi Arabia', coordinates: [45.0792, 23.8859], language: 'Arabic', languageCode: 'ar' },
  { name: 'Uzbekistan', coordinates: [64.5853, 41.3775], language: 'Uzbek', languageCode: 'uz' },
  { name: 'Malaysia', coordinates: [101.9758, 4.2105], language: 'Malay', languageCode: 'ms' },
  { name: 'Yemen', coordinates: [48.5164, 15.5527], language: 'Arabic', languageCode: 'ar' },
  { name: 'Nepal', coordinates: [84.1240, 28.3949], language: 'Nepali', languageCode: 'ne' },
  { name: 'Sri Lanka', coordinates: [80.7718, 7.8731], language: 'Sinhala', languageCode: 'si' },
  { name: 'Kazakhstan', coordinates: [66.9237, 48.0196], language: 'Kazakh', languageCode: 'kk' },
  { name: 'Syria', coordinates: [38.9968, 34.8021], language: 'Arabic', languageCode: 'ar' },
  { name: 'Cambodia', coordinates: [104.9909, 12.5657], language: 'Khmer', languageCode: 'km' },
  { name: 'Jordan', coordinates: [36.2384, 30.5852], language: 'Arabic', languageCode: 'ar' },
  { name: 'Azerbaijan', coordinates: [47.5769, 40.1431], language: 'Azerbaijani', languageCode: 'az' },
  { name: 'United Arab Emirates', coordinates: [53.8478, 23.4241], language: 'Arabic', languageCode: 'ar' },
  { name: 'Tajikistan', coordinates: [71.2761, 38.8610], language: 'Tajik', languageCode: 'tg' },
  { name: 'Laos', coordinates: [102.4955, 19.8563], language: 'Lao', languageCode: 'lo' },
  { name: 'Israel', coordinates: [34.8516, 31.0461], language: 'Hebrew', languageCode: 'he' },
  { name: 'Lebanon', coordinates: [35.8623, 33.8547], language: 'Arabic', languageCode: 'ar' },
  { name: 'Kyrgyzstan', coordinates: [74.7661, 41.2044], language: 'Kyrgyz', languageCode: 'ky' },
  { name: 'Turkmenistan', coordinates: [59.5563, 38.9697], language: 'Turkmen', languageCode: 'tk' },
  { name: 'Singapore', coordinates: [103.8198, 1.3521], language: 'English', languageCode: 'en' },
  { name: 'Oman', coordinates: [55.9233, 21.4735], language: 'Arabic', languageCode: 'ar' },
  { name: 'Kuwait', coordinates: [47.4818, 29.3117], language: 'Arabic', languageCode: 'ar' },
  { name: 'Georgia', coordinates: [43.3569, 42.3154], language: 'Georgian', languageCode: 'ka' },
  { name: 'Mongolia', coordinates: [103.8467, 46.8625], language: 'Mongolian', languageCode: 'mn' },
  { name: 'Armenia', coordinates: [45.0382, 40.0691], language: 'Armenian', languageCode: 'hy' },
  { name: 'Qatar', coordinates: [51.1839, 25.3548], language: 'Arabic', languageCode: 'ar' },
  { name: 'Bahrain', coordinates: [50.6378, 25.9304], language: 'Arabic', languageCode: 'ar' },
  { name: 'Timor-Leste', coordinates: [125.7275, -8.8742], language: 'Portuguese', languageCode: 'pt' },
  { name: 'Bhutan', coordinates: [90.4336, 27.5142], language: 'Dzongkha', languageCode: 'dz' },
  { name: 'Brunei', coordinates: [114.7277, 4.5353], language: 'Malay', languageCode: 'ms' },
  { name: 'Taiwan', coordinates: [120.9605, 23.6978], language: 'Chinese', languageCode: 'zh' },
  { name: 'Hong Kong', coordinates: [114.1694, 22.3193], language: 'Chinese', languageCode: 'zh' },
  { name: 'Macau', coordinates: [113.5439, 22.1987], language: 'Chinese', languageCode: 'zh' },

  // Oceania
  { name: 'Australia', coordinates: [133.7751, -25.2744], language: 'English', languageCode: 'en' },
  { name: 'Papua New Guinea', coordinates: [143.9555, -6.3149], language: 'English', languageCode: 'en' },
  { name: 'New Zealand', coordinates: [174.8860, -40.9006], language: 'English', languageCode: 'en' },
  { name: 'Fiji', coordinates: [178.065, -17.7134], language: 'English', languageCode: 'en' },
  { name: 'Solomon Islands', coordinates: [160.1562, -9.6457], language: 'English', languageCode: 'en' },
  { name: 'Vanuatu', coordinates: [166.9592, -15.3767], language: 'Bislama', languageCode: 'bi' },
  { name: 'Samoa', coordinates: [-172.1046, -13.7590], language: 'Samoan', languageCode: 'sm' },
  { name: 'Kiribati', coordinates: [-157.3633, 1.8709], language: 'English', languageCode: 'en' },
  { name: 'Tonga', coordinates: [-175.1982, -21.1789], language: 'Tongan', languageCode: 'to' },
  { name: 'Micronesia', coordinates: [150.5508, 7.4256], language: 'English', languageCode: 'en' },
  { name: 'Palau', coordinates: [134.5825, 7.5150], language: 'English', languageCode: 'en' },
  { name: 'Marshall Islands', coordinates: [171.1845, 7.1315], language: 'English', languageCode: 'en' },
  { name: 'Tuvalu', coordinates: [177.6493, -7.1095], language: 'English', languageCode: 'en' },
  { name: 'Nauru', coordinates: [166.9315, -0.5228], language: 'English', languageCode: 'en' },
];

// ── Exported array with computed tier ─────────────────────────────────────────

export const ALL_COUNTRIES: CountryData[] = RAW.map(c => ({
  ...c,
  tier: tier(c.name),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getCountryByName = (name: string) =>
  ALL_COUNTRIES.find(c => c.name === name);

export const getCountriesByLanguage = (code: string) =>
  ALL_COUNTRIES.filter(c => c.languageCode === code);

export const getAllLanguageCodes = (): string[] =>
  [...new Set(ALL_COUNTRIES.map(c => c.languageCode))];

export const getCountriesForTier = (maxTier: 1 | 2 | 3): CountryData[] =>
  ALL_COUNTRIES.filter(c => c.tier <= maxTier);
