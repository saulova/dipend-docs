import { useEffect, useState } from "react";
import { SponsorsService } from "../services/sponsors-service";
import type { TSponsor } from "../types";

export function useRotatedSponsors(category: string, onlyWithLogo?: boolean): [Array<TSponsor>] {
  const [rotatedSponsors, setRotatedSponsors] = useState<Array<TSponsor>>([]);

  useEffect(() => {
    SponsorsService.getRotatedSponsors(category, onlyWithLogo).then((sponsor) => {
      setRotatedSponsors(sponsor);
    });
  }, []);

  return [rotatedSponsors];
}
