"use client"

import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Area, ComposedChart } from "recharts"
import { getPredictionData } from "@/lib/api"

interface PredictionChartProps {
  stockSymbol: string
  period: string
  model: string
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

export default function PredictionChart({ stockSymbol, period, model }: PredictionChartProps) {
  const [chartData, setChartData] = useState<PredictionDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getPredictionData(stockSymbol, period, model)
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format")
        }
        setChartData(data)
      } catch (err) {
        console.error("Error loading prediction data:", err)
        setError(err instanceof Error ? err.message : "加载预测数据失败")
        setChartData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [stockSymbol, period, model])

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">预测数据加载中...</div>
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center text-destructive">{error}</div>
  }

  if (chartData.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">暂无预测数据</div>
  }

  // Create a safe version of the data for the chart
  const safeChartData = chartData.map((item) => ({
    date: item.date || "",
    price: item.price || null,
    predicted: item.predicted || null,
    upper: item.upper || null,
    lower: item.lower || null,
    confidence: item.confidence || null,
    isPrediction: !!item.isPrediction,
  }))

  return (
    <div className="h-full w-full">
      {chartData.length > 0 ? (
        <ChartContainer className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={safeChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (!value) return ""
                  try {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  } catch (e) {
                    return value
                  }
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                width={60}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length || !payload[0] || !payload[0].payload) {
                    return null
                  }

                  const data = payload[0].payload
                  const isPrediction = !!data.isPrediction

                  return (
                    <ChartTooltip>
                      <ChartTooltipContent
                        content={
                          <div className="flex flex-col gap-2">
                            <p className="text-sm">{data.date || "N/A"}</p>
                            {data.price !== null && data.price !== undefined && (
                              <p className="font-semibold">${Number(data.price).toFixed(2)}</p>
                            )}
                            {isPrediction && data.predicted !== null && data.predicted !== undefined && (
                              <p className="font-semibold">预测: ${Number(data.predicted).toFixed(2)}</p>
                            )}
                            {isPrediction && data.upper !== null && data.upper !== undefined && (
                              <p className="text-xs text-gray-500">预测上限: ${Number(data.upper).toFixed(2)}</p>
                            )}
                            {isPrediction && data.lower !== null && data.lower !== undefined && (
                              <p className="text-xs text-gray-500">预测下限: ${Number(data.lower).toFixed(2)}</p>
                            )}
                            {isPrediction && data.confidence !== null && data.confidence !== undefined && (
                              <p className="text-xs font-medium mt-1">置信区间: {data.confidence}%</p>
                            )}
                          </div>
                        }
                      />
                    </ChartTooltip>
                  )
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                name="置信区间上限"
                stroke="transparent"
                fill="#8884d8"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lower"
                name="置信区间下限"
                stroke="transparent"
                fill="#8884d8"
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="price"
                name="实际价格"
                stroke="#1f77b4"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="预测价格"
                stroke="#ff7300"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, strokeWidth: 1 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">暂无预测数据</div>
      )}
    </div>
  )
}

