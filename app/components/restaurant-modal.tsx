"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

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

interface RestaurantModalProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
  onBuyClick: (item: MenuItem) => void
}

export function RestaurantModal({ restaurant, isOpen, onClose, onBuyClick }: RestaurantModalProps) {
  if (!restaurant) return null

  const groupedMenu = restaurant.cardapio.reduce(
    (acc, item) => {
      const category = "Pratos Principais" // Simplificado - poderia vir da API
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header Image */}
        <div className="relative h-64">
          <Image src={restaurant.capa || "/placeholder.svg"} alt={restaurant.titulo} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40" />

          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{restaurant.titulo}</h1>
                <p className="text-lg opacity-90 mb-3">{restaurant.descricao}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-white" />
                    <span className="font-semibold">{restaurant.avaliacao}</span>
                  </div>

                  <Badge className="bg-blue-600">{restaurant.tipo}</Badge>

                  {restaurant.destacado && <Badge className="bg-yellow-500 text-black">⭐ Destaque</Badge>}
                </div>
              </div>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:bg-opacity-20">
                <Heart className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Restaurant Details */}
          <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Entrega: 30-45 min</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Taxa: R$ 5,00</span>
            </div>
          </div>

          {/* Menu */}
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="menu">Cardápio</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-6">
              <div className="max-h-96 overflow-y-auto">
                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">{category}</h3>
                    <div className="grid gap-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-all"
                        >
                          <Image
                            src={item.foto || "/placeholder.svg"}
                            alt={item.nome}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{item.nome}</h4>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.descricao}</p>
                            <p className="text-xs text-gray-500 mb-3">Porção: {item.porcao}</p>

                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-red-600">R$ {item.preco.toFixed(2)}</span>
                              <Button onClick={() => onBuyClick(item)} className="bg-red-600 hover:bg-red-700">
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Sobre o Restaurante</h3>
                  <p className="text-gray-600">{restaurant.descricao}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Horário de Funcionamento</h3>
                  <p className="text-gray-600">Segunda a Domingo: 11:00 - 23:00</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Formas de Pagamento</h3>
                  <p className="text-gray-600">Cartão de Crédito, Débito, PIX, Dinheiro</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">⭐</div>
                  <h3 className="text-xl font-bold mb-2">{restaurant.avaliacao}/5</h3>
                  <p className="text-gray-600">Baseado em 127 avaliações</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
