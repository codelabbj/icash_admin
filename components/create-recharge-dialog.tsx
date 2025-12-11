"use client"

import type React from "react"

import { useState } from "react"
import { useCreateRecharge, type CreateRechargeInput } from "@/hooks/useRecharges"

type RechargeFormData = {
    amount: string
    payment_method: string
    payment_reference: string
    notes: string
    payment_proof: File | undefined
}
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"

interface CreateRechargeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateRechargeDialog({ open, onOpenChange }: CreateRechargeDialogProps) {
    const createRecharge = useCreateRecharge()

    const [formData, setFormData] = useState<RechargeFormData>({
        amount: "",
        payment_method: "",
        payment_reference: "",
        notes: "",
        payment_proof: undefined,
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, payment_proof: file })
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setFormData({ ...formData, payment_proof: undefined })
        setImagePreview(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createRecharge.mutate(formData, {
                onSuccess: () => {
                    onOpenChange(false)
                    setFormData({
                        amount: "",
                        payment_method: "",
                        payment_reference: "",
                        notes: "",
                        payment_proof: undefined,
                    })
                    setImagePreview(null)
                },
        })
    }

    const resetForm = () => {
        setFormData({
            amount: "",
            payment_method: "",
            payment_reference: "",
            notes: "",
            payment_proof: undefined,
        })
        setImagePreview(null)
    }

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen)
        if (!newOpen) {
            resetForm()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Créer une Recharge</DialogTitle>
                    <DialogDescription>
                        Soumettre une demande de recharge avec preuve de paiement
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="amount">Montant (FCFA) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="50000"
                            required
                            disabled={createRecharge.isPending}
                            min="1"
                            step="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment_method">Méthode de Paiement *</Label>
                        <Select
                            value={formData.payment_method}
                            onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                            disabled={createRecharge.isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                {/* <SelectItem value="crypto">Cryptomonnaie</SelectItem> */}
                                <SelectItem value="card">Carte de crédit</SelectItem>
                                <SelectItem value="cash">Espèces</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment_reference">Référence de Paiement *</Label>
                        <Input
                            id="payment_reference"
                            value={formData.payment_reference}
                            onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                            placeholder="Entrez la référence de votre paiement"
                            required
                            disabled={createRecharge.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Informations supplémentaires sur votre paiement"
                            disabled={createRecharge.isPending}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="proof_image">Image de Preuve (optionnel)</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu de la preuve"
                                        className="max-w-full h-auto max-h-48 rounded-lg mx-auto"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                        disabled={createRecharge.isPending}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Cliquez pour sélectionner une image ou glissez-déposez
                                    </div>
                                    <Input
                                        id="proof_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={createRecharge.isPending}
                                        className="max-w-xs mx-auto"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={createRecharge.isPending}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={createRecharge.isPending}>
                            {createRecharge.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer la Recharge"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
