"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownToLine, Printer, Share2 } from "lucide-react"

export default function AnalysisReport() {
  const [stockSymbol, setStockSymbol] = useState("AAPL")
  const [reportType, setReportType] = useState("daily")

  const stockList = [
    { symbol: "AAPL", name: "苹果公司" },
    { symbol: "GOOGL", name: "谷歌公司" },
    { symbol: "MSFT", name: "微软公司" },
    { symbol: "AMZN", name: "亚马逊公司" },
    { symbol: "BABA", name: "阿里巴巴" },
  ]

  const reportTypes = [
    { value: "daily", label: "每日分析" },
    { value: "weekly", label: "周度报告" },
    { value: "monthly", label: "月度总结" },
    { value: "quarterly", label: "季度分析" },
  ]

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

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="报告类型" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="gap-1">
            <ArrowDownToLine className="h-4 w-4" />
            下载
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            打印
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            分享
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            {stockSymbol} {reportTypes.find((t) => t.value === reportType)?.label || ""}
          </CardTitle>
          <CardDescription>生成日期: {new Date().toLocaleDateString("zh-CN")} | 分析师: AI模型</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">市场概况</TabsTrigger>
              <TabsTrigger value="technical">技术分析</TabsTrigger>
              <TabsTrigger value="fundamental">基本面分析</TabsTrigger>
              <TabsTrigger value="sentiment">情感分析</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">市场概况</h3>
              <p>
                {stockSymbol}在过去的交易日表现
                {reportType === "daily" ? "稳定" : reportType === "weekly" ? "良好" : "强劲"}。 市场整体处于上升趋势，
                {stockSymbol}的股价波动受到了行业内新产品发布的积极影响。 与竞争对手相比，{stockSymbol}
                在市场份额方面保持领先地位，其创新能力和品牌影响力继续为股价提供支撑。
              </p>

              <h4 className="text-md font-semibold mt-4">主要指标</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  市场表现评级: <span className="font-medium">优秀</span>
                </li>
                <li>
                  行业排名: <span className="font-medium">前5位</span>
                </li>
                <li>
                  市场关注度: <span className="font-medium">高</span>
                </li>
                <li>
                  交易量变化: <span className="font-medium">+12.5%</span>
                </li>
              </ul>

              <h4 className="text-md font-semibold mt-4">关键事件影响</h4>
              <p>
                近期{stockSymbol}发布的季度财报超出市场预期，净利润同比增长15%。
                此外，公司宣布的新产品线计划和市场扩张战略获得了投资者的积极响应。
                行业内的整合和收购活动也为该股提供了额外的上涨动力。
              </p>
            </TabsContent>
            <TabsContent value="technical" className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">技术分析</h3>
              <p>
                从技术指标来看，{stockSymbol}目前处于上升通道中。
                短期移动平均线(MA20)位于长期移动平均线(MA50)上方，形成黄金交叉，这通常被视为看涨信号。
                相对强弱指标(RSI)目前为65，处于中性偏强势区域，表明股价上涨动能仍然存在，但需警惕可能的超买风险。
              </p>

              <h4 className="text-md font-semibold mt-4">支撑与阻力位</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  主要支撑位: <span className="font-medium">$152.50</span>
                </li>
                <li>
                  次要支撑位: <span className="font-medium">$148.75</span>
                </li>
                <li>
                  主要阻力位: <span className="font-medium">$165.30</span>
                </li>
                <li>
                  次要阻力位: <span className="font-medium">$172.80</span>
                </li>
              </ul>

              <h4 className="text-md font-semibold mt-4">技术指标概览</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      MACD: <span className="font-medium text-green-600">看涨</span>
                    </li>
                    <li>
                      RSI(14): <span className="font-medium">65 (中性偏强)</span>
                    </li>
                    <li>
                      布林带: <span className="font-medium">上轨突破</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      KDJ: <span className="font-medium text-green-600">看涨</span>
                    </li>
                    <li>
                      随机指标: <span className="font-medium">78 (偏强)</span>
                    </li>
                    <li>
                      成交量分析: <span className="font-medium">放量上涨</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="fundamental" className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">基本面分析</h3>
              <p>
                {stockSymbol}的基本面保持稳健，公司最新季度收入为956亿美元，同比增长8.5%。
                毛利率维持在42.3%的水平，略高于行业平均水平。研发投入占收入的比例为15.2%，
                显示出公司对未来技术创新的持续承诺。
              </p>

              <h4 className="text-md font-semibold mt-4">关键财务指标</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      市盈率(P/E): <span className="font-medium">24.8</span>
                    </li>
                    <li>
                      市净率(P/B): <span className="font-medium">15.3</span>
                    </li>
                    <li>
                      每股收益(EPS): <span className="font-medium">$6.32</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      股息率: <span className="font-medium">0.65%</span>
                    </li>
                    <li>
                      净利润率: <span className="font-medium">25.2%</span>
                    </li>
                    <li>
                      负债股本比: <span className="font-medium">1.2</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md font-semibold mt-4">行业比较</h4>
              <p>
                相比行业内其他公司，{stockSymbol}在收入增长方面处于领先地位。
                公司的毛利率高于行业平均水平5个百分点，显示出较强的定价能力。
                市场份额稳步提升，预计未来几个季度将继续保持增长势头。
              </p>
            </TabsContent>
            <TabsContent value="sentiment" className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">市场情感分析</h3>
              <p>
                基于对社交媒体、新闻报道和分析师评论的NLP分析，当前市场对{stockSymbol}的整体情感倾向为积极。
                过去30天内，正面情感占比达到68%，较上月提升7个百分点。
                分析师的目标价平均上调了5.3%，机构投资者的持仓比例同步增加。
              </p>

              <h4 className="text-md font-semibold mt-4">情感指标</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      社交媒体情感: <span className="font-medium text-green-600">积极 (76%)</span>
                    </li>
                    <li>
                      新闻报道倾向: <span className="font-medium text-green-600">积极 (65%)</span>
                    </li>
                    <li>
                      Reddit讨论热度: <span className="font-medium">增加12%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      分析师评级: <span className="font-medium">买入 (18/25)</span>
                    </li>
                    <li>
                      目标价变化: <span className="font-medium text-green-600">+5.3%</span>
                    </li>
                    <li>
                      机构持仓变化: <span className="font-medium text-green-600">+2.1%</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h4 className="text-md font-semibold mt-4">热门话题分析</h4>
              <p>
                大数据分析显示，与{stockSymbol}相关的热门讨论主题包括：新产品发布会（32%）、
                季度财报表现（28%）、市场扩张战略（15%）、竞争对手动态（14%）和可持续发展计划（11%）。
                这些讨论主题的情感倾向总体积极，特别是关于新产品发布的预期非常高。
              </p>

              <h4 className="text-md font-semibold mt-4">趋势预测</h4>
              <p>
                基于情感分析和历史相关性研究，预计{stockSymbol}在短期内将继续获得市场的积极关注，
                这可能会对股价形成支撑。然而，需要注意的是，极高的市场预期也可能增加未来业绩不及预期的风险。
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-gray-500">免责声明：本报告由AI系统自动生成，仅供参考，不构成投资建议。</p>
          <Button variant="outline" size="sm">
            完整报告
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

