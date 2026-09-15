const ACCRA_SUFFIX = ", Accra";

export default function areaFromAccraAddress(address: string): string {
  if (!address.endsWith(ACCRA_SUFFIX)) {
    return address;
  }

  const withoutCity = address.slice(0, -ACCRA_SUFFIX.length);
  const separator = withoutCity.lastIndexOf(", ");
  if (separator <= 0) {
    return withoutCity;
  }

  return withoutCity.slice(separator + 2);
}
