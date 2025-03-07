"use client"

import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, Tooltip } from "recharts"

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

interface ChartDataPoint {
  date: string
  price: number
  volume: number
}

interface StockChartProps {
  data: StockData | null
}

export default function StockChart({ data }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    if (!data?.dates || !data?.prices || !data?.volumes) {
      setChartData([])
      return
    }

    const formattedData = data.dates.map((date, index) => ({
      date,
      price: data.prices[index] || 0,
      volume: data.volumes[index] || 0,
    }))
    setChartData(formattedData)
  }, [data])

  if (!data) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">暂无数据</div>
  }

  return (
    <div className="h-full w-full">
      {chartData.length > 0 ? (
        <>
          <div className="h-[300px]">
            <ChartContainer className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                      if (!active || !payload || !payload.length || !payload[0]) {
                        return null
                      }

                      const data = payload[0].payload
                      if (!data) return null

                      return (
                        <ChartTooltip>
                          <ChartTooltipContent
                            content={
                              <div className="flex flex-col gap-2">
                                <p className="text-sm">{data.date || "N/A"}</p>
                                {payload[0].value !== undefined && payload[0].value !== null && (
                                  <p className="font-semibold">${Number(payload[0].value).toFixed(2)}</p>
                                )}
                                {data.volume !== undefined && data.volume !== null && (
                                  <p className="text-xs text-gray-500">成交量: {(data.volume / 1000000).toFixed(2)}M</p>
                                )}
                              </div>
                            }
                          />
                        </ChartTooltip>
                      )
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="currentColor"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="h-[80px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">暂无数据</div>
      )}
    </div>
  )
}

