// Complete database of all 196 countries with coordinates and language information
export interface CountryData {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  language: string;
  languageCode: string;
  pronunciation?: string;
}

export const ALL_COUNTRIES: CountryData[] = [
  // North America
  { name: 'United States', coordinates: [-95.7129, 37.0902], language: 'English', languageCode: 'en', pronunciation: 'YOO-nited STAYTS' },
  { name: 'Canada', coordinates: [-106.3468, 56.1304], language: 'English', languageCode: 'en', pronunciation: 'KAN-uh-duh' },
  { name: 'Mexico', coordinates: [-102.5528, 23.6345], language: 'Spanish', languageCode: 'es', pronunciation: 'MEH-hee-koh' },
  
  // Central America & Caribbean
  { name: 'Guatemala', coordinates: [-90.2308, 15.7835], language: 'Spanish', languageCode: 'es', pronunciation: 'gwah-tuh-MAH-luh' },
  { name: 'Belize', coordinates: [-88.4976, 17.1899], language: 'English', languageCode: 'en', pronunciation: 'buh-LEEZ' },
  { name: 'El Salvador', coordinates: [-88.8965, 13.7942], language: 'Spanish', languageCode: 'es', pronunciation: 'el SAL-vuh-dor' },
  { name: 'Honduras', coordinates: [-87.1734, 15.2000], language: 'Spanish', languageCode: 'es', pronunciation: 'hon-DOO-ras' },
  { name: 'Nicaragua', coordinates: [-85.2072, 12.2650], language: 'Spanish', languageCode: 'es', pronunciation: 'nee-kuh-RAH-gwuh' },
  { name: 'Costa Rica', coordinates: [-83.7534, 9.7489], language: 'Spanish', languageCode: 'es', pronunciation: 'KOS-tuh REE-kuh' },
  { name: 'Panama', coordinates: [-80.7821, 8.5380], language: 'Spanish', languageCode: 'es', pronunciation: 'PAN-uh-mah' },
  { name: 'Cuba', coordinates: [-77.7812, 21.5218], language: 'Spanish', languageCode: 'es', pronunciation: 'KYOO-buh' },
  { name: 'Jamaica', coordinates: [-77.2975, 18.1096], language: 'English', languageCode: 'en', pronunciation: 'juh-MAY-kuh' },
  { name: 'Haiti', coordinates: [-72.2852, 18.9712], language: 'French', languageCode: 'fr', pronunciation: 'HAY-tee' },
  { name: 'Dominican Republic', coordinates: [-70.1627, 18.7357], language: 'Spanish', languageCode: 'es', pronunciation: 'duh-MIN-ih-kun ri-PUB-lik' },
  
  // South America
  { name: 'Brazil', coordinates: [-51.9253, -14.2350], language: 'Portuguese', languageCode: 'pt', pronunciation: 'bruh-ZIL' },
  { name: 'Argentina', coordinates: [-63.6167, -38.4161], language: 'Spanish', languageCode: 'es', pronunciation: 'ar-jen-TEE-nuh' },
  { name: 'Chile', coordinates: [-71.5430, -35.6751], language: 'Spanish', languageCode: 'es', pronunciation: 'CHEE-lay' },
  { name: 'Peru', coordinates: [-75.0152, -9.1900], language: 'Spanish', languageCode: 'es', pronunciation: 'puh-ROO' },
  { name: 'Colombia', coordinates: [-74.2973, 4.5709], language: 'Spanish', languageCode: 'es', pronunciation: 'kuh-LUM-bee-uh' },
  { name: 'Venezuela', coordinates: [-66.5897, 6.4238], language: 'Spanish', languageCode: 'es', pronunciation: 'ven-eh-ZWAY-luh' },
  { name: 'Ecuador', coordinates: [-78.1834, -1.8312], language: 'Spanish', languageCode: 'es', pronunciation: 'EK-wuh-dor' },
  { name: 'Bolivia', coordinates: [-63.5887, -16.2902], language: 'Spanish', languageCode: 'es', pronunciation: 'buh-LIV-ee-uh' },
  { name: 'Paraguay', coordinates: [-58.4438, -23.4425], language: 'Spanish', languageCode: 'es', pronunciation: 'PAIR-uh-gwy' },
  { name: 'Uruguay', coordinates: [-55.7658, -32.5228], language: 'Spanish', languageCode: 'es', pronunciation: 'YUR-uh-gwy' },
  { name: 'Guyana', coordinates: [-58.9302, 4.8604], language: 'English', languageCode: 'en', pronunciation: 'gy-AN-uh' },
  { name: 'Suriname', coordinates: [-56.0278, 3.9193], language: 'Dutch', languageCode: 'nl', pronunciation: 'SOOR-uh-nahm' },
  { name: 'French Guiana', coordinates: [-53.1258, 3.9339], language: 'French', languageCode: 'fr', pronunciation: 'french gee-AN-uh' },
  
  // Europe
  { name: 'United Kingdom', coordinates: [-3.4360, 55.3781], language: 'English', languageCode: 'en', pronunciation: 'YOO-nited KING-dum' },
  { name: 'Ireland', coordinates: [-8.2439, 53.4129], language: 'English', languageCode: 'en', pronunciation: 'EYE-rland' },
  { name: 'France', coordinates: [2.3522, 48.8566], language: 'French', languageCode: 'fr', pronunciation: 'FRANS' },
  { name: 'Germany', coordinates: [10.4515, 51.1657], language: 'German', languageCode: 'de', pronunciation: 'JUR-muh-nee' },
  { name: 'Spain', coordinates: [-3.7492, 40.4637], language: 'Spanish', languageCode: 'es', pronunciation: 'SPAYN' },
  { name: 'Italy', coordinates: [12.5674, 41.8719], language: 'Italian', languageCode: 'it', pronunciation: 'IT-uh-lee' },
  { name: 'Portugal', coordinates: [-8.2245, 39.3999], language: 'Portuguese', languageCode: 'pt', pronunciation: 'POR-chuh-gul' },
  { name: 'Netherlands', coordinates: [5.2913, 52.1326], language: 'Dutch', languageCode: 'nl', pronunciation: 'NEH-thur-landz' },
  { name: 'Belgium', coordinates: [4.4699, 50.5039], language: 'French', languageCode: 'fr', pronunciation: 'BEL-jum' },
  { name: 'Switzerland', coordinates: [8.2275, 46.8182], language: 'German', languageCode: 'de', pronunciation: 'SWIT-ser-land' },
  { name: 'Austria', coordinates: [14.5501, 47.5162], language: 'German', languageCode: 'de', pronunciation: 'AW-stree-uh' },
  { name: 'Sweden', coordinates: [18.6435, 60.1282], language: 'Swedish', languageCode: 'sv', pronunciation: 'SWEE-den' },
  { name: 'Norway', coordinates: [8.4689, 60.4720], language: 'Norwegian', languageCode: 'no', pronunciation: 'NOR-way' },
  { name: 'Denmark', coordinates: [9.5018, 56.2639], language: 'Danish', languageCode: 'da', pronunciation: 'DEN-mark' },
  { name: 'Finland', coordinates: [25.7482, 61.9241], language: 'Finnish', languageCode: 'fi', pronunciation: 'FIN-land' },
  { name: 'Poland', coordinates: [19.1340, 51.9194], language: 'Polish', languageCode: 'pl', pronunciation: 'POH-land' },
  { name: 'Czech Republic', coordinates: [15.4730, 49.8175], language: 'Czech', languageCode: 'cs', pronunciation: 'chek ri-PUB-lik' },
  { name: 'Slovakia', coordinates: [19.6990, 48.6690], language: 'Slovak', languageCode: 'sk', pronunciation: 'sloh-VAH-kee-uh' },
  { name: 'Hungary', coordinates: [19.5033, 47.1625], language: 'Hungarian', languageCode: 'hu', pronunciation: 'HUNG-guh-ree' },
  { name: 'Romania', coordinates: [24.9668, 45.9432], language: 'Romanian', languageCode: 'ro', pronunciation: 'roh-MAY-nee-uh' },
  { name: 'Bulgaria', coordinates: [25.4858, 42.7339], language: 'Bulgarian', languageCode: 'bg', pronunciation: 'bul-GAIR-ee-uh' },
  { name: 'Greece', coordinates: [21.8243, 39.0742], language: 'Greek', languageCode: 'el', pronunciation: 'GREEK' },
  { name: 'Turkey', coordinates: [35.2433, 38.9637], language: 'Turkish', languageCode: 'tr', pronunciation: 'TUR-kee' },
  { name: 'Russia', coordinates: [105.3188, 61.5240], language: 'Russian', languageCode: 'ru', pronunciation: 'RUH-shuh' },
  { name: 'Ukraine', coordinates: [31.1656, 48.3794], language: 'Ukrainian', languageCode: 'uk', pronunciation: 'yoo-KRAYN' },
  { name: 'Belarus', coordinates: [27.9534, 53.7098], language: 'Belarusian', languageCode: 'be', pronunciation: 'bel-uh-ROO-shee-uhn' },
  { name: 'Lithuania', coordinates: [23.8813, 55.1694], language: 'Lithuanian', languageCode: 'lt', pronunciation: 'lith-oo-AY-nee-uh' },
  { name: 'Latvia', coordinates: [24.6032, 56.8796], language: 'Latvian', languageCode: 'lv', pronunciation: 'LAT-vee-uh' },
  { name: 'Estonia', coordinates: [25.0136, 58.5953], language: 'Estonian', languageCode: 'et', pronunciation: 'es-TOH-nee-uh' },
  { name: 'Croatia', coordinates: [15.2000, 45.1000], language: 'Croatian', languageCode: 'hr', pronunciation: 'kroh-AY-shuh' },
  { name: 'Serbia', coordinates: [21.0059, 44.0165], language: 'Serbian', languageCode: 'sr', pronunciation: 'SUR-bee-uh' },
  { name: 'Bosnia and Herzegovina', coordinates: [17.6791, 43.9159], language: 'Bosnian', languageCode: 'bs', pronunciation: 'BOZ-nee-uh and her-tseh-go-VEE-nuh' },
  { name: 'Montenegro', coordinates: [19.3744, 42.7087], language: 'Montenegrin', languageCode: 'me', pronunciation: 'mon-tuh-NEE-groh' },
  { name: 'Albania', coordinates: [20.1683, 41.1533], language: 'Albanian', languageCode: 'sq', pronunciation: 'al-BAY-nee-uh' },
  { name: 'North Macedonia', coordinates: [21.7453, 41.6086], language: 'Macedonian', languageCode: 'mk', pronunciation: 'NORTH mas-uh-DOH-nee-uh' },
  { name: 'Slovenia', coordinates: [14.9955, 46.1512], language: 'Slovenian', languageCode: 'sl', pronunciation: 'sloh-VEE-nee-uh' },
  { name: 'Luxembourg', coordinates: [6.1296, 49.8153], language: 'French', languageCode: 'fr', pronunciation: 'LUK-sem-berg' },
  { name: 'Liechtenstein', coordinates: [9.5554, 47.1660], language: 'German', languageCode: 'de', pronunciation: 'LIK-ten-styn' },
  { name: 'Malta', coordinates: [14.3754, 35.9375], language: 'Maltese', languageCode: 'mt', pronunciation: 'MAWL-tuh' },
  { name: 'Cyprus', coordinates: [33.4299, 35.1264], language: 'Greek', languageCode: 'el', pronunciation: 'SY-prus' },
  { name: 'Iceland', coordinates: [-19.0208, 64.9631], language: 'Icelandic', languageCode: 'is', pronunciation: 'ICE-land' },
  
  // Africa
  { name: 'Nigeria', coordinates: [8.6753, 9.0820], language: 'English', languageCode: 'en', pronunciation: 'ny-JEER-ee-uh' },
  { name: 'Ethiopia', coordinates: [40.4897, 9.1450], language: 'Amharic', languageCode: 'am', pronunciation: 'ee-thee-OH-pee-uh' },
  { name: 'Egypt', coordinates: [30.8025, 26.8206], language: 'Arabic', languageCode: 'ar', pronunciation: 'EE-jipt' },
  { name: 'South Africa', coordinates: [22.9375, -30.5595], language: 'English', languageCode: 'en', pronunciation: 'SOUTH AF-ri-kuh' },
  { name: 'Kenya', coordinates: [37.9062, -0.0236], language: 'English', languageCode: 'en', pronunciation: 'KEN-yuh' },
  { name: 'Tanzania', coordinates: [34.8888, -6.3690], language: 'Swahili', languageCode: 'sw', pronunciation: 'tan-zuh-NEE-uh' },
  { name: 'Uganda', coordinates: [32.2903, 1.3733], language: 'English', languageCode: 'en', pronunciation: 'yoo-GAN-duh' },
  { name: 'Algeria', coordinates: [1.6596, 28.0339], language: 'Arabic', languageCode: 'ar', pronunciation: 'al-JEER-ee-uh' },
  { name: 'Sudan', coordinates: [30.2178, 12.8628], language: 'Arabic', languageCode: 'ar', pronunciation: 'soo-DAN' },
  { name: 'Morocco', coordinates: [-7.0926, 31.7917], language: 'Arabic', languageCode: 'ar', pronunciation: 'muh-ROK-oh' },
  { name: 'Ghana', coordinates: [-1.0232, 7.9465], language: 'English', languageCode: 'en', pronunciation: 'GAH-nuh' },
  { name: 'Mozambique', coordinates: [35.5296, -18.6657], language: 'Portuguese', languageCode: 'pt', pronunciation: 'moh-zam-BEEK' },
  { name: 'Madagascar', coordinates: [46.8691, -18.7669], language: 'Malagasy', languageCode: 'mg', pronunciation: 'mad-uh-GAS-kar' },
  { name: 'Cameroon', coordinates: [12.3547, 7.3697], language: 'French', languageCode: 'fr', pronunciation: 'kam-uh-ROON' },
  { name: 'Angola', coordinates: [17.8739, -11.2027], language: 'Portuguese', languageCode: 'pt', pronunciation: 'ang-GOH-luh' },
  { name: 'Niger', coordinates: [8.0817, 17.6078], language: 'French', languageCode: 'fr', pronunciation: 'ny-ZHAIR' },
  { name: 'Burkina Faso', coordinates: [-2.1976, 12.2383], language: 'French', languageCode: 'fr', pronunciation: 'bur-KEE-nuh FAH-soh' },
  { name: 'Mali', coordinates: [-3.9962, 17.5707], language: 'French', languageCode: 'fr', pronunciation: 'MAH-lee' },
  { name: 'Malawi', coordinates: [34.3015, -13.2543], language: 'English', languageCode: 'en', pronunciation: 'muh-LAH-wee' },
  { name: 'Zambia', coordinates: [27.8493, -13.1339], language: 'English', languageCode: 'en', pronunciation: 'ZAM-bee-uh' },
  { name: 'Somalia', coordinates: [46.1996, 5.1521], language: 'Somali', languageCode: 'so', pronunciation: 'soh-MAH-lee-uh' },
  { name: 'Senegal', coordinates: [-14.4524, 14.4974], language: 'French', languageCode: 'fr', pronunciation: 'sen-uh-GAHL' },
  { name: 'Chad', coordinates: [18.7322, 15.4542], language: 'French', languageCode: 'fr', pronunciation: 'CHAD' },
  { name: 'Sierra Leone', coordinates: [-11.7799, 8.4606], language: 'English', languageCode: 'en', pronunciation: 'see-AIR-uh lee-OHN' },
  { name: 'Libya', coordinates: [17.2283, 26.3351], language: 'Arabic', languageCode: 'ar', pronunciation: 'LIB-ee-uh' },
  { name: 'Liberia', coordinates: [-9.4295, 6.4281], language: 'English', languageCode: 'en', pronunciation: 'ly-BEER-ee-uh' },
  { name: 'Central African Republic', coordinates: [21.7587, 6.6111], language: 'French', languageCode: 'fr', pronunciation: 'SEN-tral AF-ri-kun ri-PUB-lik' },
  { name: 'Mauritania', coordinates: [-10.9408, 21.0079], language: 'Arabic', languageCode: 'ar', pronunciation: 'mor-ih-TAY-nee-uh' },
  { name: 'Eritrea', coordinates: [39.7823, 15.1794], language: 'Tigrinya', languageCode: 'ti', pronunciation: 'er-ih-TREE-uh' },
  { name: 'Gambia', coordinates: [-15.3101, 13.4432], language: 'English', languageCode: 'en', pronunciation: 'GAM-bee-uh' },
  { name: 'Botswana', coordinates: [24.6849, -22.3285], language: 'English', languageCode: 'en', pronunciation: 'bot-SWAH-nuh' },
  { name: 'Gabon', coordinates: [11.6094, -0.8037], language: 'French', languageCode: 'fr', pronunciation: 'guh-BON' },
  { name: 'Lesotho', coordinates: [28.2336, -29.6100], language: 'Sesotho', languageCode: 'st', pronunciation: 'luh-SOO-too' },
  { name: 'Guinea-Bissau', coordinates: [-15.1804, 11.8037], language: 'Portuguese', languageCode: 'pt', pronunciation: 'GIN-ee bih-SOW' },
  { name: 'Equatorial Guinea', coordinates: [10.2679, 1.6508], language: 'Spanish', languageCode: 'es', pronunciation: 'ee-kwuh-TOR-ee-ul GIN-ee' },
  { name: 'Mauritius', coordinates: [57.5522, -20.3484], language: 'English', languageCode: 'en', pronunciation: 'muh-RISH-us' },
  { name: 'Eswatini', coordinates: [31.4659, -26.5225], language: 'English', languageCode: 'en', pronunciation: 'es-wah-TEE-nee' },
  { name: 'Djibouti', coordinates: [42.5903, 11.8251], language: 'French', languageCode: 'fr', pronunciation: 'jih-BOO-tee' },
  { name: 'Réunion', coordinates: [55.5364, -21.1151], language: 'French', languageCode: 'fr', pronunciation: 'ray-yoo-nee-OHN' },
  { name: 'Comoros', coordinates: [43.8722, -11.6455], language: 'French', languageCode: 'fr', pronunciation: 'KOM-uh-rohz' },
  { name: 'Cape Verde', coordinates: [-24.0132, 16.0021], language: 'Portuguese', languageCode: 'pt', pronunciation: 'KAYP VURD' },
  { name: 'São Tomé and Príncipe', coordinates: [6.6131, 0.1864], language: 'Portuguese', languageCode: 'pt', pronunciation: 'SOW toh-MAY and PRIN-sih-pay' },
  { name: 'Seychelles', coordinates: [55.4919, -4.6796], language: 'English', languageCode: 'en', pronunciation: 'say-SHELZ' },
  
  // Asia
  { name: 'China', coordinates: [104.1954, 35.8617], language: 'Chinese', languageCode: 'zh', pronunciation: 'CHY-nuh' },
  { name: 'India', coordinates: [78.9629, 20.5937], language: 'Hindi', languageCode: 'hi', pronunciation: 'IN-dee-uh' },
  { name: 'Indonesia', coordinates: [113.9213, -0.7893], language: 'Indonesian', languageCode: 'id', pronunciation: 'in-doh-NEE-zhuh' },
  { name: 'Pakistan', coordinates: [69.3451, 30.3753], language: 'Urdu', languageCode: 'ur', pronunciation: 'PAK-ih-stan' },
  { name: 'Bangladesh', coordinates: [90.3563, 23.6850], language: 'Bengali', languageCode: 'bn', pronunciation: 'bang-gluh-DESH' },
  { name: 'Japan', coordinates: [138.2529, 36.2048], language: 'Japanese', languageCode: 'ja', pronunciation: 'juh-PAN' },
  { name: 'Philippines', coordinates: [121.7740, 12.8797], language: 'Filipino', languageCode: 'tl', pronunciation: 'FIL-ih-peenz' },
  { name: 'Vietnam', coordinates: [108.2772, 14.0583], language: 'Vietnamese', languageCode: 'vi', pronunciation: 'vee-et-NAHM' },
  { name: 'Thailand', coordinates: [100.9925, 15.8700], language: 'Thai', languageCode: 'th', pronunciation: 'TY-land' },
  { name: 'Myanmar', coordinates: [95.9562, 21.9162], language: 'Burmese', languageCode: 'my', pronunciation: 'MEE-an-mar' },
  { name: 'South Korea', coordinates: [127.7669, 35.9078], language: 'Korean', languageCode: 'ko', pronunciation: 'SOUTH kuh-REE-uh' },
  { name: 'North Korea', coordinates: [127.5101, 40.3399], language: 'Korean', languageCode: 'ko', pronunciation: 'NORTH kuh-REE-uh' },
  { name: 'Afghanistan', coordinates: [67.7101, 33.9391], language: 'Pashto', languageCode: 'ps', pronunciation: 'af-GAN-ih-stan' },
  { name: 'Iraq', coordinates: [43.6793, 33.2232], language: 'Arabic', languageCode: 'ar', pronunciation: 'ih-RAK' },
  { name: 'Saudi Arabia', coordinates: [45.0792, 23.8859], language: 'Arabic', languageCode: 'ar', pronunciation: 'SOW-dee uh-RAY-bee-uh' },
  { name: 'Uzbekistan', coordinates: [64.5853, 41.3775], language: 'Uzbek', languageCode: 'uz', pronunciation: 'ooz-BEK-ih-stan' },
  { name: 'Malaysia', coordinates: [101.9758, 4.2105], language: 'Malay', languageCode: 'ms', pronunciation: 'muh-LAY-zhuh' },
  { name: 'Yemen', coordinates: [48.5164, 15.5527], language: 'Arabic', languageCode: 'ar', pronunciation: 'YEM-en' },
  { name: 'Nepal', coordinates: [84.1240, 28.3949], language: 'Nepali', languageCode: 'ne', pronunciation: 'nuh-PAHL' },
  { name: 'Sri Lanka', coordinates: [80.7718, 7.8731], language: 'Sinhala', languageCode: 'si', pronunciation: 'sree LAHNG-kuh' },
  { name: 'Kazakhstan', coordinates: [66.9237, 48.0196], language: 'Kazakh', languageCode: 'kk', pronunciation: 'kah-zahk-STAN' },
  { name: 'Syria', coordinates: [38.9968, 34.8021], language: 'Arabic', languageCode: 'ar', pronunciation: 'SEER-ee-uh' },
  { name: 'Cambodia', coordinates: [104.9909, 12.5657], language: 'Khmer', languageCode: 'km', pronunciation: 'kam-BOH-dee-uh' },
  { name: 'Jordan', coordinates: [36.2384, 30.5852], language: 'Arabic', languageCode: 'ar', pronunciation: 'JOR-dun' },
  { name: 'Azerbaijan', coordinates: [47.5769, 40.1431], language: 'Azerbaijani', languageCode: 'az', pronunciation: 'az-er-by-JAHN' },
  { name: 'United Arab Emirates', coordinates: [53.8478, 23.4241], language: 'Arabic', languageCode: 'ar', pronunciation: 'YOO-nited AIR-ub EM-ih-rats' },
  { name: 'Tajikistan', coordinates: [71.2761, 38.8610], language: 'Tajik', languageCode: 'tg', pronunciation: 'tah-JEEK-ih-stan' },
  { name: 'Laos', coordinates: [102.4955, 19.8563], language: 'Lao', languageCode: 'lo', pronunciation: 'LAH-ohs' },
  { name: 'Israel', coordinates: [34.8516, 31.0461], language: 'Hebrew', languageCode: 'he', pronunciation: 'IZ-ray-el' },
  { name: 'Lebanon', coordinates: [35.8623, 33.8547], language: 'Arabic', languageCode: 'ar', pronunciation: 'LEB-uh-nun' },
  { name: 'Kyrgyzstan', coordinates: [74.7661, 41.2044], language: 'Kyrgyz', languageCode: 'ky', pronunciation: 'KIR-gih-stan' },
  { name: 'Turkmenistan', coordinates: [59.5563, 38.9697], language: 'Turkmen', languageCode: 'tk', pronunciation: 'TURK-men-ih-stan' },
  { name: 'Singapore', coordinates: [103.8198, 1.3521], language: 'English', languageCode: 'en', pronunciation: 'SING-uh-por' },
  { name: 'Oman', coordinates: [55.9233, 21.4735], language: 'Arabic', languageCode: 'ar', pronunciation: 'oh-MAHN' },
  { name: 'Kuwait', coordinates: [47.4818, 29.3117], language: 'Arabic', languageCode: 'ar', pronunciation: 'koo-WAYT' },
  { name: 'Georgia', coordinates: [43.3569, 42.3154], language: 'Georgian', languageCode: 'ka', pronunciation: 'JOR-juh' },
  { name: 'Mongolia', coordinates: [103.8467, 46.8625], language: 'Mongolian', languageCode: 'mn', pronunciation: 'mon-GOH-lee-uh' },
  { name: 'Armenia', coordinates: [45.0382, 40.0691], language: 'Armenian', languageCode: 'hy', pronunciation: 'ar-MEE-nee-uh' },
  { name: 'Qatar', coordinates: [51.1839, 25.3548], language: 'Arabic', languageCode: 'ar', pronunciation: 'KAH-tar' },
  { name: 'Bahrain', coordinates: [50.6378, 25.9304], language: 'Arabic', languageCode: 'ar', pronunciation: 'bah-RAYN' },
  { name: 'Timor-Leste', coordinates: [125.7275, -8.8742], language: 'Portuguese', languageCode: 'pt', pronunciation: 'TEE-mor LES-tay' },
  { name: 'Cyprus', coordinates: [33.4299, 35.1264], language: 'Greek', languageCode: 'el', pronunciation: 'SY-prus' },
  { name: 'Bhutan', coordinates: [90.4336, 27.5142], language: 'Dzongkha', languageCode: 'dz', pronunciation: 'boo-TAHN' },
  { name: 'Brunei', coordinates: [114.7277, 4.5353], language: 'Malay', languageCode: 'ms', pronunciation: 'broo-NY' },
  { name: 'Taiwan', coordinates: [120.9605, 23.6978], language: 'Chinese', languageCode: 'zh', pronunciation: 'TY-WAN' },
  { name: 'Hong Kong', coordinates: [114.1694, 22.3193], language: 'Chinese', languageCode: 'zh', pronunciation: 'hong KONG' },
  { name: 'Macau', coordinates: [113.5439, 22.1987], language: 'Chinese', languageCode: 'zh', pronunciation: 'muh-KOW' },
  
  // Oceania
  { name: 'Australia', coordinates: [133.7751, -25.2744], language: 'English', languageCode: 'en', pronunciation: 'aw-STRAY-lee-uh' },
  { name: 'Papua New Guinea', coordinates: [143.9555, -6.3149], language: 'English', languageCode: 'en', pronunciation: 'PAP-oo-uh noo GIN-ee' },
  { name: 'New Zealand', coordinates: [174.8860, -40.9006], language: 'English', languageCode: 'en', pronunciation: 'noo ZEE-land' },
  { name: 'Fiji', coordinates: [-1.8312, -16.5788], language: 'English', languageCode: 'en', pronunciation: 'FEE-jee' },
  { name: 'Solomon Islands', coordinates: [160.1562, -9.6457], language: 'English', languageCode: 'en', pronunciation: 'SOL-uh-mun EYE-landz' },
  { name: 'Vanuatu', coordinates: [166.9592, -15.3767], language: 'Bislama', languageCode: 'bi', pronunciation: 'van-oo-AH-too' },
  { name: 'Samoa', coordinates: [-172.1046, -13.7590], language: 'Samoan', languageCode: 'sm', pronunciation: 'suh-MOH-uh' },
  { name: 'Kiribati', coordinates: [-157.3633, 1.8709], language: 'English', languageCode: 'en', pronunciation: 'KIR-ih-bas' },
  { name: 'Tonga', coordinates: [-175.1982, -21.1789], language: 'Tongan', languageCode: 'to', pronunciation: 'TONG-uh' },
  { name: 'Micronesia', coordinates: [150.5508, 7.4256], language: 'English', languageCode: 'en', pronunciation: 'my-kroh-NEE-zhuh' },
  { name: 'Palau', coordinates: [134.5825, 7.5150], language: 'English', languageCode: 'en', pronunciation: 'puh-LOW' },
  { name: 'Marshall Islands', coordinates: [171.1845, 7.1315], language: 'English', languageCode: 'en', pronunciation: 'MAR-shul EYE-landz' },
  { name: 'Tuvalu', coordinates: [177.6493, -7.1095], language: 'English', languageCode: 'en', pronunciation: 'too-VAH-loo' },
  { name: 'Nauru', coordinates: [166.9315, -0.5228], language: 'English', languageCode: 'en', pronunciation: 'now-ROO' },
];

// Helper functions
export const getCountryByName = (name: string): CountryData | undefined => {
  return ALL_COUNTRIES.find(country => country.name === name);
};

export const getCountriesByLanguage = (languageCode: string): CountryData[] => {
  return ALL_COUNTRIES.filter(country => country.languageCode === languageCode);
};

export const getAllLanguageCodes = (): string[] => {
  return [...new Set(ALL_COUNTRIES.map(country => country.languageCode))];
};

export const getCountriesForZoomLevel = (zoomLevel: number): CountryData[] => {
  if (zoomLevel < 1.5) {
    // Low zoom: show only major countries per language group
    const majorCountries = new Map<string, CountryData>();
    ALL_COUNTRIES.forEach(country => {
      if (!majorCountries.has(country.languageCode)) {
        majorCountries.set(country.languageCode, country);
      }
    });
    return Array.from(majorCountries.values());
  } else if (zoomLevel < 2.5) {
    // Medium zoom: show all countries
    return ALL_COUNTRIES;
  } else {
    // High zoom: show all countries
    return ALL_COUNTRIES;
  }
};
