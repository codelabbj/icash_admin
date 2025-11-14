"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Telephone {
  id: number
  created_at: string
  phone: string
  user: string | null
  telegram_user: number | null
  network: number
}

export type TelephoneInput = {
  phone: string
  network: number
}

export interface TelephonesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Telephone[]
}

export interface TelephoneFilters {
  page?: number
  page_size?: number
  search?: string
  network?: number
  telegram_user?: number
}

export function useTelephones(filters: TelephoneFilters = {}) {
  return useQuery({
    queryKey: ["telephones", filters],
    queryFn: async () => {
      const res = await api.get<TelephonesResponse | Telephone[]>("/mobcash/user-phone/", { params: filters })
      // Handle both paginated and non-paginated responses
      if (Array.isArray(res.data)) {
        return {
          count: res.data.length,
          next: null,
          previous: null,
          results: res.data,
        } as TelephonesResponse
      }
      return res.data as TelephonesResponse
    },
  })
}

export function useCreateTelephone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TelephoneInput) => {
      const res = await api.post<Telephone>("/mobcash/user-phone/", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Telephone created successfully!")
      queryClient.invalidateQueries({ queryKey: ["telephones"] })
    },
  })
}

export function useUpdateTelephone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TelephoneInput }) => {
      const res = await api.patch<Telephone>(`/mobcash/user-phone/${id}/`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Telephone updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["telephones"] })
    },
  })
}

export function useDeleteTelephone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mobcash/user-phone/${id}/`)
    },
    onSuccess: () => {
      toast.success("Telephone deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["telephones"] })
    },
  })
}
