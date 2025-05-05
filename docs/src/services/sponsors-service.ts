import type { TSponsor } from "../types";
import { clientSideCacheService } from "./client-side-cache-service";

export class SponsorsService {
  private static async loadSponsors(): Promise<Record<string, Array<TSponsor> | undefined>> {
    try {
      let sponsors = clientSideCacheService.get<Record<string, Array<TSponsor> | undefined>>("sponsors-list");
      if (sponsors) return sponsors;

      const res = await fetch("https://sponsors.sauloalvarenga.dev.br/sponsors.json");
      if (!res.ok) throw new Error("Failed to get sponsors.");
      sponsors = await res.json();

      if (sponsors === undefined) return {};

      const until = new Date();
      until.setTime(until.getTime() + 1 * 60 * 60 * 1000);

      clientSideCacheService.set<Record<string, Array<TSponsor> | undefined>>("sponsors-list", sponsors, until);

      return sponsors;
    } catch (err) {
      console.error(err);

      return {};
    }
  }

  private static getDaySeedAndSlot() {
    const now = new Date();

    const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const daySeed = utcDate.getUTCFullYear() * 10000 + (utcDate.getUTCMonth() + 1) * 100 + utcDate.getUTCDate();

    const minutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
    const slot = Math.floor(minutesUTC / 10);

    return { daySeed, slot };
  }

  public static async getCurrentGoldSponsor() {
    const sponsors = await SponsorsService.loadSponsors();

    const goldSponsors = (sponsors["gold-sponsors"] || []).filter((sp: TSponsor) => sp.banner);

    const { daySeed, slot } = SponsorsService.getDaySeedAndSlot();

    const startIndex = daySeed % goldSponsors.length;
    const sponsorIndex = (startIndex + slot) % goldSponsors.length;

    return goldSponsors[sponsorIndex];
  }

  public static async getRotatedSponsors(category: string, onlyWithLogo?: boolean) {
    const sponsors = await SponsorsService.loadSponsors();

    let sponsorsToRotate = sponsors[category] || [];

    if (onlyWithLogo) {
      sponsorsToRotate = sponsorsToRotate.filter((sp: TSponsor) => sp.logo);
    }

    if (sponsorsToRotate.length === 0) return [];

    const { daySeed, slot } = SponsorsService.getDaySeedAndSlot();
    const startIndex = (daySeed + slot) % sponsorsToRotate.length;

    return [...sponsorsToRotate.slice(startIndex), ...sponsorsToRotate.slice(0, startIndex)];
  }
}
