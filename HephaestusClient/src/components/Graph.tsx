import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
}

function parseGraphData(raw: string) {
  const parsed: Record<string, number> = JSON.parse(raw)
  return Object.entries(parsed)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      const [year, month] = key.split("-")
      return { month: `${MONTH_LABELS[month]} ${year}`, value: parseFloat(value.toFixed(2)) }
    })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "#201810",
      border: "1px solid #3E1B12",
      borderRadius: "8px",
      padding: "10px 14px",
    }}>
      <p style={{ color: "#9a7060", fontSize: "11px", margin: "0 0 3px", fontFamily: "monospace" }}>{label}</p>
      <p style={{ color: "#F47B25", fontSize: "17px", fontWeight: 700, margin: 0, fontFamily: "monospace" }}>
        ${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default function Graph({ GraphData }: { GraphData: string }) {
  const data = parseGraphData(GraphData)
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length

  return (
    <div style={{
      background: "#1B100E",
      border: "1px solid #3E1B12",
      borderRadius: "12px",
      padding: "20px 20px 12px",
      width: "100%",
      maxWidth: "480px",
    }}>
      <p style={{ color: "#9a7060", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 2px", fontFamily: "monospace" }}>
        Spending Forecast
      </p>
      <p style={{ color: "#F47B25", fontSize: "20px", fontWeight: 700, margin: "0 0 16px", fontFamily: "monospace" }}>
        ${avg.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        <span style={{ color: "#9a7060", fontSize: "12px", fontWeight: 400, marginLeft: "6px" }}>avg / month</span>
      </p>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="hepGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F47B25" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F47B25" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a1a14" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#9a7060", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9a7060", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3E1B12", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="value" stroke="#F47B25" strokeWidth={2}
            fill="url(#hepGrad)"
            dot={{ fill: "#F47B25", r: 3, strokeWidth: 0 }}
            activeDot={{ fill: "#fff", r: 4, stroke: "#F47B25", strokeWidth: 2 }}
            isAnimationActive animationDuration={700} animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}