import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// MCP 서버 설정
const server = new McpServer({
  name: "weather-server",
  version: "1.0.0"
});

// Weather Tool 등록
server.tool(
  "weatherApi",
  {
    city: z.string().describe("City name to get weather information (e.g. 'Seoul', '서울')")
  },
  async ({ city }) => {
    try {
      // Geocoding API 호출
      const geocodingUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
      geocodingUrl.searchParams.append("name", encodeURIComponent(city));
      geocodingUrl.searchParams.append("count", "1");
      geocodingUrl.searchParams.append("language", "ko");
      geocodingUrl.searchParams.append("format", "json");

      const geoResponse = await fetch(geocodingUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results?.[0]) {
        throw new Error(`도시를 찾을 수 없습니다: ${city}`);
      }

      const location = geoData.results[0];

      // Weather API 호출
      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.searchParams.append("latitude", location.latitude.toString());
      weatherUrl.searchParams.append("longitude", location.longitude.toString());
      weatherUrl.searchParams.append("current", "temperature_2m,weathercode,windspeed_10m,winddirection_10m,relative_humidity_2m");
      weatherUrl.searchParams.append("timezone", "auto");

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherData.current) {
        throw new Error('날씨 정보를 찾을 수 없습니다');
      }

      const weatherCodes: { [key: number]: string } = {
        0: "맑음", 1: "대체로 맑음", 2: "약간 흐림", 3: "흐림",
        45: "안개", 48: "짙은 안개",
        51: "가벼운 이슬비", 53: "이슬비", 55: "강한 이슬비",
        61: "약한 비", 63: "비", 65: "강한 비",
        71: "약한 눈", 73: "눈", 75: "강한 눈", 77: "싸락눈",
        80: "약한 소나기", 81: "소나기", 82: "강한 소나기",
        95: "천둥번개"
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            city: location.name || city,
            country: location.country || "알 수 없음",
            weather: {
              temperature: weatherData.current.temperature_2m,
              description: weatherCodes[weatherData.current.weathercode] || "알 수 없음",
              windSpeed: weatherData.current.windspeed_10m,
              windDirection: weatherData.current.winddirection_10m,
              humidity: weatherData.current.relative_humidity_2m,
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : '날씨 정보 조회 중 오류가 발생했습니다'}`
        }],
        isError: true
      };
    }
  }
);

// stdio 트랜스포트로 서버 시작
const transport = new StdioServerTransport();
await server.connect(transport); 