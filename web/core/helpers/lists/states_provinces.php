<?php
/**
 * @package Helpers
 * @category Concrete
 * @author Andrew Embler <andrew@concrete5.org>
 * @copyright  Copyright (c) 2003-2008 Concrete5. (http://www.concrete5.org)
 * @license    http://www.concrete5.org/license/     MIT License
 */

/**
 * Grabs a list of states and provinces commonly used in web forms.
 * @package Helpers
 * @category Concrete
 * @author Andrew Embler <andrew@concrete5.org>
 * @copyright  Copyright (c) 2003-2008 Concrete5. (http://www.concrete5.org)
 * @license    http://www.concrete5.org/license/     MIT License
 */

defined('C5_EXECUTE') or die("Access Denied.");
class Concrete5_Helper_Lists_StatesProvinces {

	/** Locale for which we currently loaded the data.
	* @var string
	*/
	protected $locale = null;

	protected $stateProvinces = array(
	'US' => array(
		'AL' => 'Alabama',
		'AK' => 'Alaska',
		'AZ' => 'Arizona',
		'AR' => 'Arkansas',
		'CA' => 'California',
		'CO' => 'Colorado',
		'CT' => 'Connecticut',
		'DE' => 'Delaware',
		'FL' => 'Florida',
		'GA' => 'Georgia',
		'HI' => 'Hawaii',
		'ID' => 'Idaho',
		'IL' => 'Illinois',
		'IN' => 'Indiana',
		'IA' => 'Iowa',
		'KS' => 'Kansas',
		'KY' => 'Kentucky',
		'LA' => 'Louisiana',
		'ME' => 'Maine',
		'MD' => 'Maryland',
		'MA' => 'Massachusetts',
		'MI' => 'Michigan',
		'MN' => 'Minnesota',
		'MS' => 'Mississippi',
		'MO' => 'Missouri',
		'MT' => 'Montana',
		'NE' => 'Nebraska',
		'NV' => 'Nevada',
		'NH' => 'New Hampshire',
		'NJ' => 'New Jersey',
		'NM' => 'New Mexico',
		'NY' => 'New York',
		'NC' => 'North Carolina',
		'ND' => 'North Dakota',
		'OH' => 'Ohio',
		'OK' => 'Oklahoma',
		'OR' => 'Oregon',
		'PA' => 'Pennsylvania',
		'RI' => 'Rhode Island',
		'SC' => 'South Carolina',
		'SD' => 'South Dakota',
		'TN' => 'Tennessee',
		'TX' => 'Texas',
		'UT' => 'Utah',
		'VT' => 'Vermont',
		'VA' => 'Virginia',
		'WA' => 'Washington',
		'DC' => 'Washington, DC',
		'WV' => 'West Virginia',
		'WI' => 'Wisconsin',
		'WY' => 'Wyoming'
	),

	'CA' => array(
		'AB' => 'Alberta',
		'BC' => 'British Columbia',
		'MB' => 'Manitoba',
		'NB' => 'New Brunswick',
		'NL' => 'Newfoundland and Labrador',
		'NT' => 'Northwest Territories',
		'NS' => 'Nova Scotia',
		'NU' => 'Nunavut',
		'ON' => 'Ontario',
		'PE' => 'Prince Edward Island',
		'QC' => 'Quebec',
		'SK' => 'Saskatchewan',
		'YT' => 'Yukon'
	),

	'AU' => array(
		'AAT' => 'Australian Antarctic Territory',
		'ACT' => 'Australian Capital Territory',
		'NT' => 'Northern Territory',
		'NSW' => 'New South Wales',
		'QLD' => 'Queensland',
		'SA' => 'South Australia',
		'TAS' => 'Tasmania',
		'VIC' => 'Victoria',
		'WA' => 'Western Australia',
	),

	'DE' => array(
		'BW' => 'Baden-Württemberg',
		'BY' => 'Bayern',
		'BE' => 'Berlin',
		'BB' => 'Brandenburg',
		'HB' => 'Bremen',
		'HH' => 'Hamburg',
		'HE' => 'Hessen',
		'MV' => 'Mecklenburg-Vorpommern',
		'NI' => 'Niedersachsen',
		'NW' => 'Nordrhein-Westfalen',
		'RP' => 'Rheinland-Pfalz',
		'SL' => 'Saarland',
		'SN' => 'Sachsen',
		'ST' => 'Sachsen-Anhalt',
		'SH' => 'Schleswig-Holstein',
		'TH' => 'Thüringen'
	),

	'FR' => array(
		'01' => 'Ain',
		'02' => 'Aisne',
		'03' => 'Allier',
		'04' => 'Alpes-de-Haute-Provence',
		'05' => 'Haute-Alpes',
		'06' => 'Alpes-Maritimes',
		'07' => 'Ardèche',
		'08' => 'Ardennes',
		'09' => 'Ariège',
		'10' => 'Aube',
		'11' => 'Aude',
		'12' => 'Aveyron',
		'13' => 'Bouches-du-Rhône',
		'14' => 'Calvados',
		'15' => 'Cantal',
		'16' => 'Charente',
		'17' => 'Charente-Maritime',
		'18' => 'Cher',
		'19' => 'Corrèze',
		'2A' => 'Corse-du-Sud',
		'2B' => 'Haute-Corse',
		'21' => 'Côte-d\'Or',
		'22' => 'Côte-d\'Armor',
		'23' => 'Creuse',
		'24' => 'Dordogne',
		'25' => 'Doubs',
		'26' => 'Drôme',
		'27' => 'Eure',
		'28' => 'Eure-et-Loir',
		'29' => 'Finistère',
		'30' => 'Gard',
		'31' => 'Haute-Garonne',
		'32' => 'Gers',
		'33' => 'Gironde',
		'34' => 'Hérault',
		'35' => 'Ille-et-Vilaine',
		'36' => 'Indre',
		'37' => 'Indre-et-Loire',
		'38' => 'Isère',
		'39' => 'Jura',
		'40' => 'Landes',
		'41' => 'Loir-et-Cher',
		'42' => 'Loire',
		'43' => 'Haute-Loire',
		'44' => 'Loire-Atlantique',
		'45' => 'Loiret',
		'46' => 'Lot',
		'47' => 'Lot-et-Garonne',
		'48' => 'Lozère',
		'49' => 'Maine-et-Loire',
		'50' => 'Manche',
		'51' => 'Marne',
		'52' => 'Haute-Marne',
		'53' => 'Mayenne',
		'54' => 'Meurthe-et-Moselle',
		'55' => 'Meuse',
		'56' => 'Morbihan',
		'57' => 'Moselle',
		'58' => 'Nièvre',
		'59' => 'Nord',
		'60' => 'Oise',
		'61' => 'Orne',
		'62' => 'Pas-de-Calais',
		'63' => 'Puy-de-Dôme',
		'64' => 'Pyrénées-Atlantiques',
		'65' => 'Hautes-Pyrénées',
		'66' => 'Pyrénées-Orientales',
		'67' => 'Bas-Rhin',
		'68' => 'Haut-Rhin',
		'69' => 'Rhône',
		'70' => 'Haute-Saône',
		'71' => 'Saône-et-Loire',
		'72' => 'Sarthe',
		'73' => 'Savoie',
		'74' => 'Haute-Savoie',
		'75' => 'Paris',
		'76' => 'Seine-Maritime',
		'77' => 'Seine-et-Marne',
		'78' => 'Yvelines',
		'79' => 'Deux-Sèvres',
		'80' => 'Somme',
		'81' => 'Tarn',
		'82' => 'Tarn-et-Garonne',
		'83' => 'Var',
		'84' => 'Vaucluse',
		'85' => 'Vendée',
		'86' => 'Vienne',
		'87' => 'Haute-Vienne',
		'88' => 'Vosges',
		'89' => 'Yonne',
		'90' => 'Territoire de Belfort',
		'91' => 'Essonne',
		'92' => 'Hauts-de-Seine',
		'93' => 'Seine-Saint-Denis',
		'94' => 'Val-de-Marne',
		'95' => 'Val-d\'Oise'
	),

	'UK' => array(
		'ANGLES' => 'Anglesey',
		'BRECK' => 'Brecknockshire',
		'CAERN' => 'Caernarfonshire',
		'CARMA' => 'Carmathenshire',
		'CARDIG' => 'Cardiganshire',
		'DENBIG' => 'Denbighshire',
		'FLINTS' => 'Flintshire',
		'GLAMO' => 'Glamorgan',
		'MERION' => 'Merioneth',
		'MONMOUTH' => 'Monmouthshire',
		'MONTG' => 'Mongtomeryshire',
		'PEMBR' => 'Pembrokeshire',
		'RADNOR' => 'Radnorshire',
		'ARBERD' => 'Aberdeenshire',
		'ANGUS' => 'Angus',
		'ARGYLL' => 'Argyllshire',
		'AYRSH' => 'Ayrshire',
		'BANFF' => 'Banffshire',
		'BERWICK' => 'Berwickshire',
		'BUTE' => 'Buteshire',
		'CROMART' => 'Cromartyshire',
		'CAITH' => 'Caithness',
		'CLACKM' => 'Clackmannanshire',
		'DUMFR' => 'Dumfriesshire',
		'DUNBART' => 'Dunbartonshire',
		'EASTL' => 'East Lothian',
		'FIFE' => 'Fife',
		'INVERN' => 'Inverness-shire',
		'KINCARD' => 'Kincardineshire',
		'KINROSS' => 'Kinross-shire',
		'KIRKCUD' => 'Kircudbrightshire',
		'LANARK' => 'Lanarkshire',
		'MIDLOTH' => 'Midlothian',
		'MORAY' => 'Morayshire',
		'NAIRN' => 'Nairnshire',
		'ORKNEY' => 'Orkeny',
		'PEEBLESS' => 'Peeblesshire',
		'PERTH' => 'Perthshire',
		'RENFREW' => 'Renfrewshire',
		'ROSSSH' => 'Ross-shire',
		'ROXBURGH' => 'Roxburghshire',
		'SELKIRK' => 'Selkirkshire',
		'SHETLAND' => 'Shetland',
		'STIRLING' => 'Stirlingshire',
		'SUTHER' => 'Sutherland',
		'WESTL' => 'West Lothian',
		'WIGTOWN' => 'Wigtownshire',
		'MERSEYSIDE' => 'Merseyside',
		'BEDS' => 'Bedfordshire',
		'LONDON' => 'London',
		'BERKS' => 'Berkshire',
		'BUCKS' => 'Buckinghamshire',
		'CAMBS' => 'Cambridgeshire',
		'CHESH' => 'Cheshire',
		'CORN' => 'Cornwall',
		'CUMB' => 'Cumberland',
		'DERBY' => 'Derbyshire',
		'DEVON' => 'Devon',
		'DORSET' => 'Dorset',
		'DURHAM' => 'Durham',
		'ESSEX' => 'Essex',
		'GLOUS' => 'Gloucestershire',
		'HANTS' => 'Hampshire',
		'HEREF' => 'Herefordshire',
		'HERTS' => 'Hertfordshire',
		'HUNTS' => 'Huntingdonshire',
		'KENT' => 'Kent',
		'LANCS' => 'Lancashire',
		'LEICS' => 'Leicestershire',
		'LINCS' => 'Lincolnshire',
		'MIDDLE' => 'Middlesex',
		'NORF' => 'Norfolk',
		'NHANTS' => 'Northamptonshire',
		'NTHUMB' => 'Northumberland',
		'NOTTS' => 'Nottinghamshire',
		'OXON' => 'Oxfordshire',
		'RUTL' => 'Rutland',
		'SHROPS' => 'Shropshire',
		'SOM' => 'Somerset',
		'STAFFS' => 'Staffordshire',
		'SUFF' => 'Suffolk',
		'SURREY' => 'Surrey',
		'SUSS' => 'Sussex',
		'WARKS' => 'Warwickshire',
		'WESTMOR' => 'Westmorland',
		'WILTS' => 'Wiltshire',
		'WORCES' => 'Worcestershire',
		'YORK' => 'Yorkshire'
	),

	'IE' => array(
		'CO ANTRIM' => 'County Antrim',
		'CO ARMAGH' => 'County Armagh',
		'CO DOWN' => 'County Down',
		'CO FERMANAGH' => 'County Fermanagh',
		'CO DERRY' => 'County Londonderry',
		'CO TYRONE' => 'County Tyrone',
		'CO CAVAN' => 'County Cavan',
		'CO DONEGAL' => 'County Donegal',
		'CO MONAGHAN' => 'County Monaghan',
		'CO DUBLIN' => 'County Dublin',
		'CO CARLOW' => 'County Carlow',
		'CO KILDARE' => 'County Kildare',
		'CO KILKENNY' => 'County Kilkenny',
		'CO LAOIS' => 'County Laois',
		'CO LONGFORD' => 'County Longford',
		'CO LOUTH' => 'County Louth',
		'CO MEATH' => 'County Meath',
		'CO OFFALY' => 'County Offaly',
		'CO WESTMEATH' => 'County Westmeath',
		'CO WEXFORD' => 'County Wexford',
		'CO WICKLOW' => 'County Wicklow',
		'CO GALWAY' => 'County Galway',
		'CO MAYO' => 'County Mayo',
		'CO LEITRIM' => 'County Leitrim',
		'CO ROSCOMMON' => 'County Roscommon',
		'CO SLIGO' => 'County Sligo',
		'CO CLARE' => 'County Clare',
		'CO CORK' => 'County Cork',
		'CO KERRY' => 'County Kerry',
		'CO LIMERICK' => 'County Limerick',
		'CO TIPPERARY' => 'County Tipperary',
		'CO WATERFORD' => 'County Waterford'
	),

	'NL' => array(
		'DR' => 'Drenthe',
		'FL' => 'Flevoland',
		'FR' => 'Friesland',
		'GL' => 'Gelderland',
		'GR' => 'Groningen',
		'LB' => 'Limburg',
		'NB' => 'Noord Brabant',
		'NH' => 'Noord Holland',
		'OV' => 'Overijssel',
		'UT' => 'Utrecht',
		'ZH' => 'Zuid Holland',
		'ZL' => 'Zeeland'
	),

	'BR' => array(
		'AC' => 'Acre',
		'AL' => 'Alagoas',
		'AM' => 'Amazonas',
		'AP' => 'Amapa',
		'BA' => 'Baia',
		'CE' => 'Ceara',
		'DF' => 'Distrito Federal',
		'ES' => 'Espirito Santo',
		'FN' => 'Fernando de Noronha',
		'GO' => 'Goias',
		'MA' => 'Maranhao',
		'MG' => 'Minas Gerais',
		'MS' => 'Mato Grosso do Sul',
		'MT' => 'Mato Grosso',
		'PA' => 'Para',
		'PB' => 'Paraiba',
		'PE' => 'Pernambuco',
		'PI' => 'Piaui',
		'PR' => 'Parana',
		'RJ' => 'Rio de Janeiro',
		'RN' => 'Rio Grande do Norte',
		'RO' => 'Rondonia',
		'RR' => 'Roraima',
		'RS' => 'Rio Grande do Sul',
		'SC' => 'Santa Catarina',
		'SE' => 'Sergipe',
		'SP' => 'Sao Paulo',
		'TO' => 'Tocantins'
	),

	'IT' => array(
		'AG' => 'Agrigento',
		'AL' => 'Alessandria',
		'AN' => 'Ancona',
		'AO' => 'Aosta',
		'AR' => 'Arezzo',
		'AP' => 'Ascoli Piceno',
		'AT' => 'Asti',
		'AV' => 'Avellino',
		'BA' => 'Bari',
		'BT' => 'Barletta-Andria-Trani',
		'BL' => 'Belluno',
		'BN' => 'Benevento',
		'BG' => 'Bergamo',
		'BI' => 'Biella',
		'BO' => 'Bologna',
		'BZ' => 'Bolzano',
		'BS' => 'Brescia',
		'BR' => 'Brindisi',
		'CA' => 'Cagliari',
		'CL' => 'Caltanissetta',
		'CB' => 'Campobasso',
		'CI' => 'Carbonia-Iglesias',
		'CE' => 'Caserta',
		'CT' => 'Catania',
		'CZ' => 'Catanzaro',
		'CH' => 'Chieti',
		'CO' => 'Como',
		'CS' => 'Cosenza',
		'CR' => 'Cremona',
		'KR' => 'Crotone',
		'CN' => 'Cuneo',
		'EN' => 'Enna',
		'FM' => 'Fermo',
		'FE' => 'Ferrara',
		'FI' => 'Firenze',
		'FG' => 'Foggia',
		'FC' => 'Forlì-Cesena',
		'FR' => 'Frosinone',
		'GE' => 'Genova',
		'GO' => 'Gorizia',
		'GR' => 'Grosseto',
		'IM' => 'Imperia',
		'IS' => 'Isernia',
		'AQ' => 'L’Aquila',
		'SP' => 'La Spezia',
		'LT' => 'Latina',
		'LE' => 'Lecce',
		'LC' => 'Lecco',
		'LI' => 'Livorno',
		'LO' => 'Lodi',
		'LU' => 'Lucca',
		'MC' => 'Macerata',
		'MN' => 'Mantova',
		'MS' => 'Massa e Carrara',
		'MT' => 'Matera',
		'VS' => 'Medio Campidano',
		'ME' => 'Messina',
		'MI' => 'Milano',
		'MO' => 'Modena',
		'MB' => 'Monza e Brianza',
		'NA' => 'Napoli',
		'NO' => 'Novara',
		'NU' => 'Nuoro',
		'OG' => 'Ogliastra',
		'OT' => 'Olbia-Tempio',
		'OR' => 'Oristano',
		'PD' => 'Padova',
		'PA' => 'Palermo',
		'PR' => 'Parma',
		'PV' => 'Pavia',
		'PG' => 'Perugia',
		'PU' => 'Pesaro e Urbino',
		'PE' => 'Pescara',
		'PC' => 'Piacenza',
		'PI' => 'Pisa',
		'PT' => 'Pistoia',
		'PN' => 'Pordenone',
		'PZ' => 'Potenza',
		'PO' => 'Prato',
		'RG' => 'Ragusa',
		'RA' => 'Ravenna',
		'RC' => 'Reggio Calabria',
		'RE' => 'Reggio Emilia',
		'RI' => 'Rieti',
		'RN' => 'Rimini',
		'RM' => 'Roma',
		'RO' => 'Rovigo',
		'SA' => 'Salerno',
		'SS' => 'Sassari',
		'SV' => 'Savona',
		'SI' => 'Siena',
		'SR' => 'Siracusa',
		'SO' => 'Sondrio',
		'TA' => 'Taranto',
		'TE' => 'Teramo',
		'TR' => 'Terni',
		'TO' => 'Torino',
		'TP' => 'Trapani',
		'TN' => 'Trento',
		'TV' => 'Treviso',
		'TS' => 'Trieste',
		'UD' => 'Udine',
		'VA' => 'Varese',
		'VE' => 'Venezia',
		'VB' => 'Verbano-Cusio-Ossola',
		'VC' => 'Vercelli',
		'VR' => 'Verona',
		'VV' => 'Vibo Valentia',
		'VI' => 'Vicenza',
		'VT' => 'Viterbo'
	),

	'JP' => array(
		'01' => '北海道',
		'02' => '青森県',
		'03' => '岩手県',
		'04' => '宮城県',
		'05' => '秋田県',
		'06' => '山形県',
		'07' => '福島県',
		'08' => '茨城県',
		'09' => '栃木県',
		'10' => '群馬県',
		'11' => '埼玉県',
		'12' => '千葉県',
		'13' => '東京都',
		'14' => '神奈川県',
		'15' => '新潟県',
		'16' => '富山県',
		'17' => '石川県',
		'18' => '福井県',
		'19' => '山梨県',
		'20' => '長野県',
		'21' => '岐阜県',
		'22' => '静岡県',
		'23' => '愛知県',
		'24' => '三重県',
		'25' => '滋賀県',
		'26' => '京都府',
		'27' => '大阪府',
		'28' => '兵庫県',
		'29' => '奈良県',
		'30' => '和歌山県',
		'31' => '鳥取県',
		'32' => '島根県',
		'33' => '岡山県',
		'34' => '広島県',
		'35' => '山口県',
		'36' => '徳島県',
		'37' => '香川県',
		'38' => '愛媛県',
		'39' => '高知県',
		'40' => '福岡県',
		'41' => '佐賀県',
		'42' => '長崎県',
		'43' => '熊本県',
		'44' => '大分県',
		'45' => '宮崎県',
		'46' => '鹿児島県',
		'47' => '沖縄県'
	)

	);

	protected $sortedCountries = array('JP');

	public function reset() {
		$locale = Localization::activeLocale();
		if($locale === $this->locale) {
			return;
		}
		$this->locale = $locale;
		$this->stateProvinces['GB'] = $this->stateProvinces['UK'];
		$stateProvincesFromEvent = Events::fire('on_get_states_provinces_list', $this->stateProvinces);
		if(is_array($stateProvincesFromEvent)) {
			$this->stateProvinces = $stateProvincesFromEvent;
		} else {
			foreach(array_keys($this->stateProvinces) as $country) {
				if (!in_array($country, $this->sortedCountries)) {
					asort($this->stateProvinces[$country]);
				}
			}
		}
	}

	/** Returns the list of States/Provinces for some countries (States/Provinces are sorted alphabetically).
	* @return array Returns an array whose keys are the country codes and the values are arrays (with keys: State/Province code, values: State/Province names)
	*/
	public function getAll() {
		return $this->stateProvinces;
	}

	/** Returns the name of a specified State/Province in a specified Country.
	* @param string $code The State/Province code.
	* @param string $country The Country code.
	* @return string|void Returns the State/Province name (if found), or nothing if not found.
	*/
	public function getStateProvinceName($code, $country) {
		if(isset($this->stateProvinces[$country]) && isset($this->stateProvinces[$country][$code])) {
			return $this->stateProvinces[$country][$code];
		}
	}

	/** Returns a list of States/Provinces for a country.
	* @param string $country The country code.
	* @return array|void If the Country is supported, the function returns an array (whose keys are the States/Provinces codes and the values are their names); returns nothing if $country is not supported.
	*/
	public function getStateProvinceArray($country) {
		if(isset($this->stateProvinces[$country])) {
			return $this->stateProvinces[$country];
		}
	}

	/** Returns the list of US states.
	* @deprecated
	* @return array Returns an array whose keys are the US State codes and the values are their names.
	*/
	public function getStates() {
		return $this->getStateProvinceArray('US');
	}

	/** Returns the list of Canadian provinces.
	* @deprecated
	* @return array Returns an array whose keys are the Canadian Provinces codes and the values are their names.
	*/
	public function getCanadianProvinces() {
		return $this->getStateProvinceArray('CA');
	}

}
