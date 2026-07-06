import {
  BadgeCheckIcon,
  CreditCardIcon,
  TruckIcon,
  Building2Icon,
  AwardIcon,
  HeadsetIcon,
  CarIcon,
  HandshakeIcon,
  SettingsIcon,
  CheckCircleIcon,
} from "lucide-react";

const iconMap = {
  BadgeCheckIcon,
  CreditCardIcon,
  TruckIcon,
  Building2Icon,
  AwardIcon,
  HeadsetIcon,
  CarIcon,
  HandshakeIcon,
  SettingsIcon,
} as const;

export type SectionIconName = keyof typeof iconMap;

export function SectionIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name as SectionIconName] ?? CheckCircleIcon;
  return <Icon className={className} aria-hidden="true" />;
}
