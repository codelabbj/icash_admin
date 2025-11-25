"use client"

import { useState } from "react"
import { useDeposits, useCaisses, type DepositFilters } from "@/hooks/useDeposits"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {Loader2, Wallet, Plus, Filter} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePlatforms } from "@/hooks/usePlatforms"
import {CreateDepositDialog} from "@/components/create-deposit-dialog";

export default function DepositsPage() {
    const [filters, setFilters] = useState<DepositFilters>({
        page: 1,
        page_size: 10,
    })
    const [createDialogOpen,setCreateDialogOpen] = useState(false)
    const { data: depositsData, isLoading: depositsLoading } = useDeposits(filters)
    const { data: caisses, isLoading: caissesLoading } = useCaisses()
    const { data: platforms } = usePlatforms({})


    const handlePlatformChange = (value: string) => {
        setFilters({ ...filters, bet_app: value === "all" ? undefined : value, page: 1 })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dépôts & Caisses</h2>
                    <p className="text-muted-foreground">Consultez les dépôts et soldes de caisse</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un Dépôt
                </Button>
            </div>

            <Tabs defaultValue="caisses" className="w-full">
                <TabsList>
                    <TabsTrigger value="caisses">Caisses</TabsTrigger>
                    <TabsTrigger value="deposits">Dépôts</TabsTrigger>
                </TabsList>

                <TabsContent value="caisses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aperçu des Caisses</CardTitle>
                            <CardDescription>Solde actuel pour chaque plateforme</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {caissesLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : caisses && caisses.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {caisses.map((caisse) => (
                                        <Card key={caisse.id}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">{caisse.bet_app_details.name}</CardTitle>
                                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{caisse.solde} FCFA</div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {caisse.updated_at
                                                        ? `Mis à jour le ${new Date(caisse.updated_at).toLocaleDateString()}`
                                                        : "Aucune mise à jour"}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">Aucune caisse trouvée</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="deposits" className="space-y-4">
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-primary" />
                                <div>
                                    <CardTitle>Filtres</CardTitle>
                                    <CardDescription>Filtrez les dépôts par plateforme</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="platform" className="font-semibold text-sm">
                                        Plateforme
                                    </Label>
                                    <Select value={filters.bet_app || "all"} onValueChange={handlePlatformChange}>
                                        <SelectTrigger
                                            id="platform"
                                            className="bg-background hover:bg-accent/50 transition-colors"
                                        >
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="font-medium">
                                                Toutes les Plateformes
                                            </SelectItem>
                                            {platforms?.map((platform) => (
                                                <SelectItem key={platform.id} value={platform.id}>
                                                    {platform.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {filters.bet_app && (
                                    <div className="flex items-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFilters({ ...filters, bet_app: undefined, page: 1 })}
                                            className="w-full hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            Réinitialiser
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Liste des Dépôts</CardTitle>
                            <CardDescription>Total : {depositsData?.count || 0} dépôts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {depositsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : depositsData && depositsData.results.length > 0 ? (
                                <div className="space-y-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Plateforme</TableHead>
                                                <TableHead>Montant</TableHead>
                                                <TableHead>Créé le</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {depositsData.results.map((deposit) => (
                                                <TableRow key={deposit.id}>
                                                    <TableCell>{deposit.bet_app_detail.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="default" className="font-mono">
                                                            {deposit.amount} FCFA
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Page {filters.page} sur {Math.ceil((depositsData?.count || 0) / (filters.page_size || 10))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                                                disabled={!depositsData?.previous}
                                            >
                                                Précédent
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                                                disabled={!depositsData?.next}
                                            >
                                                Suivant
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">Aucun dépôt trouvé</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <CreateDepositDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
        </div>
    )
}
