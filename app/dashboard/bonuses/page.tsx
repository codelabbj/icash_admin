"use client"

import { useState } from "react"
import { useBonuses, type BonusFilters } from "@/hooks/useBonuses"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search } from "lucide-react"
import { CopyButton } from "@/components/copy-button"

export default function BonusesPage() {
  const [filters, setFilters] = useState<BonusFilters>({
    page: 1,
    page_size: 10,
  })
  const { data: bonusesData, isLoading } = useBonuses(filters)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Bonus</h2>
        <p className="text-muted-foreground">Consultez les bonus et récompenses des utilisateurs</p>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <CardDescription className="text-sm">Rechercher et filtrer les bonus</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par raison..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined, page: 1 })}
                  className="pl-8"
                />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="user">ID Utilisateur</Label>
              <Input
                id="user"
                placeholder="Filtrer par ID utilisateur..."
                value={filters.user || ""}
                onChange={(e) => setFilters({ ...filters, user: e.target.value || undefined, page: 1 })}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="reason_bonus">Raison</Label>
              <Input
                id="reason_bonus"
                placeholder="Filtrer par raison..."
                value={filters.reason_bonus || ""}
                onChange={(e) => setFilters({ ...filters, reason_bonus: e.target.value || undefined, page: 1 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des Bonus</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {bonusesData?.count || 0} bonus</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bonusesData && bonusesData.results.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="font-semibold text-muted-foreground h-12">ID</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Montant</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Raison</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">ID Utilisateur</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Transaction</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bonusesData.results.map((bonus, index) => (
                      <TableRow key={bonus.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {bonus.id}
                            <CopyButton value={bonus.id} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="font-mono font-semibold">
                            {bonus.amount} FCFA
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{bonus.reason_bonus}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {bonus.user}
                            <CopyButton value={bonus.user} />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{bonus.transaction || "-"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(bonus.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {bonusesData && (bonusesData.next || bonusesData.previous) && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    Page {filters.page || 1} sur {Math.ceil((bonusesData.count || 0) / (filters.page_size || 10))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={!bonusesData.previous}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={!bonusesData.next}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucun bonus trouvé</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
