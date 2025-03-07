// 模拟的API请求函数

// 类型定义
interface StockData {
  symbol: string
  timeRange: string
  dates: string[]
  prices: number[]
  volumes: number[]
  open: number
  close: number
  high: number
  low: number
  volume: number
}

interface PredictionDataPoint {
  date: string
  price: number | null
  predicted: number | null
  upper: number | null
  lower: number | null
  confidence: number | null
  isPrediction: boolean
}

// 生成随机数据
function generateRandomData(base: number, range: number, count: number): number[] {
  let lastValue = base
  return Array(count)
    .fill(0)
    .map(() => {
      const change = (Math.random() - 0.5) * range
      lastValue += change
      return Number.parseFloat(lastValue.toFixed(2))
    })
}

// 生成日期数组
function generateDates(count: number, startDate?: Date): string[] {
  const start = startDate || new Date()
  return Array(count)
    .fill(0)
    .map((_, i) => {
      const date = new Date(start)
      date.setDate(date.getDate() - (count - i - 1))
      return date.toISOString().split("T")[0]
    })
}

// 模拟获取股票历史数据
export async function fetchStockData(symbol: string, timeRange: string): Promise<StockData> {
  if (!symbol || !timeRange) {
    throw new Error("Symbol and timeRange are required")
  }

  try {
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 根据时间范围确定数据点数量
    let dataPoints = 30
    switch (timeRange) {
      case "1D":
        dataPoints = 24
        break
      case "1W":
        dataPoints = 7
        break
      case "1M":
        dataPoints = 30
        break
      case "3M":
        dataPoints = 90
        break
      case "1Y":
        dataPoints = 250
        break
    }

    // 根据股票代码生成不同的基准价格
    let basePrice = 0
    let volatility = 0

    switch (symbol) {
      case "AAPL":
        basePrice = 175.5
        volatility = 3
        break
      case "GOOGL":
        basePrice = 135.2
        volatility = 4
        break
      case "MSFT":
        basePrice = 330.8
        volatility = 5
        break
      case "AMZN":
        basePrice = 127.9
        volatility = 3.5
        break
      case "BABA":
        basePrice = 85.4
        volatility = 2.5
        break
      default:
        basePrice = 100
        volatility = 2
    }

    // 生成价格数据
    const prices = generateRandomData(basePrice, volatility, dataPoints)

    // 生成成交量数据 (百万股)
    const volumes = generateRandomData(10, 5, dataPoints).map((v) => v * 1000000)

    // 生成日期数据
    const dates = generateDates(dataPoints)

    return {
      symbol,
      timeRange,
      dates,
      prices,
      volumes,
      open: prices[0] || 0,
      close: prices[prices.length - 1] || 0,
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: volumes.reduce((sum, v) => sum + v, 0) / volumes.length,
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw new Error(`Failed to fetch stock data: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// 模拟获取预测数据
export async function getPredictionData(symbol: string, period: string, model: string): Promise<PredictionDataPoint[]> {
  if (!symbol || !period || !model) {
    throw new Error("Symbol, period, and model are required")
  }

  try {
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 首先获取历史数据
    const historicalData = await fetchStockData(symbol, "1M")

    // 预测天数
    let futureDays = 7
    switch (period) {
      case "1D":
        futureDays = 1
        break
      case "3D":
        futureDays = 3
        break
      case "7D":
        futureDays = 7
        break
      case "14D":
        futureDays = 14
        break
      case "30D":
        futureDays = 30
        break
    }

    // 模型准确度调整因子
    let accuracyFactor = 1.0
    let volatilityFactor = 1.0

    switch (model) {
      case "cnn":
        accuracyFactor = 0.8
        volatilityFactor = 1.2
        break
      case "lstm":
        accuracyFactor = 0.9
        volatilityFactor = 1.0
        break
      case "hybrid":
        accuracyFactor = 0.95
        volatilityFactor = 0.9
        break
      case "transformer":
        accuracyFactor = 0.85
        volatilityFactor = 1.1
        break
    }

    // 获取历史数据的最后20天
    const recentPrices = historicalData.prices.slice(-20)
    const lastPrice = recentPrices[recentPrices.length - 1] || 0

    // 计算历史波动率
    const volatility =
      (recentPrices.reduce((sum, price, i, arr) => {
        if (i === 0) return sum
        const prevPrice = arr[i - 1] || 0
        return sum + Math.abs(price - prevPrice) / prevPrice
      }, 0) /
        (recentPrices.length - 1)) *
      100 *
      volatilityFactor

    // 生成未来日期
    const lastDate = new Date(historicalData.dates[historicalData.dates.length - 1])
    const futureDates = generateDates(futureDays, new Date(lastDate.getTime() + 86400000))

    // 根据模型生成预测趋势
    let trend = 0
    switch (model) {
      case "cnn":
        trend = 0
        break // 中性
      case "lstm":
        trend = 0.002
        break // 略微上涨
      case "hybrid":
        trend = 0.003
        break // 上涨
      case "transformer":
        trend = -0.001
        break // 略微下跌
    }

    // 生成预测数据
    const predictions: PredictionDataPoint[] = []
    let curPrice = lastPrice

    // 添加最后20天的历史数据
    for (let i = 0; i < 20; i++) {
      const histIndex = historicalData.prices.length - 20 + i
      if (histIndex >= 0 && histIndex < historicalData.prices.length) {
        predictions.push({
          date: historicalData.dates[histIndex],
          price: historicalData.prices[histIndex],
          predicted: null,
          upper: null,
          lower: null,
          confidence: null,
          isPrediction: false,
        })
      }
    }

    // 添加预测数据
    for (let i = 0; i < futureDays; i++) {
      // 每天的随机波动
      const randomChange = (((Math.random() - 0.5) * volatility) / 100) * curPrice
      // 趋势影响
      const trendChange = trend * curPrice
      // 总变化
      const totalChange = (randomChange + trendChange) * accuracyFactor

      curPrice += totalChange
      curPrice = Number.parseFloat(curPrice.toFixed(2))

      // 置信区间
      const confidence = 90 - i * (10 / futureDays) // 随着时间推移，置信度降低
      const interval = ((volatility / 100) * curPrice * (1 - accuracyFactor) * (i + 1)) / 2

      predictions.push({
        date: futureDates[i],
        price: null,
        predicted: curPrice,
        upper: Number.parseFloat((curPrice + interval).toFixed(2)),
        lower: Number.parseFloat((curPrice - interval).toFixed(2)),
        confidence: Number.parseInt(confidence.toFixed(0)),
        isPrediction: true,
      })
    }

    return predictions
  } catch (error) {
    console.error("Error getting prediction data:", error)
    throw new Error(`Failed to get prediction data: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

