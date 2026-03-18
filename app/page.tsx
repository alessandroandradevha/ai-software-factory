import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

function getHistory() {
  const p = join(process.cwd(), 'data', 'history.json')
  if (!existsSync(p)) return []
  return JSON.parse(readFileSync(p, 'utf-8')).reverse()
}

export default function DashboardPage() {
  const history: any[] = getHistory()
  const total = history.length
  const deployed = history.filter((h) => h.status === 'deployed').length
  const failed = total - deployed
  return (
    <main style={{background:'0a0a0a',minHeight:'100vh',color:'white',padding:'32px'}}>
      <h1>AI Software Factory</h1>
      <p style={{color:'#666'}}>Production Dashboard</p>
      <p>Total: {total} | Deployed: {deployed} | Failed: {failed}</p>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th>ID</th><th>App</th><th>Status</th><th>Score</th><th>Time</th></tr></thead>
        <tbody>
          {history.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.app_name}</td>
              <td>{e.status}</td>
              <td>{e.stages?.review?.score ?? '-'}/100</td>
              <td>{new Date(e.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
