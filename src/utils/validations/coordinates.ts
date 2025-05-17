const MAX_ABSOLUTE_LATITUDE_VALUE = 90
const MAX_ABSOLUTE_LONGITUTDE_VALUE = 180

export function valiteLatitude(value: number) {
  return Math.abs(value) <= MAX_ABSOLUTE_LATITUDE_VALUE
}

export function validateLongitude(value: number) {
  return Math.abs(value) <= MAX_ABSOLUTE_LONGITUTDE_VALUE
}
