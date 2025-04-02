# Weather MCP Tool for Claude

한국어 지원 날씨 정보 조회 MCP(Model Context Protocol) 도구입니다. Claude AI와 함께 사용할 수 있으며, 전 세계 도시의 실시간 날씨 정보를 제공합니다.

## Features

- 도시 이름으로 날씨 정보 조회 (한국어/영어 지원)
- 실시간 기상 데이터 제공
- 상세한 날씨 정보 (기온, 날씨 상태, 풍속, 풍향, 습도)
- Claude AI와 원활한 통합

## 사용된 API

- [Open-Meteo Weather API](https://open-meteo.com/)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

## 설치 방법

```bash
# 저장소 클론
git clone https://github.com/yourusername/weather-mcp-tool.git
cd weather-mcp-tool

# 의존성 설치
npm install

# 빌드
npm run build
```

## Claude Desktop 설정

`claude_desktop_config.json` 파일에 다음 설정을 추가하세요:

```json
{
  "mcpServers": {
    "weather-server": {
      "command": "node",
      "args": ["dist/server.js"],
      "cwd": "프로젝트_경로"
    }
  }
}
```

## 사용 예시

Claude에서 다음과 같이 사용할 수 있습니다:

```typescript
const result = await weatherApi.execute({
  city: "서울"
});
```

응답 예시:
```json
{
  "city": "Seoul",
  "country": "South Korea",
  "weather": {
    "temperature": 18.5,
    "description": "맑음",
    "windSpeed": 2.3,
    "windDirection": 180,
    "humidity": 65
  }
}
```

## License

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
