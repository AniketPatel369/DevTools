import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { ToolPage } from '@/pages/ToolPage'

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    <Route index element={<HomePage />} />
                    <Route path="/tool/:toolId" element={<ToolPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
