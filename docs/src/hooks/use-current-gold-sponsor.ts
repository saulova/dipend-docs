import { useEffect, useState } from "react";
import { SponsorsService } from "../services/sponsors-service";
import type { TSponsor } from "../types";

export function useCurrentGoldSponsor(): [TSponsor | undefined] {
  const [sponsorBanner, setSponsorBanner] = useState<TSponsor | undefined>(undefined);

  useEffect(() => {
    SponsorsService.getCurrentGoldSponsor().then((sponsor) => {
      setSponsorBanner(sponsor);
    });
  }, []);

  return [sponsorBanner];
}
