import { Info } from 'lucide-react'

export const DemoBanner = () => (
  <div
    role="status"
    className="flex items-center gap-2 bg-warn-soft px-4 py-2 text-sm font-semibold text-warn"
  >
    <Info size={18} aria-hidden="true" className="shrink-0" />
    <span>Mode démonstration : ces données restent sur cet appareil et ne sont pas envoyées au serveur.</span>
  </div>
)
