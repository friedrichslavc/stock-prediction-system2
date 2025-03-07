import StockDashboard from "@/components/stock-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PredictionDashboard from "@/components/prediction-dashboard"
import AnalysisReport from "@/components/analysis-report"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">股票预测系统</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">基于CNN-LSTM混合模型的智能股票分析与预测平台</p>
        </div>

        <Tabs defaultValue="stock" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock">股票趋势</TabsTrigger>
            <TabsTrigger value="prediction">预测结果</TabsTrigger>
            <TabsTrigger value="analysis">分析报告</TabsTrigger>
          </TabsList>
          <TabsContent value="stock">
            <StockDashboard />
          </TabsContent>
          <TabsContent value="prediction">
            <PredictionDashboard />
          </TabsContent>
          <TabsContent value="analysis">
            <AnalysisReport />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

