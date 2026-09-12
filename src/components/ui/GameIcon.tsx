import React from 'react';
import {
  Wheat,
  Candy,
  Heart,
  Sun,
  CircleDot,
  Droplet,
  Flame,
  Sparkles,
  Coffee,
  Disc,
  Cloud,
  Layers,
  Flower2,
  Leaf,
  Gem,
  Zap,
  Star,
  Wind,
  Palette,
  Cherry,
  Minus,
  Square,
  Cake,
  Cog,
  Truck,
  RotateCcw,
  Trash2,
  Package,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Award,
  BookOpen,
  Settings,
  Flame as FireIcon,
  HelpCircle,
  Check,
  ChevronRight,
  RefreshCw,
  Home,
  CloudSun,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';

interface GameIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({
  name,
  size = 18,
  color,
  className = ''
}) => {
  const iconProps = { size, color, className };

  switch (name.toLowerCase()) {
    case 'wheat':
      return <Wheat {...iconProps} />;
    case 'candy':
      return <Candy {...iconProps} />;
    case 'heart':
      return <Heart {...iconProps} />;
    case 'sun':
      return <Sun {...iconProps} />;
    case 'circle-dot':
      return <CircleDot {...iconProps} />;
    case 'droplet':
      return <Droplet {...iconProps} />;
    case 'flame':
    case 'fire':
      return <Flame {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'coffee':
      return <Coffee {...iconProps} />;
    case 'disc':
      return <Disc {...iconProps} />;
    case 'cloud':
      return <Cloud {...iconProps} />;
    case 'layers':
      return <Layers {...iconProps} />;
    case 'flower':
      return <Flower2 {...iconProps} />;
    case 'leaf':
      return <Leaf {...iconProps} />;
    case 'gem':
      return <Gem {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'wind':
      return <Wind {...iconProps} />;
    case 'palette':
      return <Palette {...iconProps} />;
    case 'cherry':
      return <Cherry {...iconProps} />;
    case 'minus':
      return <Minus {...iconProps} />;
    case 'square':
      return <Square {...iconProps} />;
    case 'cake':
      return <Cake {...iconProps} />;
    case 'cog':
    case 'gear':
      return <Cog {...iconProps} />;
    case 'truck':
    case 'deliver':
      return <Truck {...iconProps} />;
    case 'undo':
    case 'rotate-ccw':
      return <RotateCcw {...iconProps} />;
    case 'trash':
    case 'trash2':
      return <Trash2 {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'volume2':
    case 'volume-on':
      return <Volume2 {...iconProps} />;
    case 'volumex':
    case 'volume-off':
      return <VolumeX {...iconProps} />;
    case 'pause':
      return <Pause {...iconProps} />;
    case 'play':
      return <Play {...iconProps} />;
    case 'award':
    case 'trophy':
      return <Award {...iconProps} />;
    case 'book':
    case 'book-open':
      return <BookOpen {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'help':
      return <HelpCircle {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'arrow-right':
      return <ChevronRight {...iconProps} />;
    case 'refresh':
      return <RefreshCw {...iconProps} />;
    case 'home':
      return <Home {...iconProps} />;
    case 'cloud-sun':
      return <CloudSun {...iconProps} />;
    case 'alert':
      return <AlertTriangle {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};
