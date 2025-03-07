"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import StockChart from "@/components/stock-chart"
import { fetchStockData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// Define TypeScript interfaces
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

export default function StockDashboard() {
  const [stockSymbol, setStockSymbol] = useState("AAPL")
  const [timeRange, setTimeRange] = useState("1M")
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStockData(stockSymbol, timeRange)
        setStockData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "数据加载失败")
        setStockData(null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [stockSymbol, timeRange])

  const stockList = [
    { symbol: "AAPL", name: "苹果公司" },
    { symbol: "GOOGL", name: "谷歌公司" },
    { symbol: "MSFT", name: "微软公司" },
    { symbol: "AMZN", name: "亚马逊公司" },
    { symbol: "BABA", name: "阿里巴巴" },
  ]

  const timeRanges = [
    { value: "1D", label: "1天" },
    { value: "1W", label: "1周" },
    { value: "1M", label: "1月" },
    { value: "3M", label: "3月" },
    { value: "1Y", label: "1年" },
  ]

  const getStockStatus = () => {
    if (!stockData) return { color: "default", text: "数据加载中" }

    const lastPrice = stockData.prices[stockData.prices.length - 1]
    const prevPrice = stockData.prices[stockData.prices.length - 2]

    if (!lastPrice || !prevPrice) return { color: "default", text: "无数据" }

    const pctChange = ((lastPrice - prevPrice) / prevPrice) * 100

    if (pctChange > 0) {
      return { color: "success", text: `+${pctChange.toFixed(2)}%` }
    } else {
      return { color: "destructive", text: `${pctChange.toFixed(2)}%` }
    }
  }

  const status = getStockStatus()

  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Select value={stockSymbol} onValueChange={setStockSymbol}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择股票" />
          </SelectTrigger>
          <SelectContent>
            {stockList.map((stock) => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex justify-between items-center">
              <span>{stockSymbol} 股价走势</span>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge variant={status.color as "default" | "destructive" | "success"}>{status.text}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {timeRange === "1D" ? "每小时" : timeRange === "1W" ? "每天" : "每日"}股价变动
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {error ? (
              <div className="w-full h-full flex items-center justify-center text-destructive">{error}</div>
            ) : (
              <StockChart data={stockData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>交易数据</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))
            ) : error ? (
              <div className="text-destructive text-center">{error}</div>
            ) : stockData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">开盘价</span>
                  <span className="font-medium">${stockData.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">最高价</span>
                  <span className="font-medium">${stockData.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">最低价</span>
                  <span className="font-medium">${stockData.low.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">收盘价</span>
                  <span className="font-medium">${stockData.close.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">成交量</span>
                  <span className="font-medium">{(stockData.volume / 1000000).toFixed(2)}M</span>
                </div>
              </>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              查看更多详情
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

