"use client"

import type React from "react"
import { useState } from "react"
import { useCreateDeposit } from "@/hooks/useDeposits"
import { usePlatforms } from "@/hooks/usePlatforms"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface CreateDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDepositDialog({ open, onOpenChange }: CreateDepositDialogProps) {
  const createDeposit = useCreateDeposit()
  const { data: platforms, isLoading: platformsLoading } = usePlatforms()
  const [formData, setFormData] = useState({
    amount: "",
    bet_app: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createDeposit.mutate(
      {
        amount: Number.parseFloat(formData.amount),
        bet_app: formData.bet_app,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({
            amount: "",
            bet_app: "",
          })
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un Dépôt</DialogTitle>
          <DialogDescription>Ajoutez un nouveau dépôt pour une plateforme</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bet_app">Plateforme *</Label>
            <Select value={formData.bet_app} onValueChange={(value) => setFormData({ ...formData, bet_app: value })}>
              <SelectTrigger id="bet_app" disabled={platformsLoading || createDeposit.isPending}>
                <SelectValue placeholder="Sélectionner une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {platforms?.results?.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant (FCFA) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="200000"
              required
              disabled={createDeposit.isPending}
              min="0"
              step="1"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createDeposit.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createDeposit.isPending || !formData.bet_app || !formData.amount}>
              {createDeposit.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer le Dépôt"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

