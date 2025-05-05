import { useRotatedSponsors } from "../hooks";
import type { TSponsor } from "../types";

type TSponsorBannerProps = {
  category: string;
  onlyWithLogo?: boolean;
};

const DESCRIPTION: Record<string, string> = {
  "gold-sponsors":
    "Become a Gold Sponsor and showcase your logo here and in a banner at the top of the page. Maximum visibility, premium placement.",
  "silver-sponsors": "Become a Silver Sponsor and showcase your logo here.",
  individuals: "Become an Individuals Sponsor and showcase your name here.",
};

export function SponsorsList({ category, onlyWithLogo }: TSponsorBannerProps) {
  const isIndividuals = category === "individuals";

  const [sponsors]: [Array<TSponsor>] = useRotatedSponsors(category, onlyWithLogo);

  return (
    <>
      <p className="custom__sponsors-list">
        {sponsors.length > 0 ? (
          sponsors.map((sponsor, index) =>
            isIndividuals ? (
              <>
                {`${sponsor.name} (${sponsor.login})`}
                <br />
              </>
            ) : (
              <a href={sponsor.url} key={`custom__sponsors-list-item-${category}-${index}`}>
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} Logo`}
                  width="230"
                  height="100"
                  loading="lazy"
                  className="custom__sponsors-list-item"
                />
              </a>
            ),
          )
        ) : isIndividuals ? (
          <></>
        ) : (
          <a href="/">
            <img
              src="/sponsors/230x100.svg"
              alt="Sample Logo"
              width="230"
              height="100"
              loading="lazy"
              className="custom__sponsors-list-item"
            />
          </a>
        )}
      </p>

      <p>{DESCRIPTION[category]}</p>
    </>
  );
}
