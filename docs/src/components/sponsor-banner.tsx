import { useCurrentGoldSponsor } from "../hooks";

type TSponsorBannerProps = {
  isMobile?: boolean;
};

export function SponsorBanner({ isMobile }: TSponsorBannerProps) {
  const [sponsor] = useCurrentGoldSponsor();

  return sponsor ? (
    <a href={sponsor.url}>
      <img
        src={sponsor.banner}
        alt={`${sponsor.name} Banner`}
        width={isMobile ? undefined : "250"}
        height={isMobile ? "30" : "40"}
        loading="lazy"
      />
      <span>Sponsor</span>
    </a>
  ) : (
    <a href="/">
      <img
        src="/sponsors/250x40.svg"
        alt="Sample Banner"
        width={isMobile ? undefined : "250"}
        height={isMobile ? "30" : "40"}
        loading="lazy"
      />
      <span>Sponsor</span>
    </a>
  );
}
