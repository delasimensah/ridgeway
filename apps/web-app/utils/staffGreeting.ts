export default function staffGreeting(
  displayName: string,
  now: Date = new Date()
): string {
  const hour = now.getHours();
  const firstName = displayName.trim().split(/\s+/)[0] ?? displayName;
  const when =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${when}, ${firstName}`;
}
