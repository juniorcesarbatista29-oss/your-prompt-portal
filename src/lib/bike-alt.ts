import type { Bike } from "@/components/BikeDetailModal";

/**
 * Builds a rich, SEO-friendly alt text for a bike image.
 * Example: "Bicicleta elétrica Moped Voltz Pro, motor 1000W, autonomia 120km — Filadelfo Motors"
 */
export function buildBikeAlt(bike: Pick<Bike, "name" | "tag" | "specs">): string {
  const parts: string[] = [`Bicicleta elétrica ${bike.tag} ${bike.name}`];
  const motor = bike.specs?.motor;
  const autonomia = bike.specs?.autonomia;
  if (motor && motor !== "—") parts.push(`motor ${motor}`);
  if (autonomia && autonomia !== "—") parts.push(`autonomia ${autonomia}`);
  return `${parts.join(", ")} — Filadelfo Motors`;
}
