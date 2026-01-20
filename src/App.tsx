import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/routes/index'
import { HistoryPage } from '@/routes/history'
import { StatsPage } from '@/routes/stats'
import { TagsPage } from '@/routes/tags'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/tags" element={<TagsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
