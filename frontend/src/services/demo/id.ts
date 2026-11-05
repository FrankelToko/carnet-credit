/**
 * crypto.randomUUID n'existe qu'en contexte sécurisé (https ou localhost) :
 * sur http://192.168.x.x depuis un téléphone, il est absent, d'où le repli.
 */
export const newId = (prefix: string): string => {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
  return `${prefix}_${random}`
}
