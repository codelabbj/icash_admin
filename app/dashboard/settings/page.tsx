"use client"

import { useState } from "react"
import {useSettings, useUpdateSettings} from "@/hooks/useSettings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Loader2, Edit2 } from "lucide-react"
import {CopyButton} from "@/components/copy-button";

export default function SettingsPage() {
    const { data: settings, isLoading } = useSettings()
    const updateSettings = useUpdateSettings()
    const [openDialog, setOpenDialog] = useState<string | null>(null)
    const [editData, setEditData] = useState<Record<string, any>>({})

    const handleEditClick = (section: string) => {
        if (!settings) return

        if (section === "transactions") {
            setEditData({
                minimum_deposit: settings.minimum_deposit,
                minimum_withdrawal: settings.minimum_withdrawal,
                reward_mini_withdrawal: settings.reward_mini_withdrawal,
                minimum_solde: settings.minimum_solde,
            })
        } else if (section === "rewards") {
            setEditData({
                bonus_percent: settings.bonus_percent,
                deposit_reward_percent: settings.deposit_reward_percent,
                referral_bonus: settings.referral_bonus,
                deposit_reward: settings.deposit_reward,
            })
        } else if (section === "version") {
            setEditData({
                min_version: settings.min_version,
                last_version: settings.last_version,
                dowload_apk_link: settings.dowload_apk_link,
            })
        } else if (section === "contact") {
            setEditData({
                whatsapp_phone: settings.whatsapp_phone,
                wave_default_link: settings.wave_default_link,
                orange_default_link: settings.orange_default_link,
                mtn_default_link: settings.mtn_default_link,
            })
        }
        setOpenDialog(section)
    }

    const handleSave = async () => {
        try {
            await updateSettings.mutateAsync(editData)
            setOpenDialog(null)
        } catch (error) {
            console.error("Error updating settings:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Paramètres</h2>
                <p className="text-muted-foreground">Consultez et mettez à jour les paramètres de configuration de la plateforme</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : settings ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle>Limites de Transaction</CardTitle>
                                <CardDescription>Montants minimum et maximum des transactions</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick("transactions")}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Dépôt Minimum</span>
                                    <Badge variant="outline">{settings.minimum_deposit} FCFA</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Montant minimum requis pour effectuer un dépôt</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Retrait Minimum</span>
                                    <Badge variant="outline">{settings.minimum_withdrawal} FCFA</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Montant minimum pour demander un retrait</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Retrait Minimum Récompense</span>
                                    <Badge variant="outline">{settings.reward_mini_withdrawal} FCFA</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Montant minimum pour retirer les récompenses gagnées</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Solde Minimum</span>
                                    <Badge variant="outline">{`${settings.minimum_solde} FCFA` || "N/A"} </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Solde minimum utilisateur, en dessous de ce solde l'utilisateur reçoit des alertes pour recharger son compte</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle>Récompenses & Bonus</CardTitle>
                                <CardDescription>Configuration des bonus et récompenses</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick("rewards")}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Pourcentage de Bonus</span>
                                    <Badge variant="outline">{settings.bonus_percent}%</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Pourcentage appliqué aux bonus utilisateurs</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Pourcentage de Récompense de Dépôt</span>
                                    <Badge variant="outline">{settings.deposit_reward_percent}%</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Pourcentage de récompense offert sur chaque dépôt</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Bonus de Parrainage</span>
                                    <Badge variant={settings.referral_bonus ? "default" : "secondary"}>
                                        {settings.referral_bonus ? "Activé" : "Désactivé"}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Activez le bonus de parrainage pour les utilisateurs</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Récompense de Dépôt</span>
                                    <Badge variant={settings.deposit_reward ? "default" : "secondary"}>
                                        {settings.deposit_reward ? "Activé" : "Désactivé"}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Offrir une récompense automatique lors d'un dépôt</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle>Version de l'App</CardTitle>
                                <CardDescription>Informations sur la version de l'application mobile</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick("version")}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Version Minimale</span>
                                    <Badge variant="outline">{settings.min_version || "N/A"}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Version minimale requise pour accéder à l'app</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Dernière Version</span>
                                    <Badge variant="outline">{settings.last_version || "N/A"}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Version stable actuelle recommandée</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Lien de Téléchargement</span>
                                    {settings.dowload_apk_link ? (
                                        <a
                                            href={settings.dowload_apk_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Voir le Lien
                                        </a>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">N/A</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Lien direct pour télécharger le APK</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle>Contact & Liens</CardTitle>
                                <CardDescription>Support et liens de paiement</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick("contact")}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Téléphone WhatsApp</span>
                                    <Badge variant="outline">{settings.whatsapp_phone || "N/A"}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Numéro de support WhatsApp pour les utilisateurs</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Lien Wave</span>
                                    {settings.wave_default_link ? (
                                        <div className="flex gap-2">
                                            <a
                                                href={settings.wave_default_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Voir
                                            </a>
                                            <CopyButton value={settings.wave_default_link}/>
                                        </div>

                                    ) : (
                                        <span className="text-sm text-muted-foreground">N/A</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Lien de paiement Wave pour les transactions</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Lien Orange</span>
                                    {settings.orange_default_link ? (
                                        <div className="flex gap-2">
                                            <a
                                                href={settings.orange_default_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Voir
                                            </a>
                                            <CopyButton value={settings.orange_default_link}/>
                                        </div>

                                    ) : (
                                        <span className="text-sm text-muted-foreground">N/A</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Lien de paiement Orange Money</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Lien MTN</span>
                                    {settings.mtn_default_link ? (
                                        <div className="flex gap-2">
                                            <a
                                                href={settings.mtn_default_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Voir
                                            </a>
                                            <CopyButton value={settings.mtn_default_link}/>
                                        </div>

                                    ) : (
                                        <span className="text-sm text-muted-foreground">N/A</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Lien de paiement MTN Mobile Money</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">Aucun paramètre trouvé</div>
            )}

            {/* Edit Dialogs */}
            {/* Transaction Limits Dialog */}
            <Dialog open={openDialog === "transactions"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Éditer Limites de Transaction</DialogTitle>
                        <DialogDescription>Mettez à jour les montants minimum pour les transactions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="minimum_deposit">Dépôt Minimum (FCFA)</Label>
                            <Input
                                id="minimum_deposit"
                                type="number"
                                value={editData.minimum_deposit || ""}
                                onChange={(e) => setEditData({ ...editData, minimum_deposit: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minimum_withdrawal">Retrait Minimum (FCFA)</Label>
                            <Input
                                id="minimum_withdrawal"
                                type="number"
                                value={editData.minimum_withdrawal || ""}
                                onChange={(e) => setEditData({ ...editData, minimum_withdrawal: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reward_mini_withdrawal">Retrait Minimum Récompense (FCFA)</Label>
                            <Input
                                id="reward_mini_withdrawal"
                                type="number"
                                value={editData.reward_mini_withdrawal || ""}
                                onChange={(e) => setEditData({ ...editData, reward_mini_withdrawal: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minimum_solde">Solde Minimum (FCFA)</Label>
                            <Input
                                id="minimum_solde"
                                type="number"
                                value={editData.minimum_solde || ""}
                                onChange={(e) => setEditData({ ...editData, minimum_solde: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(null)}
                            className="hover:bg-primary/10"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={updateSettings.isPending}
                        >
                            {updateSettings.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                "Sauvegarder"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rewards & Bonus Dialog */}
            <Dialog open={openDialog === "rewards"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Éditer Récompenses & Bonus</DialogTitle>
                        <DialogDescription>Mettez à jour la configuration des bonus et récompenses</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bonus_percent">Pourcentage de Bonus (%)</Label>
                            <Input
                                id="bonus_percent"
                                type="number"
                                step="0.01"
                                value={editData.bonus_percent || ""}
                                onChange={(e) => setEditData({ ...editData, bonus_percent: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deposit_reward_percent">Pourcentage de Récompense de Dépôt (%)</Label>
                            <Input
                                id="deposit_reward_percent"
                                type="number"
                                step="0.01"
                                value={editData.deposit_reward_percent || ""}
                                onChange={(e) => setEditData({ ...editData, deposit_reward_percent: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="referral_bonus">Bonus de Parrainage</Label>
                            <Switch
                                id="referral_bonus"
                                checked={editData.referral_bonus || false}
                                onCheckedChange={(checked) => setEditData({ ...editData, referral_bonus: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="deposit_reward">Récompense de Dépôt</Label>
                            <Switch
                                id="deposit_reward"
                                checked={editData.deposit_reward || false}
                                onCheckedChange={(checked) => setEditData({ ...editData, deposit_reward: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(null)}
                            className="hover:bg-primary/10"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={updateSettings.isPending}
                        >
                            {updateSettings.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                "Sauvegarder"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Version Dialog */}
            <Dialog open={openDialog === "version"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Éditer Version de l'App</DialogTitle>
                        <DialogDescription>Mettez à jour les informations de version et de téléchargement</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="min_version">Version Minimale</Label>
                            <Input
                                id="min_version"
                                type="text"
                                value={editData.min_version || ""}
                                onChange={(e) => setEditData({ ...editData, min_version: e.target.value })}
                                placeholder="ex: 1.0.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_version">Dernière Version</Label>
                            <Input
                                id="last_version"
                                type="text"
                                value={editData.last_version || ""}
                                onChange={(e) => setEditData({ ...editData, last_version: e.target.value })}
                                placeholder="ex: 1.5.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dowload_apk_link">Lien de Téléchargement</Label>
                            <Input
                                id="dowload_apk_link"
                                type="url"
                                value={editData.dowload_apk_link || ""}
                                onChange={(e) => setEditData({ ...editData, dowload_apk_link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(null)}
                            className="hover:bg-primary/10"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={updateSettings.isPending}
                        >
                            {updateSettings.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                "Sauvegarder"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Contact & Links Dialog */}
            <Dialog open={openDialog === "contact"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Éditer Contact & Liens</DialogTitle>
                        <DialogDescription>Mettez à jour les informations de contact et les liens de paiement</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_phone">Téléphone WhatsApp</Label>
                            <Input
                                id="whatsapp_phone"
                                type="text"
                                value={editData.whatsapp_phone || ""}
                                onChange={(e) => setEditData({ ...editData, whatsapp_phone: e.target.value })}
                                placeholder="ex: +225XXXXXXXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wave_default_link">Lien Wave</Label>
                            <Input
                                id="wave_default_link"
                                type="url"
                                value={editData.wave_default_link || ""}
                                onChange={(e) => setEditData({ ...editData, wave_default_link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orange_default_link">Lien Orange</Label>
                            <Input
                                id="orange_default_link"
                                type="url"
                                value={editData.orange_default_link || ""}
                                onChange={(e) => setEditData({ ...editData, orange_default_link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mtn_default_link">Lien MTN</Label>
                            <Input
                                id="mtn_default_link"
                                type="url"
                                value={editData.mtn_default_link || ""}
                                onChange={(e) => setEditData({ ...editData, mtn_default_link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(null)}
                            className="hover:bg-primary/10"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={updateSettings.isPending}
                        >
                            {updateSettings.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                "Sauvegarder"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
