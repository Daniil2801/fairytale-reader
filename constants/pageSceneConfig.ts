import type { SceneAnimation } from '@/types/story';

/** Keyword → illustration URLs (child-safe Unsplash) */
export const SCENE_IMAGE_BY_KEY: Record<string, string[]> = {
  moon_night: [
    'https://images.unsplash.com/photo-1475274044307-4d248342e1c0?w=800&q=80',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80',
  ],
  meadow: [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80',
  ],
  firefly: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2179?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  ],
  bunny: [
    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
  ],
  flowers_hill: [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    'https://images.unsplash.com/photo-1464349095430-e782f028f1da?w=800&q=80',
  ],
  brook_water: [
    'https://images.unsplash.com/photo-1432407699709-5d493a1d9f9e?w=800&q=80',
  ],
  sleep_bedtime: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  ],
  teacup_kitchen: [
    'https://images.unsplash.com/photo-1515823064-d6e0a030edda?w=800&q=80',
  ],
  cottage: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  ],
  queen_castle: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2179?w=800&q=80',
  ],
  cocoa_warm: [
    'https://images.unsplash.com/photo-1542990253-0d0f843e4b8b?w=800&q=80',
  ],
  star_light: [
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
  ],
  dragon_sky: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2179?w=800&q=80',
  ],
  clouds: [
    'https://images.unsplash.com/photo-1534088568595-a066f41045a9?w=800&q=80',
  ],
  rainbow: [
    'https://images.unsplash.com/photo-1507401783583-5099a83e4727?w=800&q=80',
  ],
  paint_art: [
    'https://images.unsplash.com/photo-1460661414737-7907afda08b3?w=800&q=80',
  ],
  forest_woods: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  ],
  harp_music: [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
  ],
  bakery: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  ],
  muffin_food: [
    'https://images.unsplash.com/photo-1486427944299-d1955d23a34e?w=800&q=80',
  ],
  fox: [
    'https://images.unsplash.com/photo-1474511320723-9a0a4ddc0f06?w=800&q=80',
  ],
  kite_sky: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  ],
  attic: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
  ],
  lighthouse_sea: [
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de1?w=800&q=80',
  ],
  ocean_waves: [
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de1?w=800&q=80',
  ],
  dream_fog: [
    'https://images.unsplash.com/photo-1507401783583-5099a83e4727?w=800&q=80',
  ],
  garden: [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  ],
  gnome: [
    'https://images.unsplash.com/photo-1464349095430-e782f028f1da?w=800&q=80',
  ],
  snail: [
    'https://images.unsplash.com/photo-1426606686844-f7f3f59ac4a0?w=800&q=80',
  ],
  rain: [
    'https://images.unsplash.com/photo-1428597500691-693cd1d94f2b?w=800&q=80',
  ],
  picnic: [
    'https://images.unsplash.com/photo-1506086679359-31c0d814a3d0?w=800&q=80',
  ],
  ship_boat: [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  ],
  children_play: [
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
  ],
  whisper_talk: [
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80',
  ],
  default_nature: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  ],
};

/** Text patterns (lowercase) → visual concept key */
export const TEXT_TO_VISUAL_KEY: { pattern: RegExp; key: string; priority: number }[] = [
  { pattern: /\bfirefl|\bflicker of gold|\bflicker/i, key: 'firefly', priority: 10 },
  { pattern: /\bluciérnaga|\bluciernaga|\bvaga-lume|\bсветляч|\bglühwürm/i, key: 'firefly', priority: 10 },
  { pattern: /\bprado|\bpradera|\bлуг|\bmeadow/i, key: 'meadow', priority: 8 },
  { pattern: /\bluna|\bmoon|\bмесяц|\bлун|\bmond\b/i, key: 'moon_night', priority: 7 },
  { pattern: /\barroyo|\briacho|\bручей|\bручь|\bструмок|\bbach\b/i, key: 'brook_water', priority: 9 },
  { pattern: /\bconejo|\bcoelho|\bзайчик|\bзайчон|\bhasen|\blapin\b/i, key: 'bunny', priority: 8 },
  { pattern: /\btaza|\bchá|\bчашк|\btasse\b/i, key: 'teacup_kitchen', priority: 10 },
  { pattern: /\bdragón|\bdragão|\bдракон|\bdrachen/i, key: 'dragon_sky', priority: 10 },
  { pattern: /\barcoíris|\barco-íris|\bрадуг|\bвеселк|\bregenbogen/i, key: 'rainbow', priority: 10 },
  { pattern: /\bbosque|\bfloresta|\bлес|\bліс|\bwald\b/i, key: 'forest_woods', priority: 8 },
  { pattern: /\bfaro|\bмаяк|\bleuchtturm/i, key: 'lighthouse_sea', priority: 10 },
  { pattern: /\bmoonflower|\blantern/i, key: 'flowers_hill', priority: 10 },
  { pattern: /\bstarflower|\bhill\b/i, key: 'flowers_hill', priority: 8 },
  { pattern: /\bbrook|\bstream|\bhummed a lullaby/i, key: 'brook_water', priority: 9 },
  { pattern: /\bdaisies|\bmeadow|\bmeadows/i, key: 'meadow', priority: 8 },
  { pattern: /\bmoon|\bsilver|\bnight|\btwinkled goodnight/i, key: 'moon_night', priority: 7 },
  { pattern: /\byawn|\bsweet dreams|\bsleep|\bedtime/i, key: 'sleep_bedtime', priority: 9 },
  { pattern: /\bbunny|\bhopped|\bpaws|\bears\b/i, key: 'bunny', priority: 8 },
  { pattern: /\bteacup|\bchina cupboard|\bcup\b/i, key: 'teacup_kitchen', priority: 10 },
  { pattern: /\bcocoa|\bwarm/i, key: 'cocoa_warm', priority: 9 },
  { pattern: /\bqueen|\bgranddaughter/i, key: 'queen_castle', priority: 8 },
  { pattern: /\bcottage/i, key: 'cottage', priority: 8 },
  { pattern: /\bcrack|\bstar shaped|\bconstellation|\bshimmered/i, key: 'star_light', priority: 7 },
  { pattern: /\bdragon|\bmilo/i, key: 'dragon_sky', priority: 10 },
  { pattern: /\bcloud|\bpuffing shapes/i, key: 'clouds', priority: 9 },
  { pattern: /\brainbow/i, key: 'rainbow', priority: 10 },
  { pattern: /\bbrush|\bpaint|\bsunbeam/i, key: 'paint_art', priority: 8 },
  { pattern: /\bship|\bsailed|\bboat/i, key: 'ship_boat', priority: 9 },
  { pattern: /\bwoods|\bforest|\bleaves|\boak/i, key: 'forest_woods', priority: 8 },
  { pattern: /\bharp|\bmelody|\bsong|\bhummed|\brhythm/i, key: 'harp_music', priority: 9 },
  { pattern: /\bbakery|\bmuffin|\bbatter/i, key: 'bakery', priority: 10 },
  { pattern: /\bcinnamon|\bsteamed/i, key: 'muffin_food', priority: 8 },
  { pattern: /\bfox|\bfen\b/i, key: 'fox', priority: 10 },
  { pattern: /\bkite|\battic|\bwindless|\bwind\b/i, key: 'kite_sky', priority: 9 },
  { pattern: /\bgrandfather|\bgrandpa|\bporch/i, key: 'cottage', priority: 6 },
  { pattern: /\blighthouse|\bbeam|\bwaves|\bsea\b|\bsailors/i, key: 'lighthouse_sea', priority: 10 },
  { pattern: /\bpillows|\bdream-time|\bsilver fog|\bmoon planks/i, key: 'dream_fog', priority: 9 },
  { pattern: /\bpancakes|\bmorning came/i, key: 'muffin_food', priority: 6 },
  { pattern: /\bgnome|\bgranite|\bgarden\b/i, key: 'garden', priority: 9 },
  { pattern: /\bsunflower|\bsprouts|\bseedlings/i, key: 'garden', priority: 8 },
  { pattern: /\bsnail|\braindrops/i, key: 'snail', priority: 9 },
  { pattern: /\bpicnic|\bblooms/i, key: 'picnic', priority: 8 },
  { pattern: /\bchildren|\bneighbors|\bcheered|\bvillage/i, key: 'children_play', priority: 7 },
  { pattern: /\bwhisper|\bhello|\bsighed|\badmitted|\bblinked/i, key: 'whisper_talk', priority: 5 },
  { pattern: /\bbadger/i, key: 'forest_woods', priority: 7 },
  { pattern: /\bduckling|\bpond/i, key: 'brook_water', priority: 9 },
  { pattern: /\bschool|\bclassroom|\bmirror/i, key: 'children_play', priority: 8 },
  { pattern: /\bemma|\bnoah/i, key: 'forest_woods', priority: 7 },
  { pattern: /\bivy|\bmended/i, key: 'forest_woods', priority: 7 },
  { pattern: /\bstrawberr/i, key: 'garden', priority: 8 },
  { pattern: /\battic|\bmaps|\bticket stubs/i, key: 'attic', priority: 9 },
  { pattern: /\bflour|\bwinked/i, key: 'bakery', priority: 7 },
];

/** Text patterns → extra emojis (beyond protagonist) */
export const TEXT_TO_EMOJIS: { pattern: RegExp; emojis: string[]; priority: number }[] = [
  { pattern: /\bfirefl|\bglow|\bflicker|\blight/i, emojis: ['🪲', '✨'], priority: 10 },
  { pattern: /\bmoon|\bsilver|\blantern/i, emojis: ['🌙', '⭐'], priority: 9 },
  { pattern: /\bmeadow|\bdaisies|\bflower/i, emojis: ['🌸', '🌼'], priority: 8 },
  { pattern: /\bbrook|\bwater|\bwave/i, emojis: ['💧', '🌊'], priority: 8 },
  { pattern: /\byawn|\bdream|\bsleep|\bgoodnight/i, emojis: ['💤', '🌙'], priority: 9 },
  { pattern: /\bteacup|\bcocoa|\bcup\b/i, emojis: ['☕', '✨'], priority: 10 },
  { pattern: /\bqueen|\bcastle|\bcrown/i, emojis: ['👑', '🏰'], priority: 8 },
  { pattern: /\bcrack|\bstar/i, emojis: ['⭐', '✨'], priority: 7 },
  { pattern: /\bdragon|\bcloud/i, emojis: ['🐉', '☁️'], priority: 10 },
  { pattern: /\brainbow/i, emojis: ['🌈', '🎨'], priority: 10 },
  { pattern: /\bbrush|\bpaint/i, emojis: ['🖌️', '☁️'], priority: 8 },
  { pattern: /\bship|\bboat|\bsail/i, emojis: ['⛵', '☁️'], priority: 9 },
  { pattern: /\bharp|\bmusic|\bsong|\bhumm/i, emojis: ['🎵', '🎻'], priority: 9 },
  { pattern: /\bleaves|\bwoods|\bforest/i, emojis: ['🍃', '🌲'], priority: 8 },
  { pattern: /\bmuffin|\bbakery|\bbatter/i, emojis: ['🧁', '⭐'], priority: 10 },
  { pattern: /\bfox\b/i, emojis: ['🦊', '🌟'], priority: 10 },
  { pattern: /\bkite|\bwind/i, emojis: ['🪁', '💨'], priority: 10 },
  { pattern: /\blighthouse/i, emojis: ['🗼', '🌊'], priority: 10 },
  { pattern: /\bpillow|\bdream|\bfog/i, emojis: ['☁️', '✨'], priority: 8 },
  { pattern: /\bgnome|\bgarden|\bsprout/i, emojis: ['🧚', '🌱'], priority: 9 },
  { pattern: /\bsnail|\brain/i, emojis: ['🐌', '🌧️'], priority: 9 },
  { pattern: /\bpicnic/i, emojis: ['🧺', '🌻'], priority: 8 },
  { pattern: /\bhello|\bwhisper|\btalk/i, emojis: ['💬', '✨'], priority: 5 },
  { pattern: /\bcheer|\blaugh|\bhome!/i, emojis: ['🎉', '🏠'], priority: 8 },
  { pattern: /\bkindness|\bwarmth|\bkind/i, emojis: ['💛', '✨'], priority: 7 },
  { pattern: /\bbadger/i, emojis: ['🦡', '🌰'], priority: 8 },
  { pattern: /\bmouse|\bbrother/i, emojis: ['🐭', '💛'], priority: 8 },
  { pattern: /\bduckling|\bpond|\bswim/i, emojis: ['🐥', '💧'], priority: 9 },
  { pattern: /\bschool|\bclass|\bpaw\b/i, emojis: ['🏫', '📚'], priority: 8 },
  { pattern: /\bemma|\bnoah/i, emojis: ['👧', '👦'], priority: 8 },
  { pattern: /\baria|\bgrandpa/i, emojis: ['👧', '👴'], priority: 8 },
  { pattern: /\bmarina|\bjules/i, emojis: ['👧', '👦'], priority: 8 },
  { pattern: /\bblinked back/i, emojis: ['🪲', '💬'], priority: 9 },
];

/** Mood patterns → animation */
export const TEXT_TO_ANIMATION: { pattern: RegExp; animation: SceneAnimation; priority: number }[] = [
  { pattern: /\btwinkle|\bshimmer|\bglow|\blantern|\bsparkle|\bconstellation|\bstar/i, animation: 'twinkle', priority: 10 },
  { pattern: /\bcheer|\blaugh|\bhome!|\bjoyful|\bdelight|\bcelebrat|\bgrinned|\bwoohoo/i, animation: 'bounce', priority: 9 },
  { pattern: /\bhopped|\bran|\bsailed|\bdrift|\bwind|\bclimb|\bstepped|\bflutter|\bfluttered|\bsoared/i, animation: 'drift', priority: 8 },
  { pattern: /\bheart|\bkind|\bwarm|\bhug|\bheld|\bcupped|\bpromise/i, animation: 'pulse', priority: 8 },
  { pattern: /\btree|\bleaves|\bbranch|\bsway|\bwillow|\bhummed|\bmelody|\bsang/i, animation: 'sway', priority: 8 },
  { pattern: /\bsleep|\byawn|\bdream|\blullaby|\bquiet|\bbedtime|\bnight\b/i, animation: 'float', priority: 9 },
  { pattern: /\bwhisper|\btired|\btrembl|\bsighed|\bworried/i, animation: 'float', priority: 7 },
];

/** Setting patterns → gradient */
export const TEXT_TO_GRADIENT: { pattern: RegExp; gradient: [string, string]; priority: number }[] = [
  { pattern: /\bmoon|\bnight|\bsilver|\bstarry/i, gradient: ['#1e1b4b', '#6B4CE6'], priority: 10 },
  { pattern: /\bbrook|\bwater|\bwave|\bsea|\bocean|\blighthouse/i, gradient: ['#0c4a6e', '#38bdf8'], priority: 9 },
  { pattern: /\bforest|\bwoods|\bmoss|\bgarden|\bsprout/i, gradient: ['#14532d', '#4ade80'], priority: 9 },
  { pattern: /\bbakery|\bcocoa|\bmuffin|\bkitchen|\bcottage/i, gradient: ['#92400e', '#fbbf24'], priority: 8 },
  { pattern: /\bcloud|\bsky|\brainbow|\bkite/i, gradient: ['#0ea5e9', '#a78bfa'], priority: 8 },
  { pattern: /\bqueen|\bcastle|\bgold|\bcrown/i, gradient: ['#78350f', '#f59e0b'], priority: 7 },
  { pattern: /\bwarm|\bkind|\bheart/i, gradient: ['#be185d', '#f9a8d4'], priority: 6 },
];

export const THEME_FALLBACK_GRADIENT: Record<string, [string, string]> = {
  bedtime: ['#2D1B69', '#6B4CE6'],
  friendship: ['#ec4899', '#a78bfa'],
  courage: ['#ea580c', '#dc2626'],
  kindness: ['#f472b6', '#c4b5fd'],
  adventure: ['#0284c7', '#22c55e'],
  nature: ['#166534', '#86efac'],
};
