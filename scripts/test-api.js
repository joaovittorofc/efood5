// Script para testar a API do eFood
async function testEfoodApi() {
  console.log("🚀 Iniciando teste da API eFood...")

  try {
    const apiUrl = "https://fake-api-tau.vercel.app/api/efood/restaurantes"
    console.log("📡 URL da API:", apiUrl)

    const response = await fetch(apiUrl)
    console.log("📊 Status:", response.status)
    console.log("📊 Status Text:", response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    console.log("✅ Sucesso! Dados recebidos:")
    console.log("📈 Total de restaurantes:", data.length)

    if (data.length > 0) {
      console.log("\n🏪 Primeiro restaurante:")
      console.log("- ID:", data[0].id)
      console.log("- Nome:", data[0].titulo)
      console.log("- Tipo:", data[0].tipo)
      console.log("- Avaliação:", data[0].avaliacao)
      console.log("- Destacado:", data[0].destacado)
      console.log("- Itens no cardápio:", data[0].cardapio?.length || 0)

      if (data[0].cardapio && data[0].cardapio.length > 0) {
        console.log("\n🍽️ Primeiro item do cardápio:")
        console.log("- Nome:", data[0].cardapio[0].nome)
        console.log("- Preço: R$", data[0].cardapio[0].preco)
        console.log("- Descrição:", data[0].cardapio[0].descricao)
      }
    }

    // Verificar estrutura esperada
    console.log("\n🔍 Verificando estrutura dos dados...")
    const requiredFields = ["id", "titulo", "tipo", "avaliacao", "descricao", "capa", "cardapio"]
    const firstRestaurant = data[0]

    requiredFields.forEach((field) => {
      if (firstRestaurant.hasOwnProperty(field)) {
        console.log(`✅ Campo '${field}' presente`)
      } else {
        console.log(`❌ Campo '${field}' ausente`)
      }
    })

    return data
  } catch (error) {
    console.error("❌ Erro ao testar API:", error.message)
    console.error("🔧 Stack trace:", error.stack)
    return null
  }
}

// Executar o teste
testEfoodApi()
  .then((data) => {
    if (data) {
      console.log("\n🎉 Teste concluído com sucesso!")
    } else {
      console.log("\n💥 Teste falhou!")
    }
  })
  .catch((error) => {
    console.error("💥 Erro inesperado:", error)
  })
