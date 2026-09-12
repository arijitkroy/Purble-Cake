export interface Customer {
  id: string;
  name: string;
  species: 'bunny' | 'bear' | 'cat' | 'fox' | 'panda' | 'penguin' | 'koala';
  color: string;
  earColor: string;
  hatColor: string;
  favoriteFlavor: string;
  greeting: string;
  thankYou: string;
}

export const CUSTOMERS: Customer[] = [
  {
    id: 'pip',
    name: 'Pip the Bunny',
    species: 'bunny',
    color: '#FFF0F5',
    earColor: '#FFB6C1',
    hatColor: '#FF4081',
    favoriteFlavor: 'strawberry',
    greeting: "Hop, hop! I'm craving something sweet and fruity!",
    thankYou: "Oh yum! That's the prettiest berry cake ever!"
  },
  {
    id: 'barnaby',
    name: 'Barnaby Bear',
    species: 'bear',
    color: '#8D6E63',
    earColor: '#6D4C41',
    hatColor: '#FFA000',
    favoriteFlavor: 'chocolate',
    greeting: "Growl! A big double chocolate cake for me, please!",
    thankYou: "Roar of joy! Rich and gooey just how I like it!"
  },
  {
    id: 'cleo',
    name: 'Cleo the Cat',
    species: 'cat',
    color: '#FFE0B2',
    earColor: '#FFCC80',
    hatColor: '#7C4DFF',
    favoriteFlavor: 'vanilla',
    greeting: "Purrrr... make it delicate and fancy!",
    thankYou: "Purrfectly baked! Five stars for your bakery!"
  },
  {
    id: 'felix',
    name: 'Felix Fox',
    species: 'fox',
    color: '#FF7043',
    earColor: '#F4511E',
    hatColor: '#26A69A',
    favoriteFlavor: 'lemon',
    greeting: "Got anything with a zesty citrus kick?",
    thankYou: "Sensational! Crisp, tangy, and wonderful!"
  },
  {
    id: 'poko',
    name: 'Poko Panda',
    species: 'panda',
    color: '#ECEFF1',
    earColor: '#263238',
    hatColor: '#AB47BC',
    favoriteFlavor: 'blueberry',
    greeting: "Hello baker! Can I get a purple berry special?",
    thankYou: "Mmm, absolute perfection! I will be back soon!"
  }
];

export function getRandomCustomer(): Customer {
  return CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
}
