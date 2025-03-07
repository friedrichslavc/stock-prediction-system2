"use client"

import { ChartContainer } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModelComparisonProps {
  stockSymbol: string
  period: string
}

export default function ModelComparison({ stockSymbol, period }: ModelComparisonProps) {
  // 模拟数据 - 模型评估指标
  const accuracyData = [
    { name: "CNN模型", score: 76, fill: "#8884d8" },
    { name: "LSTM模型", score: 82, fill: "#83a6ed" },
    { name: "混合模型", score: 87, fill: "#8dd1e1" },
    { name: "Transformer模型", score: 79, fill: "#82ca9d" },
  ]

  const performanceData = [
    {
      model: "CNN模型",
      准确率: 76,
      均方误差: 65,
      方向性预测: 82,
      计算效率: 90,
      泛化能力: 72,
    },
    {
      model: "LSTM模型",
      准确率: 82,
      均方误差: 78,
      方向性预测: 85,
      计算效率: 75,
      泛化能力: 80,
    },
    {
      model: "混合模型",
      准确率: 87,
      均方误差: 85,
      方向性预测: 88,
      计算效率: 70,
      泛化能力: 85,
    },
    {
      model: "Transformer模型",
      准确率: 79,
      均方误差: 72,
      方向性预测: 80,
      计算效率: 65,
      泛化能力: 78,
    },
  ]

  return (
    <Tabs defaultValue="accuracy">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="accuracy">准确率比较</TabsTrigger>
        <TabsTrigger value="performance">性能雷达图</TabsTrigger>
      </TabsList>
      <TabsContent value="accuracy">
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: "准确率 (%)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length || !payload[0]) {
                    return null
                  }

                  return (
                    <div className="bg-background border rounded-md p-2 shadow-md">
                      <p className="text-sm">{`${payload[0].name || "N/A"}: ${payload[0].value || 0}%`}</p>
                    </div>
                  )
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Legend />
              <Bar dataKey="score" name="预测准确率">
                {accuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4">
          <h4 className="font-medium mb-2">模型比较结论</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            混合模型在{stockSymbol}的预测准确率方面表现最佳，达到了87%的准确度。
            LSTM模型次之，达到了82%。Transformer模型表现中等，而CNN模型相对较弱。 对于{period}
            周期的预测，建议优先使用混合模型和LSTM模型的结果。
          </p>
        </div>
      </TabsContent>
      <TabsContent value="performance">
        <ChartContainer className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={150} data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="model" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="准确率" dataKey="准确率" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
              <Radar name="均方误差" dataKey="均方误差" stroke="#83a6ed" fill="#83a6ed" fillOpacity={0.2} />
              <Radar name="方向性预测" dataKey="方向性预测" stroke="#8dd1e1" fill="#8dd1e1" fillOpacity={0.2} />
              <Radar name="泛化能力" dataKey="泛化能力" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
              <Legend />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) {
                    return null
                  }

                  return (
                    <div className="bg-background border rounded-md p-2 shadow-md">
                      <p className="text-sm font-medium">{payload[0]?.payload?.model || "N/A"}</p>
                      {payload.map(
                        (entry, index) =>
                          entry &&
                          entry.name &&
                          entry.value !== undefined && (
                            <p key={`item-${index}`} className="text-xs">
                              {entry.name}: {entry.value}
                            </p>
                          ),
                      )}
                    </div>
                  )
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4">
          <h4 className="font-medium mb-2">性能分析</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            雷达图展示了各个模型在不同评估指标上的表现。混合模型在准确率、均方误差和方向性预测方面表现优异，
            但在计算效率上略有不足。CNN模型虽然准确率较低，但计算效率最高，适合需要快速预测的场景。
            LSTM模型则在各方面表现均衡，是一个稳定的选择。
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

