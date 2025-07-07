"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useCart } from "../hooks/use-cart"
import { motion, AnimatePresence } from "framer-motion"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()

  const deliveryFee = 5.0
  const totalWithDelivery = getTotalPrice() + deliveryFee

  const handleCheckout = () => {
    // Simular checkout
    alert(`Pedido finalizado!\nTotal: R$ ${totalWithDelivery.toFixed(2)}\n\nObrigado pela preferência!`)
    clearCart()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-6 w-6 text-red-600" />
            Seu Carrinho
            {items.length > 0 && (
              <Badge variant="secondary">
                {items.length} {items.length === 1 ? "item" : "itens"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Seu carrinho está vazio</h3>
                <p className="text-gray-600 mb-4">Adicione alguns pratos deliciosos!</p>
                <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 border rounded-lg mb-3 bg-gray-50"
                    >
                      <Image
                        src={item.foto || "/placeholder.svg"}
                        alt={item.nome}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.nome}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.descricao}</p>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-600">R$ {(item.preco * item.quantity).toFixed(2)}</span>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-8 text-center font-semibold">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega</span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-red-600">R$ {totalWithDelivery.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-semibold"
                  >
                    Finalizar Pedido
                  </Button>

                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
