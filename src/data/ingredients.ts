import { BaseFlavor, BaseShape, FillingFlavor, FrostingFlavor, DecorationType, ToppingType } from '../game/types';

export interface IngredientOption<T> {
  id: T;
  name: string;
  color: string;
  secondaryColor: string;
  iconType: string;
  description: string;
}

export const BASE_OPTIONS: IngredientOption<BaseFlavor>[] = [
  {
    id: 'vanilla',
    name: 'Vanilla Sponge',
    color: '#F9E2AF',
    secondaryColor: '#E6C687',
    iconType: 'wheat',
    description: 'Fluffy golden butter sponge'
  },
  {
    id: 'chocolate',
    name: 'Choco Fudge',
    color: '#6F4E37',
    secondaryColor: '#533722',
    iconType: 'candy',
    description: 'Rich dark cocoa sponge'
  },
  {
    id: 'strawberry',
    name: 'Pink Berry',
    color: '#F48FB1',
    secondaryColor: '#E06D94',
    iconType: 'heart',
    description: 'Sweet pink strawberry batter'
  },
  {
    id: 'lemon',
    name: 'Lemon Chiffon',
    color: '#FFF176',
    secondaryColor: '#FDD835',
    iconType: 'sun',
    description: 'Bright citrus chiffon'
  },
  {
    id: 'blueberry',
    name: 'Blueberry Velvet',
    color: '#9575CD',
    secondaryColor: '#7E57C2',
    iconType: 'circle-dot',
    description: 'Fragrant purple berry sponge'
  }
];

export const BASE_SHAPES: { id: BaseShape; name: string }[] = [
  { id: 'round', name: 'Round Tier' },
  { id: 'square', name: 'Square Tier' },
  { id: 'heart', name: 'Heart Tier' }
];

export const FILLING_OPTIONS: IngredientOption<FillingFlavor>[] = [
  {
    id: 'cream',
    name: 'Sweet Cream',
    color: '#FFFDE7',
    secondaryColor: '#FFF9C4',
    iconType: 'droplet',
    description: 'Silky whipped custard'
  },
  {
    id: 'chocolate',
    name: 'Cocoa Ganache',
    color: '#4E342E',
    secondaryColor: '#3E2723',
    iconType: 'flame',
    description: 'Decadent melted ganache'
  },
  {
    id: 'strawberry',
    name: 'Berry Jam',
    color: '#D81B60',
    secondaryColor: '#C2185B',
    iconType: 'sparkles',
    description: 'Ruby strawberry preserves'
  },
  {
    id: 'caramel',
    name: 'Salted Caramel',
    color: '#FFB300',
    secondaryColor: '#FFA000',
    iconType: 'coffee',
    description: 'Golden buttery drip caramel'
  },
  {
    id: 'blueberry',
    name: 'Blueberry Purée',
    color: '#5E35B1',
    secondaryColor: '#512DA8',
    iconType: 'disc',
    description: 'Tart wild berry compote'
  }
];

export const FROSTING_OPTIONS: IngredientOption<FrostingFlavor>[] = [
  {
    id: 'vanilla',
    name: 'Vanilla Buttercream',
    color: '#FFFFEA',
    secondaryColor: '#F5F5DC',
    iconType: 'cloud',
    description: 'Pearly glossy buttercream'
  },
  {
    id: 'chocolate',
    name: 'Fudge Glaze',
    color: '#5D4037',
    secondaryColor: '#4E342E',
    iconType: 'layers',
    description: 'Deep glossy chocolate coat'
  },
  {
    id: 'strawberry',
    name: 'Strawberry Whip',
    color: '#FF80AB',
    secondaryColor: '#FF4081',
    iconType: 'flower',
    description: 'Rosy pastel swirl'
  },
  {
    id: 'mint',
    name: 'Mint Buttercream',
    color: '#A7F3D0',
    secondaryColor: '#6EE7B7',
    iconType: 'leaf',
    description: 'Cool refreshing green icing'
  },
  {
    id: 'blueberry',
    name: 'Royal Blueberry',
    color: '#B39DDB',
    secondaryColor: '#9575CD',
    iconType: 'gem',
    description: 'Velvety lilac glaze'
  },
  {
    id: 'lemon',
    name: 'Lemon Drizzle',
    color: '#FFEE58',
    secondaryColor: '#FDD835',
    iconType: 'zap',
    description: 'Sunny zesty royal icing'
  }
];

export const DECORATION_OPTIONS: IngredientOption<DecorationType>[] = [
  {
    id: 'sprinkles',
    name: 'Rainbow Confetti',
    color: '#FF5722',
    secondaryColor: '#00BCD4',
    iconType: 'sparkles',
    description: 'Multi-colored sugar sprinkles'
  },
  {
    id: 'stars',
    name: 'Golden Stars',
    color: '#FFD700',
    secondaryColor: '#FFA000',
    iconType: 'star',
    description: 'Crisp golden sugar stars'
  },
  {
    id: 'hearts',
    name: 'Candy Hearts',
    color: '#E91E63',
    secondaryColor: '#F06292',
    iconType: 'heart',
    description: 'Sweet pastel pink hearts'
  },
  {
    id: 'dots',
    name: 'Sugar Pearls',
    color: '#E0F7FA',
    secondaryColor: '#80DEEA',
    iconType: 'circle-dot',
    description: 'Shimmering edible pearl beads'
  },
  {
    id: 'swirls',
    name: 'Chocolate Swirls',
    color: '#4E342E',
    secondaryColor: '#795548',
    iconType: 'wind',
    description: 'Artistic cocoa piping spirals'
  },
  {
    id: 'candies',
    name: 'Mini M&Ms',
    color: '#9C27B0',
    secondaryColor: '#4CAF50',
    iconType: 'palette',
    description: 'Crunchy rainbow chocolate bits'
  }
];

export const TOPPING_OPTIONS: IngredientOption<ToppingType>[] = [
  {
    id: 'cherry',
    name: 'Glazed Cherry',
    color: '#D50000',
    secondaryColor: '#FF1744',
    iconType: 'cherry',
    description: 'Shiny red maraschino cherry'
  },
  {
    id: 'strawberry',
    name: 'Fresh Berry',
    color: '#E91E63',
    secondaryColor: '#C2185B',
    iconType: 'heart',
    description: 'Juicy ripe whole strawberry'
  },
  {
    id: 'blueberry',
    name: 'Blueberry Crown',
    color: '#3F51B5',
    secondaryColor: '#303F9F',
    iconType: 'circle-dot',
    description: 'Trio of fresh blueberries'
  },
  {
    id: 'wafer',
    name: 'Wafer Stick',
    color: '#D7CCC8',
    secondaryColor: '#8D6E63',
    iconType: 'minus',
    description: 'Crisp striped chocolate wafer'
  },
  {
    id: 'choc_piece',
    name: 'Choco Medallion',
    color: '#3E2723',
    secondaryColor: '#5D4037',
    iconType: 'square',
    description: 'Embossed artisan cocoa square'
  },
  {
    id: 'candy',
    name: 'Swirl Lollipop',
    color: '#FF4081',
    secondaryColor: '#00E676',
    iconType: 'disc',
    description: 'Mini rainbow twirl candy'
  }
];
