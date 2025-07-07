"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiDebug() {
  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Testando API...")
      const response = await fetch("https://fake-api-tau.vercel.app/api/efood/restaurantes")

      console.log("📡 Status da resposta:", response.status)
      console.log("📡 Headers:", response.headers)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Dados recebidos:", data)
      console.log("📊 Número de restaurantes:", data?.length || 0)

      setApiData(data)

      // Verificar estrutura dos dados
      if (data && data.length > 0) {
        console.log("🏪 Primeiro restaurante:", data[0])
        console.log("🍽️ Cardápio do primeiro:", data[0]?.cardapio)
      }
    } catch (err) {
      console.error("❌ Erro na API:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testApi()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Debug da API
          <Button onClick={testApi} disabled={loading} size="sm">
            {loading ? "Testando..." : "Testar Novamente"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>⏳ Carregando dados da API...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-600">❌ Erro: {error}</p>
          </div>
        )}

        {apiData && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-600">✅ API funcionando!</p>
              <p className="text-sm">Restaurantes encontrados: {apiData.length}</p>
            </div>

            {apiData.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-semibold">📋 Estrutura do primeiro restaurante:</p>
                <pre className="text-xs mt-2 overflow-x-auto">{JSON.stringify(apiData[0], null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
