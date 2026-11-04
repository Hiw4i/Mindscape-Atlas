import {
  Heart,
  MessagesSquare,
  Brain,
  Smile,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Compass,
  Anchor,
  Eye,
  Flame,
  Leaf,
  Scale,
  BookOpen,
  Users,
  Target,
  Puzzle,
  Star,
  Moon,
  Clock,
  Layers,
  Link2,
  Map,
  AlertTriangle,
  CircleHelp,
  Lightbulb,
  Quote,
  Video,
  FlaskConical,
  GraduationCap,
  KeyRound,
  Crown,
  PlayCircle,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Реестр иконок: в базе хранится строковое имя, здесь оно превращается
 * в компонент lucide. Позволяет задавать иконки тем без кода.
 */
const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  chat: MessagesSquare,
  brain: Brain,
  smile: Smile,
  trend: TrendingUp,
  wallet: Wallet,
  shield: ShieldCheck,
  compass: Compass,
  anchor: Anchor,
  eye: Eye,
  flame: Flame,
  leaf: Leaf,
  scale: Scale,
  book: BookOpen,
  users: Users,
  target: Target,
  puzzle: Puzzle,
  star: Star,
  moon: Moon,
  clock: Clock,
  layers: Layers,
  link: Link2,
  map: Map,
  alert: AlertTriangle,
  help: CircleHelp,
  lightbulb: Lightbulb,
  quote: Quote,
  video: Video,
  flask: FlaskConical,
  graduation: GraduationCap,
  key: KeyRound,
  crown: Crown,
  play: PlayCircle,
  file: FileText,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || Compass;
}

export function getSourceKindIcon(kind: string): LucideIcon {
  if (kind === "video") return PlayCircle;
  if (kind === "book") return BookOpen;
  if (kind === "lecture") return GraduationCap;
  if (kind === "research") return FlaskConical;
  return FileText;
}
