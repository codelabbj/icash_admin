"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Network,
  Phone,
  Award as IdCard,
  Bell,
  Gift,
  ArrowLeftRight,
  Settings,
  LayoutDashboard,
  Wallet,
  Layers,
  Bot,
  Ticket,
  Megaphone,
  CreditCard,
} from "lucide-react"

import { CONFIG } from "@/lib/config"

const navItems = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard, feature: null },
  { href: "/dashboard/users", label: "Utilisateurs", icon: Users, feature: "USERS" as const },
  { href: "/dashboard/bot-users", label: "Utilisateurs Bot", icon: Users, feature: "BOT_USERS" as const },
  { href: "/dashboard/networks", label: "Réseaux", icon: Network, feature: "NETWORKS" as const },
  { href: "/dashboard/telephones", label: "Téléphones", icon: Phone, feature: "TELEPHONES" as const },
  { href: "/dashboard/user-app-ids", label: "IDs Utilisateur", icon: IdCard, feature: "USER_APP_IDS" as const },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, feature: "NOTIFICATIONS" as const },
  { href: "/dashboard/bonuses", label: "Bonus", icon: Gift, feature: "BONUSES" as const },
  { href: "/dashboard/coupons", label: "Coupons", icon: Ticket, feature: "COUPONS" as const },
  { href: "/dashboard/advertisements", label: "Publicités", icon: Megaphone, feature: "ADVERTISEMENTS" as const },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight, feature: "TRANSACTIONS" as const },
  { href: "/dashboard/recharges", label: "Recharges", icon: CreditCard, feature: "RECHARGES" as const },
  { href: "/dashboard/bot-transactions", label: "Transactions Bot", icon: Bot, feature: "BOT_TRANSACTIONS" as const },
  { href: "/dashboard/platforms", label: "Plateformes", icon: Layers, feature: "PLATFORMS" as const },
  { href: "/dashboard/deposits", label: "Dépôts & Caisses", icon: Wallet, feature: "DEPOSITS" as const },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings, feature: "SETTINGS" as const },
]

interface DashboardNavProps {
  onNavigate?: () => void
}

export function DashboardNav({ onNavigate }: DashboardNavProps = {}) {
  const pathname = usePathname()

  // Filter navigation items based on feature flags
  const enabledNavItems = navItems.filter(item => {
    // Dashboard is always enabled
    if (item.feature === null) return true
    // Check if feature is enabled in config
    return CONFIG.FEATURES[item.feature]
  })

  return (
    <nav className="space-y-2">
      {enabledNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-1",
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-r-full"></div>
            )}

            {/* Icon with gradient background when active */}
            <div className={cn(
              "flex items-center justify-center transition-all duration-200",
              isActive
                ? "p-1.5 rounded-lg bg-white/20"
                : "group-hover:scale-110"
            )}>
              <Icon className={cn(
                "h-5 w-5 transition-all duration-200",
                isActive ? "text-white" : ""
              )} />
            </div>

            <span className={cn(
              "transition-all duration-200 font-medium",
              isActive ? "text-white" : ""
            )}>
              {item.label}
            </span>

            {/* Hover effect */}
            {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
