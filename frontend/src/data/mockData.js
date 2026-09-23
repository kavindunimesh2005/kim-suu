// Comprehensive Mock Data for Suchetha Kapuarachchi (Phase 01 UI)

export const authorData = {
  name: "Suchetha Kapuarachchi",
  name_si: "සුචේතා කපුආරච්චි",
  pen_name: "Kim Suu Ah",
  title_si: "කතුවරිය • ලේඛිකාව • කතන්දරකාරිය",
  title_en: "Author • Writer • Storyteller",
  portrait_image: "/assets/author-suchetha.jpg",
  signature_si: "සුචේතා කපුආරච්චි",
  quote_si: "කතා ලියන්නේ අකුරු වලින් නොව, මතක වලින්.",
  quote_en: "Stories are written not with letters, but with memories.",
  bio_summary_si: "මිනිස් ආත්මයේ නොකියූ හැඟීම්, සොබාදහමේ ගුප්ත සෞන්දර්යය සහ ශ්‍රී ලාංකීය සංස්කෘතික ගැඹුර අකුරු බවට පෙරළන ප්‍රකට ලේඛිකාවකි.",
  bio_summary_en: "A renowned Sri Lankan author who transforms the unsaid whispers of the human heart, the mystical poetry of nature, and rich cultural heritage into transcendent literary worlds.",
  full_bio_si: "සුචේතා කපුආරච්චි (කලාලෝකයේ 'Kim Suu Ah' නමින් ද හඳුන්වන) නූතන ශ්‍රී ලාංකීය සාහිත්‍ය ක්ෂේත්‍රයේ නව කඩඉමක් සනිටුහන් කළ ලේඛිකාවකි. ඇයගේ පළමු ප්‍රකට කෘතිය වන 'හුළු අත්ත' සොබාදහම සහ සන්සුන් ආදරය එකට මුසු වූ අපූර්ව ප්‍රබන්ධයක් වන අතර, දෙවන කෘතිය වන 'අරුංගල්' පාරම්පරික උරුමය, කැපවීම සහ උදාර ප්‍රේමය විදහාපාන කාව්‍යමය නවකතාවකි. ඇයගේ ලේඛන ශෛලිය සිනමාත්මක දෘශ්‍යමානත්වයකින් සහ ගැඹුරු චිත්තවේගීය ප්‍රකාශනයකින් අනූනය. සාහිත්‍යය යනු හුදු විනෝදාස්වාදය ඉක්මවා මනුෂ්‍යත්වය සුවපත් කරන මාවතක් බව ඇයගේ විශ්වාසයයි.",
  full_bio_en: "Suchetha Kapuarachchi (also celebrated in the literary sphere under the pen name 'Kim Suu Ah') represents a luminous voice in modern Sri Lankan literature. Her celebrated novels 'Hulu Aththa' and 'Arungal' have captivated thousands with their lyrical sensitivity, natural romanticism, and profound exploration of cultural identity and emotional sacrifice. For Suchetha, writing is not merely the craft of storytelling, but a sanctuary of empathy and an art that heals the human heart.",
  philosophy_si: "සෑම පොතක්ම කියවන්නාගේ හදවතට විවර වන නිහඬ කවුළුවකි. එහිදී ඔබ දකින්නේ මගේ වචන පමණක් නොව, ඔබේම ආත්මයේ ගැඹුරුම සේයාවන්ය.",
  philosophy_en: "Every book is a quiet window opened to the reader's heart. Looking through it, you discover not just my words, but the deepest reflections of your own soul.",
  achievements: [
    {
      year: "2024",
      title_si: "වසරේ විශිෂ්ටතම පාඨක ප්‍රසාදය දිනූ ප්‍රබන්ධය - හුළු අත්ත",
      title_en: "Readers' Choice Bestseller of the Year - Hulu Aththa"
    },
    {
      year: "2025",
      title_si: "විචාරක සම්මාන නිර්දේශය - අරුංගල්",
      title_en: "Literary Critics Award Nomination - Arungal"
    },
    {
      year: "2025",
      title_si: "යොවුන් සාහිත්‍ය නිර්මාණාත්මක දායකත්ව සම්මානය",
      title_en: "Creative Contribution to Youth Literature Award"
    }
  ],
  contact: {
    email: "contact@suchethakapuarachchi.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    instagram: "https://instagram.com/suchetha_kapu",
    facebook: "https://facebook.com/suchetha.author",
    goodreads: "https://goodreads.com/author/suchetha_kapuarachchi"
  }
};

export const booksData = [
  {
    id: "book-1",
    slug: "hulu-aththa",
    title_si: "හුළු අත්ත",
    title_en: "Hulu Aththa",
    author: "සුචේතා කපුආරච්චි (Suchetha Kapuarachchi)",
    subtitle_si: "මීදුම් පිරි කඳුකර කුටියක නිහඬ ප්‍රේමය",
    subtitle_en: "The Quiet Romance of a Mist-Veiled Mountain Cabin",
    genre: "Literary Fiction / Romantic Nature Drama",
    isbn: "978-955-3810-41-2",
    published_year: "2024",
    pages: 312,
    publisher: "Bharana Books",
    status: "published",
    cover_image: "/assets/huluaththa-cover.jpg",
    backdrop_image: "/assets/huluaththa-landscape.jpg",
    theme_id: "huluAththa",
    theme: {
      primary: "#718A68",
      secondary: "#A8B89C",
      background: "#F4F6ED",
      text: "#263126",
      accent: "#D9C7A3",
      name: "Light Green / Forest Literary Theme"
    },
    description_si: "කඳුකරයේ නිහඬ වැසි සන්ධ්‍යාවක ලී කුටියක් අසලින් ආරම්භ වන ආදරය, විරහව සහ සොබාදහමේ සුවදායක ස්පර්ශය කැටිවුණු සංවේදී සාහිත්‍ය කෘතියක්. කඳු මුදුන් සිපගන්නා සුදු මීදුමත්, වැව මැද පිපෙන නෙළුම් මලුත් පාඨකයාගේ හදවතට ගෙන එන්නේ කිසිදා අමතක නොවන නිස්කලංක සුවයකි.",
    description_en: "A deeply lyrical journey nestled within the misty mountains and tranquil lake cabin. Exploring the tenderness of unspoken longing and the healing grace of nature, Hulu Aththa immerses the reader into an atmospheric world where every pine whisper feels like a lover's verse.",
    full_description_si: "හුළු අත්ත යනු නූතන පාඨක සිත් සුවපත් කළ විශිෂ්ට කෘතියකි. සීතල කඳුකරයේ ලී කුටිය, ගස් මුදුන්වල පැද්දෙන පැරණි ඔංචිල්ලාව, සහ වැව මැදින් ඔරු පදින නිහඬ යොවුන් යුවළගේ බැඳීම කතුවරියගේ පන්හිඳෙන් දිගහැරෙන්නේ සිතුවමක් පරිද්දෙනි. ජීවිතයේ රළු බවින් පලාගොස් සිත නිවාගන්නට සොයන ඕනෑම කෙනෙකුට හුළු අත්ත අසමසම සාහිත්‍යමය ක්ෂේමභූමියකි.",
    full_description_en: "Hulu Aththa is an evocative literary romance celebrated for its atmospheric quietude. Through the backdrop of a solitary cedar cabin, misty pine trails, a hand-tied rope swing, and rowboats on a mirror-like lake, Suchetha crafts a transcendent narrative about rediscovering love, peace, and oneself.",
    quotes: [
      {
        quote_si: "සමහර දේවල් අපිට අයිති වෙන්නේ ඒවා අතහැරියාට පස්සෙයි.",
        quote_en: "Some things truly become ours only after we have learned to let them go.",
        context: "හුළු අත්ත - පරිච්ඡේදය 4"
      },
      {
        quote_si: "මීදුම කන්ද වැළඳගන්නේ එය සඟවන්නට නොව, එහි හුදෙකලාවට ආදරය කරන්නටය.",
        quote_en: "The mist embraces the mountain not to conceal it, but to love its quiet solitude.",
        context: "හුළු අත්ත - පරිච්ඡේදය 11"
      }
    ],
    highlights: [
      "ස්වභාවධර්මයේ සුවපත් කිරීමේ රිද්මය මුසු වූ සාහිත්‍ය නිර්මාණයක්",
      "ශ්‍රී ලංකාවේ වසරේ වැඩිම පාඨක ආකර්ෂණයක් දිනූ නවකතාවක්",
      "සිනමාත්මක පරිසර වර්ණනා සහ ගැඹුරු සංවේදී ආඛ්‍යානය"
    ],
    gallery_assets: [
      {
        image: "/assets/huluaththa-landscape.jpg",
        caption_si: "හුළු අත්ත නිම්නයේ වැව හා ලී කුටිය",
        caption_en: "The Lake & Mountain Cabin of Hulu Aththa"
      },
      {
        image: "/assets/cabin-cutout.png",
        caption_si: "කඳුකරයේ හුදෙකලා ලී කුටිය",
        caption_en: "The Secluded Timber Cabin"
      },
      {
        image: "/assets/tree-swing.png",
        caption_si: "මතක ඔංචිල්ලාව",
        caption_en: "The Swing of Whispering Memories"
      },
      {
        image: "/assets/green-butterfly.png",
        caption_si: "හුළු අත්ත නිම්නයේ හරිත සමනලයා",
        caption_en: "The Emerald Butterfly of the Valley"
      },
      {
        image: "/assets/lake-boat-watercolor.png",
        caption_si: "නෙළුම් විල මැද ඔරු පැදීම",
        caption_en: "Drifting on the Lotus Waters"
      }
    ],
    order_available: true,
    price_lkr: 1450,
    reviews: [
      {
        reviewer: "නිර්මලා විජේසිංහ (සාහිත්‍ය විචාරිකා)",
        rating: 5,
        comment_si: "සිංහල නවකතා කලාව තුළ මෑත යුගයේ හමුවූ ඉතාම සුන්දර, ආත්මීය හා සුවදායක කියවීමක්.",
        comment_en: "One of the most soul-stirring, lyrical and comforting reads in contemporary Sri Lankan literature."
      },
      {
        reviewer: "කසුන් රාජපක්ෂ",
        rating: 5,
        comment_si: "හුළු අත්ත කියවා අවසන් වන විට මාත් ඒ කඳුකරයේ ලී කුටිය අසල ජීවත් වුණා වැනි හැඟීමක් දැනුණා.",
        comment_en: "By the time I finished reading, it felt as if I had truly lived by that lakeside wooden cabin."
      }
    ]
  },
  {
    id: "book-2",
    slug: "arungal",
    title_si: "අරුංගල්",
    title_en: "Arungal",
    author: "සුචේතා කපුආරච්චි (Suchetha Kapuarachchi)",
    subtitle_si: "පාරම්පරික අරුංගලය සහ පරම්පරා යාකළ ශුද්ධ ප්‍රේමය",
    subtitle_en: "The Heritage Earring & The Sacred Romance of Generations",
    genre: "Cultural Romance / Literary Drama",
    isbn: "978-955-4921-02-9",
    published_year: "2025",
    pages: 368,
    publisher: "Grantha Publishers Sri Lanka",
    status: "published",
    cover_image: "/assets/arungal-cover.png",
    backdrop_image: "/assets/arungal-couple.jpg",
    theme_id: "arungal",
    theme: {
      primary: "#6B4632",
      secondary: "#8B6349",
      background: "#F3E9DD",
      text: "#2E211A",
      accent: "#B68A5A",
      name: "Warm Brown / Earthy Literary Theme"
    },
    description_si: "නෙළුම් මලින් හැඩවැඩ වූ රන්වන් අරුංගලයක සැඟවුණු ඉපැරණි රහසක්, අභිමානවත් උරුමයක් සහ හදවත් දෙකක බැඳීමක් වටා ගෙතුණු සදාතනික ප්‍රේම කාව්‍යයයි. සාම්ප්‍රදායික ශ්‍රී ලාංකීය සංස්කෘතික රිද්මයත්, ගැඹුරු සංවේදී ප්‍රේමයත් මනාව මුසු කරමින් පාඨකයා සිනමාත්මක ගමනකට රැගෙන යයි.",
    description_en: "Centered around an intricate heirloom lotus earring passed across generations, Arungal weaves a rich cultural romance of sacred vows, honor, unspoken longing, and a love that transcends societal boundaries in royal and traditional Sri Lankan society.",
    full_description_si: "අරුංගල් යනු සිංහල සභ්‍යත්වයේ ගෞරවාන්විත චමත්කාරය සහ යොවුන් ප්‍රේමයේ සදාතනික උද්වේගය මනාව චිත්‍රණය කරන විශිෂ්ට කෘතියකි. නෙළුම් මලක හැඩය ගත් මාණික්‍ය ඔබ්බවන ලද අරුංගලය සංකේතවත් කරන්නේ ගැහැනියකගේ ආත්ම ශක්තිය සහ පාරිශුද්ධ ප්‍රේමයයි. සුචේතා කපුආරච්චිගේ ගැඹුරු චරිත නිරූපණය සහ සජීවී ආඛ්‍යානය පාඨකයා මන්මත් කරවයි.",
    full_description_en: "Arungal is a tribute to heritage, grace, and unbreakable love. Through the iconic lotus-jeweled jhumka, the narrative unravels generations of sacrifices, emotional resilience, and an undying love story that echoes through palace corridors and fragrant temple courtyards.",
    quotes: [
      {
        quote_si: "අරුංගලයක බර දරන්නේ කන පමණක් නොවේ; එය මුළු පරම්පරාවකම ආදරයේ සහ කැපවීමේ බරයි.",
        quote_en: "An earring bears not just the weight of gold, but the weight of generations of love and sacrifice.",
        context: "අරුංගල් - පරිච්ඡේදය 7"
      },
      {
        quote_si: "ඇගේ නෙතඟ රැඳි කඳුළු බිඳුව තුළත් දිදුලුවේ ඒ රන් අරුංගලයේ බැබළීමයි.",
        quote_en: "Even in the tear that rested at the corner of her eyes, the golden luster of the arungal gleamed.",
        context: "අරුංගල් - පරිච්ඡේදය 14"
      }
    ],
    highlights: [
      "සාම්ප්‍රදායික උරුමය සහ පෞරාණික ශ්‍රී ලාංකීය පසුබිම",
      "සිනමාත්මක ගලායාම සහ අතිශය සංවේදී ප්‍රේම අත්දැකීම",
      "පාඨක ප්‍රසාදය නොමඳව දිනූ ප්‍රශස්ත නවකතාවක්"
    ],
    gallery_assets: [
      {
        image: "/assets/arungal-couple.jpg",
        caption_si: "අරුංගල් චරිත ප්‍රේම දැක්ම",
        caption_en: "The Cinematic Romance of the Protagonists"
      },
      {
        image: "/assets/arungal-jhumka.png",
        caption_si: "නෙළුම් මාණික්‍ය රන් අරුංගලය",
        caption_en: "The Heirloomed Lotus Ruby Jhumka"
      },
      {
        image: "/assets/arungal-hands.png",
        caption_si: "අත් මඟුලට අරුංගල් පිදීම",
        caption_en: "The Sacred Offering of the Lotus Earring"
      },
      {
        image: "/assets/pink-lotus.png",
        caption_si: "අරුංගල් සංකේතවත් නෙළුම් මල",
        caption_en: "The Sacred Lotus of Purity & Royalty"
      },
      {
        image: "/assets/red-mandala.png",
        caption_si: "සාම්ප්‍රදායික ලියවැල මෝස්තරය",
        caption_en: "The Traditional Sri Lankan Red Mandala"
      }
    ],
    order_available: true,
    price_lkr: 1650,
    reviews: [
      {
        reviewer: "මහාචාර්ය ආනන්ද සෙනෙවිරත්න",
        rating: 5,
        comment_si: "පාරම්පරික සාරධර්ම සහ සංවේදී ප්‍රේමය මෙතරම් අපූරුවට එකට ගැටගැසූ වෙනත් කෘතියක් මෑතකදී හමු වී නැත.",
        comment_en: "A rare masterpiece that seamlessly interweaves ancestral legacy and delicate emotional romance."
      },
      {
        reviewer: "සඳමාලි ද සිල්වා",
        rating: 5,
        comment_si: "අරුංගල් කියවා මගේ දෙනෙතට කඳුළු ආවා. සුචේතාගේ ලිවීම හදවතටම කතා කරනවා.",
        comment_en: "Arungal brought tears to my eyes. Suchetha's writing speaks straight to the depths of the soul."
      }
    ]
  }
];

export const storiesData = [
  {
    id: "story-1",
    title_si: "ඔංචිල්ලාවේ මතකය",
    title_en: "Memory of the Swing",
    category: "Poems",
    category_si: "කවි",
    date: "2026-09-01",
    cover_image: "/assets/tree-swing.png",
    excerpt_si: "ගස් අතු පතරින් හිරු එබෙනා සඳ... සුළඟේ පාවී සිනාසුනා ඔබ...",
    excerpt_en: "As dawn filters through emerald leaves, your gentle laugh rides the whispering breeze...",
    content_si: `ගස් අතු පතරින් හිරු එබෙනා සඳ
සුළඟේ පාවී සිනාසුනා ඔබ
පැරණි ලණුවේ රැඳි පාළුව මැද
තවමත් පැද්දෙයි අපේ මතකය...

අතු අග පිපුණු වනමල් සුවඳින්
මුළු නිම්නයම සුවපත් වෙද්දී
නුඹේ දෑතේ උණුසුම සොයමින්
වැසි බිඳු වැටුණා ලී කුටිය මතට.

සමහර මතක කවදාවත් දිරාපත් වෙන්නේ නෑ.
ඒවා ගස් මුල් මෙන් පොළවට කිඳාබැහැලා
අපේ හුස්මටත් වඩා ගැඹුරට ජීවත් වෙනවා.`,
    content_en: `As dawn filters through emerald leaves,
Your gentle laugh rides the whispering breeze.
Upon the frayed hemp of the silent swing,
Our timeless memories quietly sway and sing.

With wild blossom perfume that stirs the glade,
Where shadows and morning sunbeams played,
My fingers still trace the lingering trace
Of raindrops upon our wooden space.

Some memories never surrender to the soil.
They root like ancient banyan veins,
Breathing deeper than our own quiet breaths.`
  },
  {
    id: "story-2",
    title_si: "නෙළුම් පෙත්තක ලියූ ප්‍රේමය",
    title_en: "Love Penned on a Lotus Petal",
    category: "Excerpts",
    category_si: "උපුටා ගැනීම්",
    date: "2026-08-20",
    cover_image: "/assets/pink-lotus.png",
    excerpt_si: "නෙළුම් මල් පිරි විල මැදින් ඔරුව නිහඬව ලිස්සා ගියේය. 'ඔබ ආපසු එනවාද?' ඇය ඇසුවාය...",
    excerpt_en: "The wooden boat drifted weightlessly through water lilies. 'Will you return with the rain?' she whispered...",
    content_si: `නෙළුම් මල් පිරි විල මැදින් ඔරුව නිහඬව ලිස්සා ගියේය. ජල තලයේ ඇඳුනු තරංග මෙන් අපේ සිත් තුළ ද නොකියූ ආදරයක සෙවණැලි සෙමින් සෙලවිණි. 

'ඔබ ආපසු එනවාද?' ඇය ඇසුවේ දිය බිඳිති අතින් ස්පර්ශ කරමිනි. 

'නෙළුම් මල් පිපෙන සෑම වසන්තයකම මම ඔබේ හදවත ළඟ නවතිමි.' ඔහු පිළිතුරු දුන්නේය. 

ජල බිංදුවක් නෙළුම් පත මත නොරැඳී රූරා වැටෙන්නාක් මෙන්, සමහර සමුගැනීම් වේදනාකාරී නමුත් සුන්දරය. ජීවිතය අපව ඈත් කළ ද, හදවත් එකිනෙක බැඳී ඇත්තේ භවයෙන් භවයට ගලායන නිහඬ පොරොන්දුවකිනි.`,
    content_en: `The wooden boat drifted weightlessly through the bed of blossoming water lilies. Like ripples kissing the shoreline, waves of unspoken devotion stirred between them.

'Will you return with the rain?' she whispered, letting her fingertips trace the cool water.

'With every season the sacred lotus blooms, my soul shall always find its sanctuary beside you,' he replied.

Just as a droplet dances upon a lotus petal without ever being bound by it, some partings carry both agony and eternal beauty. Though the world draws our footsteps apart, our souls remain bound by an ancient, unspoken covenant.`
  },
  {
    id: "story-3",
    title_si: "කඳුකර ලී කුටිය",
    title_en: "The Mountain Log Cabin",
    category: "Stories",
    category_si: "කෙටි කතා",
    date: "2026-07-15",
    cover_image: "/assets/cabin-cutout.png",
    excerpt_si: "හැන්දෑවේ අඳුර වැටෙන විට ඒ පුංචි ලී කුටියේ පහන් එළිය දැල්වුණේ මුළු නිම්නයටම උණුසුම බෙදමිනි...",
    excerpt_en: "As evening shadows kissed the rolling hills, the amber lamp flared to life, shedding warmth...",
    content_si: `හැන්දෑවේ අඳුර වැටෙන විට ඒ පුංචි ලී කුටියේ පහන් එළිය දැල්වුණේ මුළු නිම්නයටම උණුසුම බෙදමිනි. චිමිනියෙන් නැගෙන සුදු දුම් රොටු වනාන්තරයේ සීතල මීදුම සමඟ මුසු විය. 

මෙහි පැමිණි කිසිවෙකුට ලෝකයේ ශෝකයන් මතක හිටියේ නැත. ලී කුටියේ බිත්ති වල තිබුණේ වචන වලින් විස්තර කළ නොහැකි ආදරය සහ සාමයේ සුවඳයි.

වැසි දිය දොරකඩ රැඳී හඬන විට, උණුසුම් තේ කෝප්පයක් අතැතිව ජනේලයෙන් පිටත බලා සිටීම තරම් සුවදායක තවත් කිසිවක් මේ මිහිපිට නැත. ලී කුටිය කියන්නේ හුදු වාසස්ථානයක් නොවේ; එය තුවාල වූ ආත්මයන් සුවපත් කරන මෘදු ඔසුවකි.`,
    content_en: `As evening shadows kissed the rolling hills, the amber lamp of the timber cabin flared to life, shedding warmth across the silent valley. Curls of woodsmoke dissolved into mountain mist.

In that secluded haven, worldly sorrow ceased to matter. Within its cedar walls lingered the untranslatable scent of peace and enduring romance.

When rain taps upon the eaves and you cradle a cup of spiced Ceylon tea by the window, the restless heart remembers how to still itself. The log cabin was never merely a dwelling; it was an apothecary for wounded wanderers.`
  },
  {
    id: "story-4",
    title_si: "ආභරණයක ආත්මය",
    title_en: "Soul of the Adornment",
    category: "Literary Notes",
    category_si: "සාහිත්‍යමය සටහන්",
    date: "2026-06-30",
    cover_image: "/assets/arungal-jhumka.png",
    excerpt_si: "අරුංගලයක් යනු ලෝහමය සැරසිල්ලක් පමණක් නොවේ. එය මුහුණක සිනහවට සහ පාරිශුද්ධ ආත්මයට සාක්ෂිකරුවෙකි...",
    excerpt_en: "A traditional earring is more than ornate metalwork. It is an intimate witness to whispers of joy...",
    content_si: `අරුංගලයක් යනු ලෝහමය සැරසිල්ලක් පමණක් නොවේ. එය මුහුණක සිනහවට, කනෙහි ස්පර්ශයට සහ ගැහැනු ළමයෙකු යුවතියක වන සුන්දර පරිවර්තනයට සාක්ෂිකරුවෙකි. 

ඔබ රන්වන් අරුංගලයක් දෙස බලන විට, එහි නිහඬ කතාවට කන් දෙන්න. එහි රැඳී ඇත්තේ මවක තම දියණියට දුන් ආශිර්වාදයයි; ප්‍රේමවන්තයෙකු තම සහකාරියට දුන් සදාතනික පොරොන්දුවයි. රන් භාණ්ඩ කවදා හෝ දියවී යා හැක; නමුත් ආභරණයකට පෙවූ ආදරයේ ආත්මය කිසිදා දියවන්නේ නැත.`,
    content_en: `A traditional earring is more than ornate metalwork. It is an intimate witness to whispers of joy, the grace of movement, and a girl's blooming into sacred womanhood.

When you gaze upon an heirloom arungal, listen closely to its quiet history. In its curve rests a mother's silent prayer for her daughter; in its gem rests a lover's timeless promise. Gold may one day yield to time, but the soul breathed into a sacred adornment remains eternal.`
  },
  {
    id: "story-5",
    title_si: "සමනල් පියපත් සහ සදාතනික බලාපොරොත්තුව",
    title_en: "Butterfly Wings & Eternal Hope",
    category: "Quotes",
    category_si: "උපුටනයන්",
    date: "2026-05-18",
    cover_image: "/assets/green-butterfly.png",
    excerpt_si: "සමනලයෙකු මලක් කරා පියාසර කරන්නේ මලට රිදවීමට නොවේ; එහි සුවඳ තවත් තැනකට රැගෙන යාමටයි...",
    excerpt_en: "A butterfly grazes the petal not to bruise the flower, but to carry its fragrance into eternity...",
    content_si: `සමනලයෙකු මලක් කරා පියාසර කරන්නේ මලට රිදවීමට නොවේ; එහි සුවඳ තවත් තැනකට රැගෙන යාමටයි. 

ප්‍රේමයද එසේ විය යුතුය. එය කිසිවෙකු සිරකර තබන්නේ නැත. එය කරන්නේ නිදහසේ පියාපත් සලන්නට ඉඩ හරිමින්, හදවතේ සුන්දරත්වය ලොව පුරා විසුරුවා හැරීමයි. කුඩා හරිත සමනලයෙකු දුටු විට පවා ඔබේ හදවත සතුටින් පිරෙන්නේ ඒ නිසාය.`,
    content_en: `A butterfly grazes the petal not to bruise the flower, but to carry its fragrance into eternity.

True love was never meant to be a cage. It bestows wings to soar, scattering gentleness across quiet skies. Perhaps that is why even the flutter of a solitary emerald butterfly stirs an inexplicable joy within our hearts.`
  }
];

export const blogPostsData = [
  {
    id: "blog-1",
    slug: "writing-hulu-aththa-forest-whispers",
    title_si: "හුළු අත්ත ලියූ හැටි: මීදුම් පිරි කඳුවැටියක් දුන් නිහඬ ආශ්වාදය",
    title_en: "Writing Hulu Aththa: The Quiet Inspiration of Mist-Clad Mountains",
    excerpt_si: "ලී කුටියක නිහඬ ජනේලයෙන් පිටත බලා සිටියදී දැනෙන සුළඟට පුළුවන් කෙනෙකුගේ හිතේ තියෙන සියලු කැළඹීම් නිවාලන්න...",
    excerpt_en: "Looking through the wooden window of a rustic mountain cabin, the cool breeze carries the power to calm every storm...",
    content_si: `ලී කුටියක නිහඬ ජනේලයෙන් පිටත බලා සිටියදී දැනෙන සුළඟට පුළුවන් කෙනෙකුගේ හිතේ තියෙන සියලු කැළඹීම් නිවාලන්න. හුළු අත්ත නවකතාවේ මුල්ම වචන පේළි කිහිපය උපන්නේ එවන් එක් වැසිබර සන්ධ්‍යාවකයි. මට අවශ්‍ය වුණේ හුදු කතාවක් කියන්න නොවෙයි; පාඨකයාට ඒ වනාන්තරයේ තෙතමනයත්, ලී ඔංචිල්ලාවේ ගැස්මත්, පරිසරයේ නිහඬතාවත් සැබැවින්ම දැනෙන්නට සැලැස්වීමටයි.

ස්වභාවධර්මය කියන්නේ අපේ ජීවිතයේ හොඳම කැඩපත. මිනිස්සු එකිනෙකාට කියන්න බැරි ගැඹුරුම දේවල් ගස්කොළන් සහ ජලාශය හමුවේ මුදාහරිනවා. ඒ ආත්මීය බැඳීම තමයි හුළු අත්ත පිටුපස ඇති සැබෑ සාරය.

සෑම පිටුවක්ම ලියැවුණේ කඳුකරයේ නිහඬ බව මගේ හුස්මට මුසු කරගනිමිනි. ඔබ මේ පොත කියවන විට ඔබේ කාමරයේ ජනේලයෙන් ද ඒ මීදුම ගලා එනවා දැනේවි යැයි මම බලාපොරොත්තු වෙමි.`,
    content_en: `Looking through the wooden window of a rustic mountain cabin, the cool mountain breeze carries the power to calm the storm within any soul. The very first lines of Hulu Aththa were born on such a rain-washed evening. My deepest wish was not merely to narrate a plot, but to let the reader breathe the moist fragrance of the pines, feel the gentle sway of the wooden swing, and hear the sacred silence of the mountain lake.

Nature remains humanity's truest mirror. The thoughts we hesitate to speak aloud to one another are effortlessly whispered to ancient trees and placid waters. That intimate communion is the very soul behind Hulu Aththa.

Each chapter was penned as the stillness of the peaks seeped into my breathing. As you hold these pages, I hope that gentle mountain mist drifts quietly across the borders of your own room.`,
    featured_image: "/assets/huluaththa-landscape.jpg",
    author: "Suchetha Kapuarachchi",
    date: "2026-08-15",
    category: "Literary Reflections",
    category_si: "සාහිත්‍යමය සිතුවිලි",
    tags: ["Hulu Aththa", "Nature", "Writing Journey", "Inspiration"],
    reading_time: "5 min",
    is_featured: true
  },
  {
    id: "blog-2",
    slug: "arungal-the-sacred-symbol-of-heritage",
    title_si: "අරුංගල්: උරුමයේ සංකේතය සහ ගැහැනියකගේ ආත්ම ශක්තිය",
    title_en: "Arungal: The Symbol of Heritage and the Strength of Womanhood",
    excerpt_si: "අපේ මුතුන්මිත්තන් පැළඳි ආභරණ කියන්නේ හුදු රත්තරන් හෝ මැණික් ගල් වලට පමණක් නෙවෙයි. ඒ ඇතුළේ පරම්පරා ගණනාවක ආදරය තිබුණා...",
    excerpt_en: "The ornaments worn by our ancestors were far more than gold and gemstones; encased within each heirloom were generations of devotion...",
    content_si: `අපේ මුතුන්මිත්තන් පැළඳි ආභරණ කියන්නේ හුදු රත්තරන් හෝ මැණික් ගල් වලට පමණක් නෙවෙයි. ඒ එක එක ආභරණයක් ඇතුළේ පරම්පරා ගණනාවක ආදරය, ගෞරවය, කඳුළු සහ කැපවීම් කැටිකරලා තිබුණා. 'අරුංගල්' නවකතාවේ ප්‍රධාන තේමාව වන නෙළුම් අරුංගලය මම තෝරාගත්තේ ඒ නිසයි.

නෙළුම් මල කියන්නේ මඩේ උපන්නත් පාරිශුද්ධව පිපෙන මලක්. කාන්තාවකගේ ආත්මයත් ඒ වගේ. කෙතරම් අභියෝග ආවත්, ඇය ආදරය සහ ගෞරවය වෙනුවෙන් නොසැලී සිටින ආකාරය අරුංගල් තුළින් මා චිත්‍රණය කළා.

ඉපැරණි රන් අරුංගලයක බර දරා සිටින දෑතක ඇති සංවේදී ශක්තිය ශ්‍රී ලාංකීය සංස්කෘතියේ අභිමානයයි. එය කතාවක් පමණක් නොව, අපේ අතීතයට කෙරෙන ගෞරවයකි.`,
    content_en: `The ornaments worn by our ancestors were far more than gold and gemstones; encased within each heirloom were generations of unspoken devotion, cultural honor, silent tears, and quiet sacrifices. That sacred legacy is why the lotus jhumka became the beating heart of my novel 'Arungal'.

Like the lotus that blossoms pure and radiant from murky depths, a woman's spirit navigates trials with unmatched grace. In Arungal, I wanted to celebrate that unwavering strength that protects true love against all societal storms.

The delicate yet unshakeable strength in hands holding an ancestral heirloom is the quiet pride of Sri Lankan heritage. Arungal was written not simply as fiction, but as an offering of reverence to the women before us.`,
    featured_image: "/assets/arungal-couple.jpg",
    author: "Suchetha Kapuarachchi",
    date: "2026-07-28",
    category: "Cultural Heritage",
    category_si: "සංස්කෘතික උරුමය",
    tags: ["Arungal", "Heritage", "Womanhood", "Romance"],
    reading_time: "6 min",
    is_featured: false
  },
  {
    id: "blog-3",
    slug: "the-art-of-quiet-storytelling",
    title_si: "නිහඬ ආඛ්‍යාන කලාව: වචන අතර ඇති ඉඩකඩේ සුන්දරත්වය",
    title_en: "The Art of Quiet Storytelling: The Beauty of the Space Between Words",
    excerpt_si: "බොහෝ දෙනෙක් සිතන්නේ හොඳ කතාවක් කියන්නේ නොනවත්වා සිදුවීම් පිරුණු එකක් කියායි. නමුත් මගේ විශ්වාසය නම් බලවත්ම දේ නිහඬතාව බවයි...",
    excerpt_en: "Many believe an enthralling narrative requires relentless drama. Yet I have always felt that the most profound moments reside in quiet pauses...",
    content_si: `බොහෝ දෙනෙක් සිතන්නේ හොඳ කතාවක් කියන්නේ නොනවත්වා සිදුවීම් පිරුණු එකක් කියායි. නමුත් මගේ විශ්වාසය නම්, කතාවක බලවත්ම අවස්ථා පවතින්නේ දෙබස් දෙකක් අතර ඇති නිහඬතාවය තුළ බවයි. චරිත දෙකක් එකිනෙකා දෙස බලා සිටින මොහොත, සුසුමක් හෙළන මොහොත, කොළයක් බිමට වැටෙන මොහොත පාඨකයාගේ සිත තුළ දෝංකාර දෙන්නේ ඒ නිහඬතාව නිසයි.

ලේඛකයෙකු ලෙස මම නිතරම උත්සාහ කරන්නේ පාඨකයාට කියවීමට මෙන්ම සිතීමටත් ඉඩක් ඉතිරි කර දීමටයි. හදිසි නොවන්න; මගේ අකුරු අතරින් ඔබ ඔබේම නිහඬ සිතුවිලි සොයාගන්න.`,
    content_en: `Many believe an enthralling narrative requires relentless drama. Yet I have always felt that the most profound moments in literature reside inside the quiet spaces between words. The pregnant pause between two characters, a gentle sigh under moonlight, or the flutter of an emerald leaf creates an echo far deeper than grand declarations.

As a writer, my artistic quest is to offer you not only words to read, but quiet spaces to feel, reflect, and discover your own sanctuary. Do not rush through the pages; wander gently, and let the silence speak to you.`,
    featured_image: "/assets/lake-boat-watercolor.png",
    author: "Suchetha Kapuarachchi",
    date: "2026-06-12",
    category: "Writing Craft",
    category_si: "ලේඛන කලාව",
    tags: ["Writing Craft", "Storytelling", "Literary Art", "Silence"],
    reading_time: "4 min",
    is_featured: false
  }
];

export const galleryItemsData = [
  {
    id: "gallery-1",
    title_si: "කතුවරිය සුචේතා කපුආරච්චි",
    title_en: "Author Suchetha Kapuarachchi",
    image: "/assets/author-suchetha.jpg",
    category: "Author Portrait",
    category_si: "කතුවරිය",
    caption_si: "සුචේතා කපුආරච්චිගේ සාහිත්‍යමය චිත්‍රණය සහ පෞද්ගලික සිනහව",
    caption_en: "Portrait of Suchetha Kapuarachchi, the poetic voice behind Hulu Aththa & Arungal"
  },
  {
    id: "gallery-2",
    title_si: "හුළු අත්ත නිල කවර නිර්මාණය",
    title_en: "Hulu Aththa Official Book Cover",
    image: "/assets/huluaththa-cover.jpg",
    category: "Book Covers",
    category_si: "පොත් කවර",
    caption_si: "මීදුම් පිරි කඳුකර කුටිය සහ සොබාදහම රැඳි හුළු අත්ත කවරය",
    caption_en: "The iconic watercolor book cover of Hulu Aththa featuring the lakeside cabin"
  },
  {
    id: "gallery-3",
    title_si: "අරුංගල් නිල කවර නිර්මාණය",
    title_en: "Arungal Official Book Cover",
    image: "/assets/arungal-cover.png",
    category: "Book Covers",
    category_si: "පොත් කවර",
    caption_si: "නෙළුම් මල් සරසන ලද රන් අරුංගලය සහිත නිල කවරය",
    caption_en: "The majestic brown and gold cover of Arungal with the lotus-adorned heroine"
  },
  {
    id: "gallery-4",
    title_si: "අරුංගල් සිනමාත්මක ප්‍රේම දැක්ම",
    title_en: "Arungal Cinematic Story Visual",
    image: "/assets/arungal-couple.jpg",
    category: "Literary Art",
    category_si: "කලාත්මක සිතුවම්",
    caption_si: "පාරම්පරික ඇඳුමෙන් සැරසුණු ප්‍රධාන චරිත ද්විත්වයේ සිනමාත්මක ආදර බැල්ම",
    caption_en: "Cinematic visual portrayal of the protagonists wearing traditional heirlooms"
  },
  {
    id: "gallery-5",
    title_si: "කඳුකර නිම්නයේ ලී කුටිය හා ජලාශය",
    title_en: "Mountain Cabin & Lake Landscape",
    image: "/assets/huluaththa-landscape.jpg",
    category: "Literary Art",
    category_si: "කලාත්මක සිතුවම්",
    caption_si: "හුළු අත්ත ලෝකයේ ප්‍රධාන පසුබිම් වූ සාමකාමී පරිසරය",
    caption_en: "The tranquil panoramic watercolor lake that inspired the setting of Hulu Aththa"
  },
  {
    id: "gallery-6",
    title_si: "නෙළුම් විල මැද ඔරු පැදීම",
    title_en: "Lotus Lake Boat Ride",
    image: "/assets/lake-boat-watercolor.png",
    category: "Illustrations",
    category_si: "සිතුවම්",
    caption_si: "යොවුන් යුවළක් නෙළුම් විල මැද ඔරුවක පාවී යන සිතුවම",
    caption_en: "Lyrical watercolor painting of youth in a wooden boat amidst lotus blooms"
  },
  {
    id: "gallery-7",
    title_si: "නෙළුම් මාණික්‍ය රන් අරුංගලය",
    title_en: "Lotus Ruby Heirloom Jhumka",
    image: "/assets/arungal-jhumka.png",
    category: "Artifacts",
    category_si: "පුරාවස්තු හා ආභරණ",
    caption_si: "අරුංගල් නවකතාවේ සංකේතාත්මක රාජකීය ආභරණය",
    caption_en: "The heirloom ruby lotus jhumka symbolizing maternal resilience and heritage"
  },
  {
    id: "gallery-8",
    title_si: "අත් මඟුලට අරුංගල් පිදීම",
    title_en: "The Hand Offering of the Arungal",
    image: "/assets/arungal-hands.png",
    category: "Artifacts",
    category_si: "පුරාවස්තු හා ආභරණ",
    caption_si: "විවාහ මඟුලේදී සාම්ප්‍රදායිකව අරුංගල් දෑතට පිළිගැන්වීම",
    caption_en: "Traditional ritual offering of the sacred arungal into henna-patterned hands"
  },
  {
    id: "gallery-9",
    title_si: "සොබාදහමේ මිතුරු මොහොත",
    title_en: "Moments in Nature: Puppy & Butterfly",
    image: "/assets/puppy-butterfly.png",
    category: "Writing Moments",
    category_si: "ලේඛන අවස්ථා",
    caption_si: "කතුවරියගේ ලේඛන විවේකයේ අහිංසක සුන්දරත්වය",
    caption_en: "Playful companionship and innocent joy from the author's writing retreat"
  }
];
