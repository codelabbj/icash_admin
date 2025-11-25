"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Users,
    Network,
    ArrowLeftRight,
    Wallet,
    Gift,
    Bot,
    Share2, Award, DollarSign, Megaphone, Ticket, UserPlus
} from "lucide-react"
import {useDashboardStats} from "@/hooks/useDashboardStats";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UsersChart} from "@/components/users-chart";
import {TransactionsChart} from "@/components/transactions-chart";
import {BotTransactionsChart} from "@/components/bot-transactions-chart";

export default function DashboardPage() {
    const { data, isLoading, isError } = useDashboardStats()

    const stats = data?.dashboard_stats
    const transactionsByApp = stats?.transactions_by_app ?? {}
    const networksCount = Object.keys(transactionsByApp).length
    const volume = data?.volume_transactions
    const userGrowth = data?.user_growth
    const referral = data?.referral_system
    const [volumeChart, setVolumeChart] = useState<{date: string
        type_trans: string
        total_amount: number
        count: number}[]>([])
    const [userChart, setUserChart] = useState<{
        date: string
        count: number
    }[]>([])
    const [volumePeriod, setVolumePeriod] = useState<"monthly"|"yearly"|"daily"|"weekly">("monthly")
    const [usersPeriod, setUsersPeriod] = useState<"monthly"|"daily"|"weekly">("monthly")

    useEffect(() => {
        if (!volume) return
        switch (volumePeriod){
            case "weekly":
                setVolumeChart(volume.evolution.weekly.map(
                    (v)=> {
                        return {
                            date: new Date(v.week).toLocaleDateString(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
                break
            case "monthly":
                setVolumeChart(volume.evolution.monthly.map(
                    (v)=> {
                        return {
                            date: new Date(v.month).toLocaleString("fr",{month:"long"}).toUpperCase(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
                break
            case "yearly":
                setVolumeChart(volume.evolution.yearly.map(
                    (v)=> {
                        return {
                            date:new Date(v.year).getFullYear().toString(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
                break
            case "daily":
                setVolumeChart(volume.evolution.daily.map(
                    (v)=> {
                        return {
                            date: new Date(v.date).toLocaleDateString(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
        }

    },[volume,volumePeriod])

    useEffect(() => {
        if (!userGrowth) return
        switch (usersPeriod){
            case "weekly":
                setUserChart(userGrowth.new_users.weekly.map(
                    (v)=> {
                        return {
                            date: new Date(v.week).toLocaleDateString(),
                            count: v.count
                        }
                    }

                ))
                break
            case "monthly":
                setUserChart(userGrowth.new_users.monthly.map(
                    (v)=> {
                        return {
                            date: new Date(v.month).toLocaleString("fr",{month:"long"}).toUpperCase(),
                            count: v.count,
                        }
                    }

                ))
                break
            case "daily":
                setUserChart(userGrowth.new_users.daily.map(
                    (v)=> {
                        return {
                            date: new Date(v.date).toLocaleDateString(),
                            count: v.count,
                        }
                    }

                ))
        }

    },[userGrowth,usersPeriod])

    function formatNumber(value: number | undefined | null) {
        if (value === undefined || value === null || Number.isNaN(value)) return "-"
        return new Intl.NumberFormat("fr-FR").format(value)
    }

    function formatCurrency(value: number | undefined | null) {
        if (value === undefined || value === null || Number.isNaN(value)) return "-"
        return `${formatNumber(value)} FCFA`
    }



    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Tableau de Bord
                </h2>
                <p className="text-muted-foreground text-lg">Bienvenue sur le tableau de bord administrateur FASTXOF</p>
            </div>

            {isError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    Une erreur est survenue lors du chargement des statistiques.
                </div>
            )}

            {/* Main Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-rust">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Total Utilisateurs</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatNumber(stats?.total_users)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.active_users)} actifs / ${formatNumber(stats?.inactive_users)} inactifs`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-orange">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Transactions Total</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <ArrowLeftRight className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatNumber(stats?.total_transactions)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading ? "Chargement..." : "Toutes transactions confondues"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-dark">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Solde Net</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatCurrency(volume?.net_volume)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading
                                ? "Chargement..."
                                : `${formatCurrency(volume?.deposits?.total_amount)} dépôts / ${formatCurrency(
                                    volume?.withdrawals?.total_amount,
                                )} retraits`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-amber">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Total Bonus</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Gift className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatCurrency(stats?.total_bonus)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading ? "Chargement..." : "Bonus distribués"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Rewards, Disbursements, Ads & Coupons */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-emerald">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Récompenses</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatCurrency(stats?.rewards?.total)}
                        </div>
                        <p className="text-xs text-white/70">Total des récompenses</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-purple">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Décaissements</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatCurrency(stats?.disbursements?.amount)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.disbursements?.count)} décaissements`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-rose">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Publicités</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Megaphone className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatNumber(stats?.advertisements?.total)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.advertisements?.active)} actives`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-stat-card-cyan">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-medium text-white">Coupons</CardTitle>
                        <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Ticket className="h-6 w-6 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {isLoading ? "N/A" : formatNumber(stats?.coupons?.total)}
                        </div>
                        <p className="text-xs text-white/70">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.coupons?.active)} actifs`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
                {/* Bot Statistics with Donut Chart */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            Statistiques Bot
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Chargement...</p>
                        ) : (
                            <BotTransactionsChart
                                totalTransactions={stats?.bot_stats?.total_transactions ?? 0}
                                totalDeposits={stats?.bot_stats?.total_deposits ?? 0}
                                totalWithdrawals={stats?.bot_stats?.total_withdrawals ?? 0}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Users by Source with Progress Bars */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                                <UserPlus className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            Utilisateurs par Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Chargement...</p>
                        ) : (
                            <>
                                {userGrowth?.users_by_source?.map((source) => {
                                    const percentage = userGrowth.active_users_count ? (source.count / userGrowth.active_users_count) * 100 : 0
                                    return (
                                        <div key={source.source} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium capitalize text-foreground">{source.source}</span>
                                                <span className="text-xs font-semibold text-primary">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">{formatNumber(source.count)} utilisateurs</p>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Transactions by App */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
                                <Network className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            Transactions par Application
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-2">{networksCount} application{networksCount > 1 ? 's' : ''}</p>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Chargement...</p>
                        ) : Object.keys(transactionsByApp).length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucune transaction par application</p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(transactionsByApp).map(([app, data], index) => {
                                    const totalAmount = Object.values(transactionsByApp).reduce((sum: number, item: any) => sum + item.total_amount, 0)
                                    const percentage = totalAmount > 0 ? (data.total_amount / totalAmount) * 100 : 0

                                    return (
                                        <div key={app} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className={`w-2 h-2 rounded-full ${index % 4 === 0 ? 'bg-blue-500' : index % 4 === 1 ? 'bg-indigo-500' : index % 4 === 2 ? 'bg-purple-500' : 'bg-violet-500'}`} />
                                                    <span className="text-sm font-medium text-foreground capitalize">{app}</span>
                                                </div>
                                                <span className="text-xs font-semibold text-primary">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${
                                                        index % 4 === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                                            index % 4 === 1 ? 'bg-gradient-to-r from-indigo-500 to-blue-500' :
                                                                index % 4 === 2 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                                                                    'bg-gradient-to-r from-violet-500 to-purple-500'
                                                    }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">{formatNumber(data.count)} transactions</span>
                                                <span className="text-sm font-semibold text-foreground">{formatCurrency(data.total_amount)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Referral System */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20">
                                <Share2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            Système de Parrainage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Chargement...</p>
                        ) : (
                            <>
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-xs text-muted-foreground mb-1">Parrainages Actifs</p>
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatNumber(referral?.parrainages_count)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Bonus Total Distribué</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(referral?.total_referral_bonus)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">Taux d'Activation</p>
                                        <span className="text-sm font-bold text-accent">{formatNumber(referral?.activation_rate)}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                            style={{ width: `${Math.min(referral?.activation_rate ?? 0, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 justify-between">
                            <CardTitle>Evolution des transaction</CardTitle>
                            <Select defaultValue="daily" value={volumePeriod} onValueChange={(s)=>setVolumePeriod(s as "monthly"|"yearly"|"daily"|"weekly")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner une période"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Journalier</SelectItem>
                                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                    <SelectItem value="monthly">Mensuel</SelectItem>
                                    <SelectItem value="yearly">Annuel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <TransactionsChart data={volumeChart}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 justify-between">
                            <CardTitle>Evolution des utilisateurs</CardTitle>
                            <Select defaultValue="daily" value={usersPeriod} onValueChange={(s)=>setUsersPeriod(s as "monthly"|"daily"|"weekly")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner une période"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Journalier</SelectItem>
                                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                    <SelectItem value="monthly">Mensuel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <UsersChart data={userChart}/>
                    </CardContent>
                </Card>
            </div>


            {/* User Growth & Referral */}
            {/*


            */}

        </div>
    )
}