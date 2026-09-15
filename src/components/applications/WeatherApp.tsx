import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CloudSun,
  Search,
  Wind,
  Droplets,
  Compass,
  Sun,
  CloudRain,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  Gauge,
  Navigation,
  LocateFixed,
  Cloud,
  CloudLightning,
  Snowflake,
  Umbrella,
  Loader2,
  AlertCircle,
  X,
  ChevronDown,
  Moon,
  Flower2,
  Leaf,
  Thermometer,
  Waves,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

type WeatherIconType =
  | 'sun'
  | 'rain'
  | 'cloud'
  | 'storm'
  | 'snow'
  | 'partly';

type Season =
  | 'Spring'
  | 'Summer'
  | 'Autumn'
  | 'Winter';

type Unit = 'C' | 'F';

interface HourlyWeather {
  time: string;
  temp: number;
  feelsLike: number;
  precipitation: number;
  rainProbability: number;
  windSpeed: number;
  icon: WeatherIconType;
}

interface DailyWeather {
  date: string;
  day: string;
  high: number;
  low: number;
  precipitation: number;
  rainProbability: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  icon: WeatherIconType;
}

interface WeatherData {
  city: string;
  country: string;

  latitude: number;
  longitude: number;

  temp: number;
  feelsLike: number;

  condition: string;

  high: number;
  low: number;

  humidity: number;
  windSpeed: number;
  windDirection: number;

  uvIndex: number;
  visibility: number;
  pressure: number;

  precipitation: number;
  rainProbability: number;

  sunrise: string;
  sunset: string;

  hourly: HourlyWeather[];
  daily: DailyWeather[];

  timezone: string;
}

interface LocationInfo {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

/* =========================================================
   WEATHER CODE
========================================================= */

const getWeatherInfo = (
  code: number
): {
  condition: string;
  icon: WeatherIconType;
} => {
  if (code === 0) {
    return {
      condition: 'Clear Sky',
      icon: 'sun',
    };
  }

  if (code === 1) {
    return {
      condition: 'Mainly Clear',
      icon: 'sun',
    };
  }

  if (code === 2) {
    return {
      condition: 'Partly Cloudy',
      icon: 'partly',
    };
  }

  if (code === 3) {
    return {
      condition: 'Overcast',
      icon: 'cloud',
    };
  }

  if ([45, 48].includes(code)) {
    return {
      condition: 'Foggy',
      icon: 'cloud',
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      condition: 'Drizzle',
      icon: 'rain',
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      condition: 'Rain Showers',
      icon: 'rain',
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      condition: 'Snow',
      icon: 'snow',
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      condition: 'Thunderstorm',
      icon: 'storm',
    };
  }

  return {
    condition: 'Unknown Conditions',
    icon: 'cloud',
  };
};

/* =========================================================
   WEATHER ICON
========================================================= */

const WeatherIcon: React.FC<{
  type: WeatherIconType;
  className?: string;
}> = ({
  type,
  className = 'h-6 w-6',
}) => {
  switch (type) {
    case 'sun':
      return <Sun className={className} />;

    case 'rain':
      return <CloudRain className={className} />;

    case 'storm':
      return <CloudLightning className={className} />;

    case 'snow':
      return <Snowflake className={className} />;

    case 'partly':
      return <CloudSun className={className} />;

    default:
      return <Cloud className={className} />;
  }
};

/* =========================================================
   TEMPERATURE
========================================================= */

const formatTemperature = (
  value: number,
  unit: Unit
) => {
  if (unit === 'F') {
    return Math.round((value * 9) / 5 + 32);
  }

  return Math.round(value);
};

/* =========================================================
   TIME
========================================================= */

const formatTime = (time: string) => {
  if (!time) return '--:--';

  const date = new Date(time);

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/* =========================================================
   DAY
========================================================= */

const formatDay = (
  date: string,
  index: number
) => {
  if (index === 0) {
    return 'Today';
  }

  const d = new Date(`${date}T12:00:00`);

  return d.toLocaleDateString([], {
    weekday: 'short',
  });
};

/* =========================================================
   WIND
========================================================= */

const getWindDirection = (
  degrees: number
) => {
  const directions = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW',
  ];

  return directions[
    Math.round(degrees / 45) % directions.length
  ];
};

/* =========================================================
   SEASON DETECTION
========================================================= */

const getSeason = (
  latitude: number
): Season => {
  const month = new Date().getMonth() + 1;

  const northern =
    latitude >= 0;

  if (northern) {
    if (month >= 3 && month <= 5) {
      return 'Spring';
    }

    if (month >= 6 && month <= 8) {
      return 'Summer';
    }

    if (month >= 9 && month <= 11) {
      return 'Autumn';
    }

    return 'Winter';
  }

  if (month >= 3 && month <= 5) {
    return 'Autumn';
  }

  if (month >= 6 && month <= 8) {
    return 'Winter';
  }

  if (month >= 9 && month <= 11) {
    return 'Spring';
  }

  return 'Summer';
};

/* =========================================================
   SEASON INFORMATION
========================================================= */

const getSeasonInfo = (
  season: Season
) => {
  switch (season) {
    case 'Spring':
      return {
        description:
          'New growth, warmer air & blooming flowers',
        icon: Flower2,
      };

    case 'Summer':
      return {
        description:
          'Long sunny days & warm atmospheric energy',
        icon: Sun,
      };

    case 'Autumn':
      return {
        description:
          'Cooler air & leaves changing color',
        icon: Leaf,
      };

    case 'Winter':
      return {
        description:
          'Cold air, frost & winter atmosphere',
        icon: Snowflake,
      };
  }
};

/* =========================================================
   WEATHER BACKGROUND
========================================================= */

const getWeatherBackground = (
  icon: WeatherIconType,
  season: Season
) => {
  if (icon === 'storm') {
    return 'from-indigo-950 via-purple-950 to-slate-950';
  }

  if (icon === 'rain') {
    return 'from-sky-950 via-blue-950/80 to-slate-950';
  }

  if (icon === 'snow') {
    return 'from-cyan-950/70 via-slate-900 to-slate-950';
  }

  if (season === 'Spring') {
    return 'from-emerald-950/60 via-sky-950/70 to-slate-950';
  }

  if (season === 'Summer') {
    return 'from-orange-950/50 via-sky-950/70 to-slate-950';
  }

  if (season === 'Autumn') {
    return 'from-orange-950/50 via-slate-900 to-slate-950';
  }

  if (season === 'Winter') {
    return 'from-cyan-950/60 via-slate-900 to-slate-950';
  }

  return 'from-sky-950/50 via-slate-900 to-slate-950';
};

/* =========================================================
   ATMOSPHERE PARTICLES
========================================================= */

const RAIN_PARTICLES = Array.from(
  { length: 65 },
  (_, i) => ({
    left: (i * 17.37) % 100,
    delay: (i * 0.17) % 4,
    duration: 0.55 + ((i * 0.13) % 0.65),
    opacity: 0.2 + ((i * 0.11) % 0.55),
    height: 12 + ((i * 7) % 20),
  })
);

const SNOW_PARTICLES = Array.from(
  { length: 55 },
  (_, i) => ({
    left: (i * 19.13) % 100,
    delay: (i * 0.27) % 8,
    duration: 5 + ((i * 0.31) % 7),
    size: 3 + ((i * 5) % 8),
    drift: -45 + ((i * 31) % 90),
    opacity: 0.3 + ((i * 0.07) % 0.65),
  })
);

const LEAF_PARTICLES = Array.from(
  { length: 24 },
  (_, i) => ({
    left: (i * 29.17) % 100,
    delay: (i * 0.41) % 8,
    duration: 6 + ((i * 0.27) % 7),
    size: 13 + ((i * 7) % 10),
    rotation: -90 + ((i * 37) % 180),
  })
);

const PETAL_PARTICLES = Array.from(
  { length: 24 },
  (_, i) => ({
    left: (i * 31.19) % 100,
    delay: (i * 0.33) % 8,
    duration: 7 + ((i * 0.23) % 6),
    size: 6 + ((i * 5) % 7),
    drift: -60 + ((i * 43) % 120),
  })
);

const STAR_PARTICLES = Array.from(
  { length: 45 },
  (_, i) => ({
    left: (i * 23.19) % 100,
    top: (i * 41.17) % 65,
    delay: (i * 0.21) % 4,
    size: 1 + ((i * 3) % 3),
  })
);

/* =========================================================
   ANIMATED WEATHER ATMOSPHERE
========================================================= */

const WeatherAtmosphere: React.FC<{
  weatherIcon: WeatherIconType;
  season: Season;
  isNight: boolean;
}> = ({
  weatherIcon,
  season,
  isNight,
}) => {
  const showRain =
    weatherIcon === 'rain' ||
    weatherIcon === 'storm';

  const showSnow =
    weatherIcon === 'snow' ||
    season === 'Winter';

  const showLeaves =
    season === 'Autumn' &&
    !showRain &&
    !showSnow;

  const showPetals =
    season === 'Spring' &&
    !showRain &&
    !showSnow;

  const showSummer =
    season === 'Summer' &&
    !showRain &&
    !showSnow;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ===============================================
          NIGHT SKY
      =============================================== */}

      {isNight && (
        <>
          <div className="absolute inset-0 bg-slate-950/20" />

          <div className="absolute right-[10%] top-[8%] h-24 w-24 rounded-full bg-slate-200/10 blur-xl animate-moon-glow" />

          <div className="absolute right-[11%] top-[7%] flex h-16 w-16 items-center justify-center rounded-full bg-slate-100/80 shadow-[0_0_50px_rgba(255,255,255,0.15)]">
            <Moon className="h-9 w-9 fill-slate-300 text-slate-300" />
          </div>

          {STAR_PARTICLES.map((star, index) => (
            <span
              key={`star-${index}`}
              className="absolute rounded-full bg-white animate-star-twinkle"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </>
      )}

      {/* ===============================================
          SUMMER SUN
      =============================================== */}

      {showSummer && (
        <div className="absolute right-[-60px] top-[-60px] h-72 w-72 sm:right-[4%] sm:top-[3%] sm:h-80 sm:w-80">
          <div className="absolute inset-8 rounded-full bg-amber-300/20 blur-3xl animate-sun-pulse" />

          <div className="absolute inset-20 rounded-full bg-amber-300/30 blur-2xl" />

          <div className="absolute inset-[90px] flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-amber-300/80 shadow-[0_0_70px_rgba(252,211,77,0.5)] sm:h-28 sm:w-28" />
          </div>

          <div className="absolute inset-0 animate-sun-spin">
            {Array.from(
              { length: 12 },
              (_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-28 w-1 origin-bottom rounded-full bg-amber-300/20"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                  }}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* ===============================================
          RAIN
      =============================================== */}

      {showRain && (
        <>
          <div className="absolute inset-0 bg-sky-950/5" />

          <div className="absolute -top-20 left-[-10%] h-52 w-[55%] rounded-full bg-slate-500/10 blur-3xl animate-cloud-drift" />

          <div className="absolute -top-12 right-[-10%] h-48 w-[50%] rounded-full bg-slate-600/10 blur-3xl animate-cloud-drift-reverse" />

          {RAIN_PARTICLES.map(
            (drop, index) => (
              <span
                key={`rain-${index}`}
                className="absolute top-[-80px] w-[1.5px] rounded-full bg-sky-200/60 animate-rain-fall"
                style={{
                  left: `${drop.left}%`,
                  height: `${drop.height}px`,
                  opacity: drop.opacity,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`,
                }}
              />
            )
          )}
        </>
      )}

      {/* ===============================================
          THUNDER
      =============================================== */}

      {weatherIcon === 'storm' && (
        <>
          <div className="absolute inset-0 bg-purple-950/10 animate-storm-darken" />

          <div className="absolute left-[25%] top-[18%] h-20 w-32 rounded-full bg-slate-400/10 blur-2xl" />

          <div className="absolute right-[20%] top-[10%] h-24 w-40 rounded-full bg-slate-400/10 blur-2xl" />
        </>
      )}

      {/* ===============================================
          SNOW
      =============================================== */}

      {showSnow && (
        <>
          <div className="absolute inset-0 bg-cyan-100/[0.015]" />

          {SNOW_PARTICLES.map(
            (snow, index) => (
              <span
                key={`snow-${index}`}
                className="absolute top-[-20px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-snow-fall"
                style={{
                  left: `${snow.left}%`,
                  width: `${snow.size}px`,
                  height: `${snow.size}px`,
                  opacity: snow.opacity,
                  animationDelay: `${snow.delay}s`,
                  animationDuration: `${snow.duration}s`,
                  ['--snow-drift' as any]: `${snow.drift}px`,
                }}
              />
            )
          )}
        </>
      )}

      {/* ===============================================
          AUTUMN LEAVES
      =============================================== */}

      {showLeaves && (
        <>
          <div className="absolute right-[-5%] top-[10%] h-60 w-60 rounded-full bg-orange-500/5 blur-3xl" />

          {LEAF_PARTICLES.map(
            (leaf, index) => (
              <div
                key={`leaf-${index}`}
                className="absolute top-[-40px] animate-leaf-fall"
                style={{
                  left: `${leaf.left}%`,
                  animationDelay: `${leaf.delay}s`,
                  animationDuration: `${leaf.duration}s`,
                  ['--leaf-rotation' as any]: `${leaf.rotation}deg`,
                }}
              >
                <Leaf
                  className="text-orange-300/50"
                  style={{
                    width: leaf.size,
                    height: leaf.size,
                  }}
                />
              </div>
            )
          )}
        </>
      )}

      {/* ===============================================
          SPRING PETALS
      =============================================== */}

      {showPetals && (
        <>
          <div className="absolute right-[15%] top-[12%] h-48 w-48 rounded-full bg-pink-400/10 blur-3xl animate-bloom-glow" />

          {PETAL_PARTICLES.map(
            (petal, index) => (
              <span
                key={`petal-${index}`}
                className="absolute top-[-20px] rounded-full bg-pink-300/50 animate-petal-fall"
                style={{
                  left: `${petal.left}%`,
                  width: `${petal.size}px`,
                  height: `${petal.size * 0.65}px`,
                  animationDelay: `${petal.delay}s`,
                  animationDuration: `${petal.duration}s`,
                  ['--petal-drift' as any]: `${petal.drift}px`,
                }}
              />
            )
          )}
        </>
      )}

      {/* ===============================================
          CLOUDS
      =============================================== */}

      {(weatherIcon === 'cloud' ||
        weatherIcon === 'partly') && (
        <>
          <div className="absolute left-[-20%] top-[12%] flex h-24 w-64 items-center opacity-10 animate-cloud-drift">
            <div className="absolute bottom-0 left-10 h-14 w-40 rounded-full bg-slate-200" />
            <div className="absolute bottom-5 left-20 h-20 w-20 rounded-full bg-slate-200" />
            <div className="absolute bottom-4 left-32 h-16 w-20 rounded-full bg-slate-200" />
          </div>

          <div className="absolute right-[-20%] top-[28%] flex h-24 w-64 items-center opacity-10 animate-cloud-drift-reverse">
            <div className="absolute bottom-0 left-10 h-14 w-40 rounded-full bg-slate-300" />
            <div className="absolute bottom-5 left-20 h-20 w-20 rounded-full bg-slate-300" />
            <div className="absolute bottom-4 left-32 h-16 w-20 rounded-full bg-slate-300" />
          </div>
        </>
      )}

      {/* ===============================================
          WIND PARTICLES
      =============================================== */}

      {weatherIcon !== 'rain' &&
        weatherIcon !== 'storm' &&
        weatherIcon !== 'snow' && (
          <div className="absolute bottom-[25%] left-0 right-0 opacity-20">
            <div className="h-px w-32 bg-white/30 animate-wind-line" />

            <div className="mt-6 h-px w-20 bg-white/20 animate-wind-line-2" />

            <div className="mt-8 h-px w-44 bg-white/10 animate-wind-line-3" />
          </div>
        )}
    </div>
  );
};

/* =========================================================
   WEATHER API
========================================================= */

const fetchWeather = async (
  latitude: number,
  longitude: number,
  city: string,
  country: string
): Promise<WeatherData> => {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,' +
    'precipitation,rain,weather_code,surface_pressure,' +
    'wind_speed_10m,wind_direction_10m,uv_index,visibility' +
    '&hourly=temperature_2m,apparent_temperature,' +
    'precipitation_probability,precipitation,' +
    'weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,' +
    'temperature_2m_min,precipitation_sum,' +
    'precipitation_probability_max,wind_speed_10m_max,' +
    'sunrise,sunset' +
    '&forecast_days=7' +
    '&timezone=auto';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      'Unable to fetch weather data.'
    );
  }

  const data = await response.json();

  const current = data.current;

  const currentInfo =
    getWeatherInfo(
      current.weather_code
    );

  const hourly: HourlyWeather[] =
    data.hourly.time
      .slice(0, 24)
      .map(
        (
          time: string,
          index: number
        ) => {
          const info =
            getWeatherInfo(
              data.hourly.weather_code[
                index
              ]
            );

          return {
            time,

            temp:
              data.hourly.temperature_2m[
                index
              ],

            feelsLike:
              data.hourly
                .apparent_temperature[
                index
              ],

            precipitation:
              data.hourly.precipitation[
                index
              ],

            rainProbability:
              data.hourly
                .precipitation_probability[
                index
              ] ?? 0,

            windSpeed:
              data.hourly.wind_speed_10m[
                index
              ],

            icon: info.icon,
          };
        }
      );

  const daily: DailyWeather[] =
    data.daily.time.map(
      (
        date: string,
        index: number
      ) => {
        const info =
          getWeatherInfo(
            data.daily.weather_code[
              index
            ]
          );

        return {
          date,

          day: formatDay(
            date,
            index
          ),

          high:
            data.daily
              .temperature_2m_max[
              index
            ],

          low:
            data.daily
              .temperature_2m_min[
              index
            ],

          precipitation:
            data.daily
              .precipitation_sum[
              index
            ],

          rainProbability:
            data.daily
              .precipitation_probability_max[
              index
            ] ?? 0,

          windSpeed:
            data.daily
              .wind_speed_10m_max[
              index
            ],

          sunrise:
            data.daily.sunrise[
              index
            ],

          sunset:
            data.daily.sunset[
              index
            ],

          icon: info.icon,
        };
      }
    );

  return {
    city,
    country,

    latitude,
    longitude,

    temp:
      current.temperature_2m,

    feelsLike:
      current.apparent_temperature,

    condition:
      currentInfo.condition,

    high:
      data.daily
        .temperature_2m_max[0],

    low:
      data.daily
        .temperature_2m_min[0],

    humidity:
      current.relative_humidity_2m,

    windSpeed:
      current.wind_speed_10m,

    windDirection:
      current.wind_direction_10m,

    uvIndex:
      current.uv_index ?? 0,

    visibility:
      current.visibility
        ? current.visibility / 1000
        : 0,

    pressure:
      current.surface_pressure,

    precipitation:
      current.precipitation ?? 0,

    rainProbability:
      data.daily
        .precipitation_probability_max[
        0
      ] ?? 0,

    sunrise:
      data.daily.sunrise[0],

    sunset:
      data.daily.sunset[0],

    hourly,
    daily,

    timezone:
      data.timezone,
  };
};

/* =========================================================
   REVERSE GEOCODING
========================================================= */

const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<LocationInfo> => {
  try {
    const response =
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`
      );

    if (!response.ok) {
      throw new Error(
        'Reverse geocoding failed.'
      );
    }

    const data =
      await response.json();

    const address =
      data.address || {};

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      address.county ||
      'Your Location';

    const country =
      address.country ||
      'Unknown';

    return {
      city,
      country,
      latitude,
      longitude,
    };
  } catch {
    return {
      city: 'Your Location',
      country: '',
      latitude,
      longitude,
    };
  }
};

/* =========================================================
   CITY SEARCH
========================================================= */

const searchCity = async (
  query: string
): Promise<LocationInfo[]> => {
  if (!query.trim()) {
    return [];
  }

  const response =
    await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=8&language=en&format=json`
    );

  if (!response.ok) {
    throw new Error(
      'City search failed.'
    );
  }

  const data =
    await response.json();

  return (
    data.results || []
  ).map(
    (result: any) => ({
      city: result.name,

      country:
        result.country || '',

      latitude:
        result.latitude,

      longitude:
        result.longitude,
    })
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export const WeatherApp: React.FC =
  () => {
    const [weather, setWeather] =
      useState<WeatherData | null>(
        null
      );

    const [unit, setUnit] =
      useState<Unit>('C');

    const [searchQuery, setSearchQuery] =
      useState('');

    const [
      searchResults,
      setSearchResults,
    ] = useState<LocationInfo[]>(
      []
    );

    const [loading, setLoading] =
      useState(true);

    const [
      locationLoading,
      setLocationLoading,
    ] = useState(false);

    const [
      searchLoading,
      setSearchLoading,
    ] = useState(false);

    const [error, setError] =
      useState('');

    const [
      isUsingLocation,
      setIsUsingLocation,
    ] = useState(false);

    const [
      showSearchResults,
      setShowSearchResults,
    ] = useState(false);

    const [
      lastUpdated,
      setLastUpdated,
    ] = useState<Date | null>(
      null
    );

    /* ===============================================
       LOAD WEATHER
    =============================================== */

    const loadWeather =
      useCallback(
        async (
          latitude: number,
          longitude: number,
          city: string,
          country: string
        ) => {
          try {
            setError('');

            const result =
              await fetchWeather(
                latitude,
                longitude,
                city,
                country
              );

            setWeather(result);

            setLastUpdated(
              new Date()
            );
          } catch (err) {
            console.error(err);

            setError(
              'Unable to load live weather right now. Please try again.'
            );
          } finally {
            setLoading(false);

            setLocationLoading(
              false
            );
          }
        },
        []
      );

    /* ===============================================
       MY LOCATION
    =============================================== */

    const useMyLocation =
      useCallback(() => {
        if (
          !navigator.geolocation
        ) {
          setError(
            'Geolocation is not supported by this browser.'
          );

          return;
        }

        setLocationLoading(
          true
        );

        setError('');

        navigator.geolocation.getCurrentPosition(
          async position => {
            try {
              const {
                latitude,
                longitude,
              } =
                position.coords;

              const location =
                await reverseGeocode(
                  latitude,
                  longitude
                );

              setIsUsingLocation(
                true
              );

              await loadWeather(
                location.latitude,
                location.longitude,
                location.city,
                location.country
              );
            } catch (err) {
              console.error(
                err
              );

              setError(
                'We could not determine your city. Please search manually.'
              );

              setLocationLoading(
                false
              );
            }
          },
          locationError => {
            console.error(
              locationError
            );

            setLocationLoading(
              false
            );

            if (
              locationError.code ===
              locationError.PERMISSION_DENIED
            ) {
              setError(
                'Location permission was denied. Please allow location access in your browser.'
              );
            } else {
              setError(
                'Unable to detect your location. Please try again.'
              );
            }

            setLoading(false);
          },
          {
            enableHighAccuracy:
              true,

            timeout: 15000,

            maximumAge: 300000,
          }
        );
      }, [loadWeather]);

    /* ===============================================
       INITIAL LOCATION
    =============================================== */

    useEffect(() => {
      useMyLocation();
    }, [useMyLocation]);

    /* ===============================================
       SEARCH
    =============================================== */

    useEffect(() => {
      const timer =
        setTimeout(
          async () => {
            const query =
              searchQuery.trim();

            if (
              query.length < 2
            ) {
              setSearchResults(
                []
              );

              setShowSearchResults(
                false
              );

              return;
            }

            try {
              setSearchLoading(
                true
              );

              const results =
                await searchCity(
                  query
                );

              setSearchResults(
                results
              );

              setShowSearchResults(
                true
              );
            } catch (err) {
              console.error(
                err
              );

              setSearchResults(
                []
              );
            } finally {
              setSearchLoading(
                false
              );
            }
          },
          450
        );

      return () =>
        clearTimeout(timer);
    }, [searchQuery]);

    /* ===============================================
       SELECT CITY
    =============================================== */

    const selectCity =
      async (
        location: LocationInfo
      ) => {
        setShowSearchResults(
          false
        );

        setSearchQuery('');

        setIsUsingLocation(
          false
        );

        setLoading(true);

        await loadWeather(
          location.latitude,
          location.longitude,
          location.city,
          location.country
        );
      };

    /* ===============================================
       REFRESH
    =============================================== */

    const refreshWeather =
      async () => {
        if (!weather) {
          useMyLocation();
          return;
        }

        setLoading(true);

        await loadWeather(
          weather.latitude,
          weather.longitude,
          weather.city,
          weather.country
        );
      };

    /* ===============================================
       DERIVED DATA
    =============================================== */

    const currentIcon =
      useMemo(() => {
        if (!weather) {
          return 'partly' as WeatherIconType;
        }

        return (
          weather.hourly[0]
            ?.icon ||
          'partly'
        );
      }, [weather]);

    const season =
      useMemo(() => {
        if (!weather) {
          return 'Spring' as Season;
        }

        return getSeason(
          weather.latitude
        );
      }, [weather]);

    const seasonInfo =
      getSeasonInfo(season);

    const SeasonIcon =
      seasonInfo.icon;

    const isNight =
      useMemo(() => {
        if (!weather) {
          return false;
        }

        const now =
          new Date();

        const sunrise =
          new Date(
            weather.sunrise
          );

        const sunset =
          new Date(
            weather.sunset
          );

        return (
          now < sunrise ||
          now > sunset
        );
      }, [weather]);

    const background =
      getWeatherBackground(
        currentIcon,
        season
      );

    /* ===============================================
       LOADING SCREEN
    =============================================== */

    if (
      loading &&
      !weather
    ) {
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950 text-white">
          <style>
            {WEATHER_CSS}
          </style>

          <div className="absolute inset-0">
            <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />

            <div className="absolute bottom-[10%] right-[5%] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-[30px] border border-sky-400/20 bg-sky-400/10 shadow-2xl shadow-sky-950/40">
                <CloudSun className="h-12 w-12 text-sky-400 animate-weather-icon" />
              </div>

              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900">
                <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
              </div>
            </div>

            <h2 className="mt-6 text-xl font-black">
              Reading the atmosphere
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Detecting your location and
              live weather...
            </p>
          </div>
        </div>
      );
    }

    /* ===============================================
       ERROR SCREEN
    =============================================== */

    if (
      error &&
      !weather
    ) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-slate-950 p-6 text-white">
          <div className="w-full max-w-md rounded-[30px] border border-red-400/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-black">
              Weather unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={
                useMyLocation
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-400"
            >
              <LocateFixed className="h-4 w-4" />
              Use My Location
            </button>
          </div>
        </div>
      );
    }

    if (!weather) {
      return null;
    }

    return (
      <div
        className={`
          relative flex h-full w-full flex-col
          overflow-y-auto overflow-x-hidden
          bg-gradient-to-br ${background}
          text-slate-100
          font-sans
          select-none
        `}
      >
        <style>
          {WEATHER_CSS}
        </style>

        {/* =============================================
            LIVE ATMOSPHERE
        ============================================= */}

        <WeatherAtmosphere
          weatherIcon={
            currentIcon
          }
          season={season}
          isNight={isNight}
        />

        {/* =============================================
            CONTENT
        ============================================= */}

        <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-5 lg:p-6">

          {/* =========================================
              HEADER
          ========================================= */}

          <header className="flex flex-col gap-4 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 shadow-lg shadow-sky-950/30">
                  <CloudSun className="h-5 w-5 text-sky-400" />

                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50 animate-pulse" />
                </div>

                <div>
                  <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                    Weather Forecast
                  </h1>

                  <p className="hidden text-xs text-slate-400 sm:block">
                    Live meteorological telemetry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 xl:hidden">
                <button
                  type="button"
                  onClick={
                    useMyLocation
                  }
                  disabled={
                    locationLoading
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LocateFixed className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    refreshWeather
                  }
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading
                        ? 'animate-spin'
                        : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-xl">
              <form
                onSubmit={e => {
                  e.preventDefault();

                  if (
                    searchResults.length >
                    0
                  ) {
                    selectCity(
                      searchResults[0]
                    );
                  }
                }}
              >
                <div className="group flex items-center rounded-2xl border border-white/10 bg-slate-950/60 px-3 shadow-xl backdrop-blur-xl transition focus-within:border-sky-400/40">
                  <Search className="h-4 w-4 shrink-0 text-slate-500 transition group-focus-within:text-sky-400" />

                  <input
                    value={
                      searchQuery
                    }
                    onChange={e =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Search any city..."
                    className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(
                          ''
                        );

                        setSearchResults(
                          []
                        );

                        setShowSearchResults(
                          false
                        );
                      }}
                      className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {searchLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                  )}
                </div>
              </form>

              {showSearchResults &&
                searchResults.length >
                  0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-2xl">
                    {searchResults.map(
                      (
                        result,
                        index
                      ) => (
                        <button
                          key={`${result.city}-${result.latitude}-${index}`}
                          type="button"
                          onClick={() =>
                            selectCity(
                              result
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/10"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/10">
                            <MapPin className="h-4 w-4 text-sky-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {
                                result.city
                              }
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {
                                result.country
                              }
                            </p>
                          </div>

                          <ChevronDown className="ml-auto h-4 w-4 -rotate-90 text-slate-600" />
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>

            <div className="hidden items-center gap-2 xl:flex">
              <button
                type="button"
                onClick={
                  useMyLocation
                }
                disabled={
                  locationLoading
                }
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/20 hover:bg-sky-400/10 hover:text-white"
              >
                {locationLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4" />
                )}

                My Location
              </button>

              <button
                type="button"
                onClick={
                  refreshWeather
                }
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading
                      ? 'animate-spin'
                      : ''
                  }`}
                />
              </button>
            </div>
          </header>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

              <p className="flex-1 text-xs leading-5 text-amber-100">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setError('')
                }
              >
                <X className="h-4 w-4 text-amber-400/60 hover:text-amber-300" />
              </button>
            </div>
          )}

          {/* =========================================
              LOCATION / SEASON BAR
          ========================================= */}

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/10">
                {isUsingLocation ? (
                  <Navigation className="h-4 w-4 text-sky-400" />
                ) : (
                  <MapPin className="h-4 w-4 text-sky-400" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-bold text-white">
                    {weather.city}
                  </span>

                  {isUsingLocation && (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      Live Location
                    </span>
                  )}
                </div>

                <p className="truncate text-[11px] text-slate-500">
                  {weather.country}
                  {' • '}
                  {weather.latitude.toFixed(
                    2
                  )}
                  °,{' '}
                  {weather.longitude.toFixed(
                    2
                  )}
                  °
                </p>
              </div>
            </div>

            {/* SEASON BADGE */}

            <div className="flex items-center gap-3">
              <div className="group flex items-center gap-2.5 rounded-2xl border border-white/8 bg-slate-950/40 px-3 py-2 backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
                  <SeasonIcon
                    className={`h-4 w-4 ${
                      season ===
                      'Spring'
                        ? 'text-pink-300'
                        : season ===
                          'Summer'
                        ? 'text-amber-300'
                        : season ===
                          'Autumn'
                        ? 'text-orange-300'
                        : 'text-cyan-300'
                    }`}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                    Season
                  </p>

                  <p className="text-xs font-bold text-white">
                    {season}
                  </p>
                </div>

                <div className="hidden text-[9px] text-slate-500 md:block">
                  {seasonInfo.description}
                </div>
              </div>

              <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/50 p-1">
                <button
                  type="button"
                  onClick={() =>
                    setUnit('C')
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    unit === 'C'
                      ? 'bg-white text-slate-950 shadow'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  °C
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setUnit('F')
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    unit === 'F'
                      ? 'bg-white text-slate-950 shadow'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>

          {/* =========================================
              MAIN HERO
          ========================================= */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/50 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr] lg:p-10">

              {/* HERO LEFT */}

              <div className="flex flex-col justify-center">
                <div className="mb-5 flex items-center gap-2">
                  <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400">
                    Current Conditions
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Live
                  </span>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.04] shadow-xl sm:h-36 sm:w-36">
                    <div className="absolute inset-3 rounded-[24px] bg-sky-400/5 blur-xl" />

                    <WeatherIcon
                      type={
                        currentIcon
                      }
                      className="relative h-16 w-16 text-sky-300 animate-weather-icon sm:h-20 sm:w-20"
                    />
                  </div>

                  <div>
                    <div className="flex items-start">
                      <span className="text-7xl font-black tracking-[-0.08em] text-white sm:text-8xl">
                        {formatTemperature(
                          weather.temp,
                          unit
                        )}
                      </span>

                      <span className="mt-2 text-3xl font-bold text-slate-500 sm:text-4xl">
                        °{unit}
                      </span>
                    </div>

                    <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                      {weather.condition}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Feels like{' '}
                      <span className="font-semibold text-slate-200">
                        {formatTemperature(
                          weather.feelsLike,
                          unit
                        )}
                        °{unit}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
                    <span className="text-[10px] text-slate-500">
                      HIGH
                    </span>

                    <span className="ml-2 text-xs font-bold text-white">
                      {formatTemperature(
                        weather.high,
                        unit
                      )}
                      °
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
                    <span className="text-[10px] text-slate-500">
                      LOW
                    </span>

                    <span className="ml-2 text-xs font-bold text-white">
                      {formatTemperature(
                        weather.low,
                        unit
                      )}
                      °
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
                    <span className="text-[10px] text-slate-500">
                      RAIN
                    </span>

                    <span className="ml-2 text-xs font-bold text-white">
                      {
                        weather.rainProbability
                      }
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* HERO METRICS */}

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  icon={
                    <Droplets className="h-4 w-4 text-sky-400" />
                  }
                  label="Humidity"
                  value={`${weather.humidity}%`}
                />

                <MetricCard
                  icon={
                    <Wind className="h-4 w-4 text-emerald-400" />
                  }
                  label="Wind"
                  value={`${Math.round(
                    weather.windSpeed
                  )} km/h`}
                />

                <MetricCard
                  icon={
                    <Sun className="h-4 w-4 text-amber-400" />
                  }
                  label="UV Index"
                  value={weather.uvIndex.toFixed(
                    1
                  )}
                />

                <MetricCard
                  icon={
                    <Eye className="h-4 w-4 text-purple-400" />
                  }
                  label="Visibility"
                  value={`${weather.visibility.toFixed(
                    1
                  )} km`}
                />
              </div>
            </div>
          </section>

          {/* =========================================
              SUNRISE SUNSET
          ========================================= */}

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="group flex items-center justify-between rounded-2xl border border-white/8 bg-slate-900/60 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-amber-400/20">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                  <Sunrise className="h-5 w-5 text-amber-400" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Sunrise
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {formatTime(
                      weather.sunrise
                    )}
                  </p>
                </div>
              </div>

              <Sun className="h-6 w-6 text-amber-400/30 transition group-hover:scale-125 group-hover:text-amber-400/60" />
            </div>

            <div className="group flex items-center justify-between rounded-2xl border border-white/8 bg-slate-900/60 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-400/20">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-400/10">
                  <Sunset className="h-5 w-5 text-indigo-300" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Sunset
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {formatTime(
                      weather.sunset
                    )}
                  </p>
                </div>
              </div>

              <Sunset className="h-6 w-6 text-indigo-300/30 transition group-hover:scale-125 group-hover:text-indigo-300/60" />
            </div>
          </section>

          {/* =========================================
              HOURLY
          ========================================= */}

          <section className="overflow-hidden rounded-[24px] border border-white/8 bg-slate-900/60 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10">
                  <Calendar className="h-4 w-4 text-sky-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Hourly Forecast
                  </h3>

                  <p className="text-[10px] text-slate-500">
                    Next 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto p-4">
              <div className="flex min-w-max gap-2">
                {weather.hourly.map(
                  (
                    hour,
                    index
                  ) => (
                    <div
                      key={`${hour.time}-${index}`}
                      className={`
                        group flex w-[92px]
                        flex-col items-center
                        gap-2 rounded-2xl
                        border p-3
                        transition-all duration-300
                        hover:-translate-y-1
                        ${
                          index === 0
                            ? 'border-sky-400/30 bg-sky-400/10'
                            : 'border-white/5 bg-slate-950/50 hover:border-white/10 hover:bg-white/[0.04]'
                        }
                      `}
                    >
                      <span
                        className={`text-[10px] font-semibold ${
                          index === 0
                            ? 'text-sky-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {index === 0
                          ? 'NOW'
                          : formatTime(
                              hour.time
                            )}
                      </span>

                      <WeatherIcon
                        type={
                          hour.icon
                        }
                        className="h-6 w-6 text-sky-300 transition duration-300 group-hover:scale-125"
                      />

                      <span className="text-sm font-black text-white">
                        {formatTemperature(
                          hour.temp,
                          unit
                        )}
                        °
                      </span>

                      <div className="flex items-center gap-1 text-[9px] text-sky-400">
                        <Umbrella className="h-3 w-3" />

                        {
                          hour.rainProbability
                        }
                        %
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* =========================================
              7 DAY
          ========================================= */}

          <section className="rounded-[24px] border border-white/8 bg-slate-900/60 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  7-Day Forecast
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Extended weather outlook
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/10">
                <Calendar className="h-4 w-4 text-indigo-300" />
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {weather.daily.map(
                (
                  day,
                  index
                ) => (
                  <div
                    key={
                      day.date
                    }
                    className="group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.025] sm:grid-cols-[1fr_auto_120px_100px]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                        <WeatherIcon
                          type={
                            day.icon
                          }
                          className="h-5 w-5 text-sky-300 transition group-hover:scale-125"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">
                          {
                            day.day
                          }
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {
                            day.rainProbability
                          }
                          % chance of rain
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-white">
                        {formatTemperature(
                          day.high,
                          unit
                        )}
                        °
                      </span>

                      <span className="ml-2 text-sm font-medium text-slate-600">
                        {formatTemperature(
                          day.low,
                          unit
                        )}
                        °
                      </span>
                    </div>

                    <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                      <Wind className="h-3.5 w-3.5 text-emerald-400" />

                      {Math.round(
                        day.windSpeed
                      )}{' '}
                      km/h
                    </div>

                    <div className="hidden items-center justify-end gap-2 text-xs text-sky-400 sm:flex">
                      <CloudRain className="h-3.5 w-3.5" />

                      {day.precipitation.toFixed(
                        1
                      )}{' '}
                      mm
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* =========================================
              DETAIL BENTO
          ========================================= */}

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MetricCard
              large
              icon={
                <Droplets className="h-4 w-4 text-sky-400" />
              }
              label="Humidity"
              value={`${weather.humidity}%`}
            />

            <MetricCard
              large
              icon={
                <Wind className="h-4 w-4 text-emerald-400" />
              }
              label="Wind"
              value={`${Math.round(
                weather.windSpeed
              )} km/h`}
            />

            <MetricCard
              large
              icon={
                <Compass className="h-4 w-4 text-purple-400" />
              }
              label="Direction"
              value={getWindDirection(
                weather.windDirection
              )}
            />

            <MetricCard
              large
              icon={
                <Sun className="h-4 w-4 text-amber-400" />
              }
              label="UV Index"
              value={weather.uvIndex.toFixed(
                1
              )}
            />

            <MetricCard
              large
              icon={
                <Eye className="h-4 w-4 text-indigo-400" />
              }
              label="Visibility"
              value={`${weather.visibility.toFixed(
                1
              )} km`}
            />

            <MetricCard
              large
              icon={
                <Gauge className="h-4 w-4 text-rose-400" />
              }
              label="Pressure"
              value={`${Math.round(
                weather.pressure
              )} hPa`}
            />
          </section>

          {/* =========================================
              ATMOSPHERE INFO
          ========================================= */}

          <section className="relative overflow-hidden rounded-[24px] border border-white/8 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex h-11 w-11 items-center
                    justify-center rounded-2xl
                    ${
                      season ===
                      'Spring'
                        ? 'bg-pink-400/10'
                        : season ===
                          'Summer'
                        ? 'bg-amber-400/10'
                        : season ===
                          'Autumn'
                        ? 'bg-orange-400/10'
                        : 'bg-cyan-400/10'
                    }
                  `}
                >
                  <SeasonIcon
                    className={`h-5 w-5 ${
                      season ===
                      'Spring'
                        ? 'text-pink-300'
                        : season ===
                          'Summer'
                        ? 'text-amber-300'
                        : season ===
                          'Autumn'
                        ? 'text-orange-300'
                        : 'text-cyan-300'
                    }`}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Atmospheric Scene
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-white">
                    {season}
                    {' • '}
                    {weather.condition}
                  </h3>
                </div>
              </div>

              <p className="max-w-xl text-xs leading-5 text-slate-500">
                {seasonInfo.description}
                . The scene automatically adapts
                its visual atmosphere to your
                location and current weather.
              </p>
            </div>
          </section>

          {/* =========================================
              FOOTER
          ========================================= */}

          <footer className="flex flex-col gap-2 border-t border-white/5 py-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Live weather powered by
              Open-Meteo
            </span>

            <span>
              {weather.timezone}
            </span>
          </footer>
        </div>
      </div>
    );
  };

/* =========================================================
   METRIC CARD
========================================================= */

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  large?: boolean;
}> = ({
  icon,
  label,
  value,
  large = false,
}) => {
  return (
    <div
      className={`
        group rounded-2xl
        border border-white/8
        bg-slate-900/60
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-white/15
        hover:bg-slate-900
        ${
          large
            ? 'p-4'
            : 'p-4'
        }
      `}
    >
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        <div className="transition duration-300 group-hover:scale-110">
          {icon}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   WEATHER ANIMATION CSS
========================================================= */

const WEATHER_CSS = `
/* -----------------------------------------------
   WEATHER ICON
------------------------------------------------ */

@keyframes weatherIconFloat {
  0% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-6px) rotate(2deg);
  }

  100% {
    transform: translateY(0) rotate(-2deg);
  }
}

.animate-weather-icon {
  animation:
    weatherIconFloat
    4s
    ease-in-out
    infinite;
}

/* -----------------------------------------------
   RAIN
------------------------------------------------ */

@keyframes rainFall {
  0% {
    transform:
      translate3d(0, -100px, 0)
      rotate(12deg);
  }

  100% {
    transform:
      translate3d(-35px, 110vh, 0)
      rotate(12deg);
  }
}

.animate-rain-fall {
  animation-name: rainFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* -----------------------------------------------
   SNOW
------------------------------------------------ */

@keyframes snowFall {
  0% {
    transform:
      translate3d(0, -20px, 0)
      rotate(0deg);
  }

  25% {
    transform:
      translate3d(
        calc(var(--snow-drift) * 0.4),
        25vh,
        0
      )
      rotate(90deg);
  }

  50% {
    transform:
      translate3d(
        calc(var(--snow-drift) * -0.2),
        50vh,
        0
      )
      rotate(180deg);
  }

  75% {
    transform:
      translate3d(
        calc(var(--snow-drift) * 0.5),
        75vh,
        0
      )
      rotate(270deg);
  }

  100% {
    transform:
      translate3d(
        var(--snow-drift),
        110vh,
        0
      )
      rotate(360deg);
  }
}

.animate-snow-fall {
  animation-name: snowFall;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* -----------------------------------------------
   AUTUMN LEAVES
------------------------------------------------ */

@keyframes leafFall {
  0% {
    transform:
      translate3d(0, -50px, 0)
      rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  30% {
    transform:
      translate3d(45px, 30vh, 0)
      rotate(100deg);
  }

  60% {
    transform:
      translate3d(-35px, 65vh, 0)
      rotate(210deg);
  }

  100% {
    transform:
      translate3d(70px, 110vh, 0)
      rotate(360deg);
    opacity: 0;
  }
}

.animate-leaf-fall {
  animation-name: leafFall;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* -----------------------------------------------
   SPRING PETALS
------------------------------------------------ */

@keyframes petalFall {
  0% {
    transform:
      translate3d(0, -30px, 0)
      rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 0.7;
  }

  30% {
    transform:
      translate3d(
        var(--petal-drift),
        30vh,
        0
      )
      rotate(120deg);
  }

  60% {
    transform:
      translate3d(
        calc(var(--petal-drift) * -0.6),
        65vh,
        0
      )
      rotate(220deg);
  }

  100% {
    transform:
      translate3d(
        var(--petal-drift),
        110vh,
        0
      )
      rotate(360deg);
    opacity: 0;
  }
}

.animate-petal-fall {
  animation-name: petalFall;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* -----------------------------------------------
   SUN
------------------------------------------------ */

@keyframes sunSpin {
  from {
    transform:
      rotate(0deg);
  }

  to {
    transform:
      rotate(360deg);
  }
}

.animate-sun-spin {
  animation:
    sunSpin
    30s
    linear
    infinite;
}

@keyframes sunPulse {
  0% {
    transform: scale(0.92);
    opacity: 0.45;
  }

  50% {
    transform: scale(1.08);
    opacity: 0.75;
  }

  100% {
    transform: scale(0.92);
    opacity: 0.45;
  }
}

.animate-sun-pulse {
  animation:
    sunPulse
    5s
    ease-in-out
    infinite;
}

/* -----------------------------------------------
   CLOUD
------------------------------------------------ */

@keyframes cloudDrift {
  0% {
    transform:
      translateX(0);
  }

  50% {
    transform:
      translateX(35vw);
  }

  100% {
    transform:
      translateX(110vw);
  }
}

.animate-cloud-drift {
  animation:
    cloudDrift
    35s
    linear
    infinite;
}

@keyframes cloudDriftReverse {
  0% {
    transform:
      translateX(0);
  }

  50% {
    transform:
      translateX(-35vw);
  }

  100% {
    transform:
      translateX(-110vw);
  }
}

.animate-cloud-drift-reverse {
  animation:
    cloudDriftReverse
    42s
    linear
    infinite;
}

/* -----------------------------------------------
   NIGHT STARS
------------------------------------------------ */

@keyframes starTwinkle {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(0.8);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.3);
  }
}

.animate-star-twinkle {
  animation:
    starTwinkle
    3s
    ease-in-out
    infinite;
}

/* -----------------------------------------------
   MOON
------------------------------------------------ */

@keyframes moonGlow {
  0% {
    transform: scale(0.95);
    opacity: 0.4;
  }

  50% {
    transform: scale(1.08);
    opacity: 0.7;
  }

  100% {
    transform: scale(0.95);
    opacity: 0.4;
  }
}

.animate-moon-glow {
  animation:
    moonGlow
    5s
    ease-in-out
    infinite;
}

/* -----------------------------------------------
   SPRING BLOOM
------------------------------------------------ */

@keyframes bloomGlow {
  0% {
    transform: scale(0.9);
    opacity: 0.2;
  }

  50% {
    transform: scale(1.15);
    opacity: 0.5;
  }

  100% {
    transform: scale(0.9);
    opacity: 0.2;
  }
}

.animate-bloom-glow {
  animation:
    bloomGlow
    5s
    ease-in-out
    infinite;
}

/* -----------------------------------------------
   STORM
------------------------------------------------ */

@keyframes stormDarken {
  0%,
  88%,
  100% {
    opacity: 0;
  }

  90% {
    opacity: 0.35;
  }

  91% {
    opacity: 0;
  }

  94% {
    opacity: 0.18;
  }

  95% {
    opacity: 0;
  }
}

.animate-storm-darken {
  animation:
    stormDarken
    7s
    linear
    infinite;
}

/* -----------------------------------------------
   WIND LINES
------------------------------------------------ */

@keyframes windLine {
  0% {
    transform:
      translateX(-150px);
    opacity: 0;
  }

  30% {
    opacity: 0.7;
  }

  100% {
    transform:
      translateX(110vw);
    opacity: 0;
  }
}

.animate-wind-line {
  animation:
    windLine
    8s
    linear
    infinite;
}

.animate-wind-line-2 {
  animation:
    windLine
    11s
    linear
    infinite;
    animation-delay: 2s;
}

.animate-wind-line-3 {
  animation:
    windLine
    14s
    linear
    infinite;
    animation-delay: 4s;
}

/* -----------------------------------------------
   ACCESSIBILITY
------------------------------------------------ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`;