"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  foto: string
  preco: number
  id: number
  nome: string
  descricao: string
  porcao: string
}

interface PurchaseModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, quantity: number) => void
}

export function PurchaseModal({ item, isOpen, onClose, onAddToCart }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    observations: "",
  })

  if (!item) return null

  const totalPrice = item.preco * quantity

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePurchase = () => {
    if (!isFormValid || !item) return

    onAddToCart(item, quantity)

    // Reset form
    setQuantity(1)
    setCustomerInfo({
      name: "",
      phone: "",
      address: "",
      observations: "",
    })

    onClose()
  }

  const isFormValid = customerInfo.name && customerInfo.phone && customerInfo.address

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600">Finalizar Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <Image
              src={item.foto || "/placeholder.svg"}
              alt={item.nome}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{item.nome}</h3>
              <p className="text-gray-600 mb-2">{item.descricao}</p>
              <p className="text-sm text-gray-500 mb-2">Porção: {item.porcao}</p>
              <p className="text-2xl font-bold text-red-600">R$ {item.preco.toFixed(2)}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Quantidade</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Informações de Entrega</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo *</Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número, bairro, cidade, CEP"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={customerInfo.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Observações especiais para o pedido (opcional)"
                rows={2}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Resumo do Pedido</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  {item.nome} x {quantity}
                </span>
                <span>R$ {(item.preco * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>R$ 5,00</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-red-600">R$ {(totalPrice + 5).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handlePurchase} disabled={!isFormValid} className="flex-1 bg-red-600 hover:bg-red-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
