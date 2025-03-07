"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PredictionChart from "@/components/prediction-chart"
import ModelComparison from "@/components/model-comparison"
import { AlertCircle, Zap, TrendingUp, BarChart3 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PredictionDashboard() {
  const [stockSymbol, setStockSymbol] = useState("AAPL")
  const [predictionPeriod, setPredictionPeriod] = useState("7D")
  const [selectedModel, setSelectedModel] = useState("hybrid")

  const stockList = [
    { symbol: "AAPL", name: "苹果公司" },
    { symbol: "GOOGL", name: "谷歌公司" },
    { symbol: "MSFT", name: "微软公司" },
    { symbol: "AMZN", name: "亚马逊公司" },
    { symbol: "BABA", name: "阿里巴巴" },
  ]

  const periods = [
    { value: "1D", label: "1天" },
    { value: "3D", label: "3天" },
    { value: "7D", label: "7天" },
    { value: "14D", label: "14天" },
    { value: "30D", label: "30天" },
  ]

  const models = [
    { value: "cnn", label: "CNN模型" },
    { value: "lstm", label: "LSTM模型" },
    { value: "hybrid", label: "混合模型" },
    { value: "transformer", label: "Transformer模型" },
  ]

  const getPredictionSentiment = (model: string) => {
    switch (model) {
      case "cnn":
        return { trend: "中性", confidence: 65, color: "default" }
      case "lstm":
        return { trend: "看涨", confidence: 78, color: "success" }
      case "hybrid":
        return { trend: "看涨", confidence: 85, color: "success" }
      case "transformer":
        return { trend: "看跌", confidence: 72, color: "destructive" }
      default:
        return { trend: "中性", confidence: 50, color: "default" }
    }
  }

  const sentiment = getPredictionSentiment(selectedModel)

  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4">
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

          <Select value={predictionPeriod} onValueChange={setPredictionPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="预测周期" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button size="sm">刷新预测</Button>
          <Button variant="outline" size="sm">
            导出报告
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex justify-between items-center">
              <span>
                {stockSymbol} {predictionPeriod}预测结果
              </span>
              <Badge variant={sentiment.color as "default" | "destructive" | "success"}>
                {sentiment.trend} (置信度: {sentiment.confidence}%)
              </Badge>
            </CardTitle>
            <CardDescription>
              使用{models.find((m) => m.value === selectedModel)?.label || ""}预测未来{predictionPeriod}的股价走势
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <PredictionChart stockSymbol={stockSymbol} period={predictionPeriod} model={selectedModel} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">预测模型</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {models.map((model) => (
                  <Button
                    key={model.value}
                    variant={selectedModel === model.value ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedModel(model.value)}
                  >
                    {model.value === "cnn" && <BarChart3 className="mr-2 h-4 w-4" />}
                    {model.value === "lstm" && <TrendingUp className="mr-2 h-4 w-4" />}
                    {model.value === "hybrid" && <Zap className="mr-2 h-4 w-4" />}
                    {model.value === "transformer" && <AlertCircle className="mr-2 h-4 w-4" />}
                    {model.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>预测结果仅供参考，不构成投资建议。实际投资请考虑多方面因素。</AlertDescription>
          </Alert>
        </div>
      </div>

      <Tabs defaultValue="comparison">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">模型对比</TabsTrigger>
          <TabsTrigger value="performance">历史表现</TabsTrigger>
        </TabsList>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>预测模型对比</CardTitle>
              <CardDescription>各模型预测性能和结果对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ModelComparison stockSymbol={stockSymbol} period={predictionPeriod} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>历史预测表现</CardTitle>
              <CardDescription>模型在过去一段时间的预测准确率</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="w-full h-full flex items-center justify-center text-gray-500">历史预测性能图表</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

