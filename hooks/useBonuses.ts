"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface Bonus {
  id: number
  created_at: string
  amount: string
  reason_bonus: string
  transaction: string | null
  user: string
}

export interface BonusesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Bonus[]
}

export interface BonusFilters {
  page?: number
  page_size?: number
  search?: string
  user?: string
  reason_bonus?: string
}

export function useBonuses(filters: BonusFilters = {}) {
  return useQuery({
    queryKey: ["bonuses", filters],
    queryFn: async () => {
      const res = await api.get<BonusesResponse>("/mobcash/bonus", { params: filters })
      return res.data
    },
  })
}
