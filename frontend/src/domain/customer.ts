export interface CustomerInput {
  name: string
  phone: string
}

export type CustomerErrors = Partial<Record<keyof CustomerInput, string>>

/** Seule validation des champs d'un client : formulaire et dépôts s'y réfèrent. */
export const validateCustomerInput = (input: CustomerInput): CustomerErrors => {
  const errors: CustomerErrors = {}
  if (input.name.trim().length < 2) errors.name = 'Entre le nom du client.'
  if (input.phone.replace(/\D/g, '').length < 8) errors.phone = 'Entre un numéro valide.'
  return errors
}
