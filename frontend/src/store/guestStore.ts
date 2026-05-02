import { create } from 'zustand'
import type { GuestInfo } from '../types'

interface GuestStore {
  guestInfo: GuestInfo | null
  setGuestInfo: (info: GuestInfo) => void
  clearGuestInfo: () => void
}

export const useGuestStore = create<GuestStore>((set) => ({
  guestInfo: null,
  setGuestInfo: (info) => set({ guestInfo: info }),
  clearGuestInfo: () => set({ guestInfo: null }),
}))
