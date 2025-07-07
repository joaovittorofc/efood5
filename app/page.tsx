"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ShoppingCart, Search, Filter, Heart, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import { PurchaseModal } from "./components/purchase-modal"
import { CartSidebar } from "./components/cart-sidebar"
import { RestaurantModal } from "./components/restaurant-modal"
import { useCart } from "./hooks/use-cart"
import { useToast } from "./hooks/use-toast"
import { LoadingSpinner } from "./components/loading-spinner"
import { motion, AnimatePresence } from "framer-motion"
import { ApiDebug } from "./components/api-debug"

interface Restaurant {
  id: number
  titulo: string
  destacado: boolean
  tipo: string
  avaliacao: number
  descricao: string
  capa: string
  cardapio: MenuItem[]
}

interface MenuItem {
  foto: string
  preco: number
  id: number
  nome: string
  descricao: string
  porcao: string
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("rating")

  const { items, addItem, getTotalItems, getTotalPrice } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    fetchRestaurants()
    loadFavorites()
  }, [])

  useEffect(() => {
    filterRestaurants()
  }, [restaurants, searchTerm, selectedType, sortBy])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      console.log("Fazendo requisição para:", "https://fake-api-tau.vercel.app/api/efood/restaurantes")

      const response = await fetch("https://fake-api-tau.vercel.app/api/efood/restaurantes")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Dados recebidos da API:", data)

      setRestaurants(data)

      // Simular delay para mostrar loading (remover em produção)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Erro detalhado ao carregar restaurantes:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível conectar com a API. Verificando conexão...",
        variant: "destructive",
      })

      // Fallback: tentar novamente após 2 segundos
      setTimeout(() => {
        fetchRestaurants()
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const filterRestaurants = () => {
    const filtered = restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === "all" || restaurant.tipo.toLowerCase() === selectedType.toLowerCase()
      return matchesSearch && matchesType
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.avaliacao - a.avaliacao
        case "name":
          return a.titulo.localeCompare(b.titulo)
        case "type":
          return a.tipo.localeCompare(b.tipo)
        default:
          return 0
      }
    })

    setFilteredRestaurants(filtered)
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem("efood-favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleFavorite = (restaurantId: number) => {
    const newFavorites = favorites.includes(restaurantId)
      ? favorites.filter((id) => id !== restaurantId)
      : [...favorites, restaurantId]

    setFavorites(newFavorites)
    localStorage.setItem("efood-favorites", JSON.stringify(newFavorites))

    toast({
      title: favorites.includes(restaurantId) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: favorites.includes(restaurantId)
        ? "Restaurante removido da sua lista de favoritos"
        : "Restaurante adicionado à sua lista de favoritos",
    })
  }

  const handleBuyClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsRestaurantModalOpen(true)
  }

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addItem(item, quantity)
    toast({
      title: "Item adicionado ao carrinho",
      description: `${quantity}x ${item.nome} adicionado com sucesso!`,
    })
  }

  const getUniqueTypes = () => {
    const types = restaurants.map((r) => r.tipo)
    return [...new Set(types)]
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-white p-2 rounded-full">
                <span className="text-red-600 text-2xl font-bold">🍽️</span>
              </div>
              <h1 className="text-3xl font-bold">eFood</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button
                variant="ghost"
                className="text-white hover:bg-red-500 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                Carrinho
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black">{getTotalItems()}</Badge>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Debug Component - Remover em produção */}
      {process.env.NODE_ENV === "development" && <ApiDebug />}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-5xl font-bold mb-6">Viva experiências gastronômicas</h2>
            <p className="text-xl mb-8 opacity-90">Descubra os melhores restaurantes da sua região</p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar restaurantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-gray-800"
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 text-gray-800">
                    <SelectValue placeholder="Tipo de culinária" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {getUniqueTypes().map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 text-gray-800">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Melhor avaliação</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="type">Tipo de culinária</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="h-12 bg-red-600 hover:bg-red-700">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Counter */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-gray-600">
          {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? "s" : ""} encontrado
          {filteredRestaurants.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Restaurants Grid */}
      <main className="container mx-auto px-4 pb-12">
        <AnimatePresence>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" layout>
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <div className="relative group">
                    <Image
                      src={restaurant.capa || "/placeholder.svg"}
                      alt={restaurant.titulo}
                      width={400}
                      height={250}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {restaurant.destacado && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold">
                          ⭐ Destaque
                        </Badge>
                      )}
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">{restaurant.tipo}</Badge>
                    </div>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(restaurant.id)
                      }}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.includes(restaurant.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>

                    {/* Quick View Button */}
                    <Button
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      Ver Cardápio
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{restaurant.titulo}</h3>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                        <span className="font-semibold text-green-700 text-sm">{restaurant.avaliacao}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{restaurant.descricao}</p>

                    {/* Restaurant Info */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>30-45 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>2.5 km</span>
                      </div>
                    </div>

                    {/* Featured Menu Items */}
                    {restaurant.cardapio && restaurant.cardapio.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="text-red-600">🍽️</span>
                          Pratos em Destaque
                        </h4>
                        {restaurant.cardapio.slice(0, 2).map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className="border rounded-xl p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-red-50 hover:to-orange-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={item.foto || "/placeholder.svg"}
                                alt={item.nome}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover shadow-md"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">{item.nome}</h5>
                                <p className="text-sm text-gray-600 line-clamp-1 mb-2">{item.descricao}</p>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-red-600 text-lg">R$ {item.preco.toFixed(2)}</span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleBuyClick(item)}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md"
                                  >
                                    Comprar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Nenhum restaurante encontrado</h3>
            <p className="text-gray-600 mb-6">Tente ajustar os filtros ou buscar por outro termo</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedType("all")
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Limpar Filtros
            </Button>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <PurchaseModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        onBuyClick={handleBuyClick}
      />

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
