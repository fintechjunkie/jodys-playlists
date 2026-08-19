# Pin Copy Library — Halloween Party, Actually Scary

All fifty supplied lines, kept in full so nothing is lost. Format is
**headline / subline**.

- **IN USE** — in `PIN_COPY` in `lib/pins.ts` and assigned to an image
- **IN LIBRARY** — in `PIN_COPY`, no image assigned yet
- unmarked — supplied but not yet added to the library

Selection favoured **short headlines** (they set very large) and **different angles
from their neighbours**, since near-duplicate pins compete with each other in the
same feed.

---

## Board 1 — Halloween Party Ideas (1–20)

Broadest search intent, so these lean utility and problem-solving.
Banner: charcoal. Recommended treatment: `rule`.

| # | Headline / Subline | Status |
|---|---|---|
| 1 | No Monster Mash / 26 songs that actually feel like the night | **IN USE** -> pin-19 (retro supermarket lot) |
| 2 | Your party dies at 9pm / It's not the snacks. It's the playlist. | **IN USE** → pin-03 (charcuterie board) |
| 3 | Nobody wants to DJ their own party / Press play at 8 and never touch it again | **IN USE** → pin-02 (floating pumpkins) |
| 4 | 26 songs. Four hours. No skips. / Sequenced dusk to after midnight | **IN LIBRARY** as `26-songs-two-hours` - runtime corrected |
| 5 | You planned everything but this / The free playlist your Halloween party is missing | **IN USE** → pin-05 (autumn door) |
| 6 | Zero Thriller / A Halloween playlist for adults | **IN USE** -> pin-18 (bus-stop pumpkin) |
| 7 | The one thing guests actually remember / And it isn't the decorations | **IN USE** -> pin-16 (ghost with a leaf blower) |
| 8 | Stop scrolling for a playlist / Someone already sequenced it for you | **IN USE** → pin-08 (pumpkin in a washing machine) |
| 9 | Halloween party, actually scary / Dark pop, goth, industrial, alt. 26 tracks. | |
| 10 | Set it and let it run the room / Four acts, dusk to last guest | ⚠ see runtime note |
| 11 | For the host who hates hosting / One tap and the night runs itself | **IN LIBRARY** |
| 12 | Your costume is great / Your playlist is not. Free fix inside. | **IN USE** -> pin-15 (dog in a bat costume) |
| 13 | Adults only Halloween party / No novelty songs. Not one. | **IN LIBRARY** |
| 14 | Track 13 is when it turns / 26 songs sequenced to build all night | ✓ accurate |
| 15 | Halloween party checklist / Candles, drinks, and the part everyone forgets | |
| 16 | The playlist is always the weak part / Not this year | |
| 17 | Nobody dances until track 13 / That's on purpose | **IN LIBRARY** · ✓ accurate |
| 18 | 47 minutes to party ready / Here's what to play while you set up | ⚠ belongs to Rage Clean, not this playlist |
| 19 | Small party, big atmosphere / You don't need decorations if the sound is right | **IN LIBRARY** |
| 20 | Halloween party ideas that aren't orange / Start with what people hear | |

## Board 2 — Moody Halloween Aesthetic (21–35)

Atmosphere board. Lower click rate, higher save rate, which is the point.
Banner: cream. Recommended treatment: `bare`.

| # | Headline / Subline | Status |
|---|---|---|
| 21 | Black candles, dark florals / The playlist that matches the tablescape | **IN USE** → pin-04 (candles, dark roses, library) |
| 22 | You got the aesthetic right / Now get the sound right | **IN USE** → pin-11 (minimal interior, black pancakes) |
| 23 | Elegant, not costume shop / A Halloween playlist with taste | **IN USE** → pin-06 (black cake with bats) |
| 24 | The room already looks like this / Make it sound like it too | **IN LIBRARY** |
| 25 | Songs that feel like the night, not the costume / 26 tracks, sequenced | |
| 26 | Gothic, not gimmicky / Dark pop and goth for October nights | **IN LIBRARY** |
| 27 | For the last week of October / When the light goes early and you don't mind | **IN USE** -> pin-14 (pram, golden-hour street) |
| 28 | Candlelight and something underneath it / A playlist for the mood you already built | **IN LIBRARY** |
| 29 | Dark academia Halloween / Sound design for a room like this | **IN LIBRARY** |
| 30 | Nothing plastic. Nothing orange. / Twenty six songs that earned the atmosphere | **IN LIBRARY** |
| 31 | Moody Halloween done properly / Starts quiet. Doesn't stay quiet. | |
| 32 | October is a feeling / Here's what it sounds like | **IN USE** → pin-10 (pumpkin house) |
| 33 | Oxblood, brass, and bare branches / The playlist that goes with it | **IN LIBRARY** |
| 34 | The house before anyone arrives / Play this while you light the candles | **IN USE** → pin-01 (black cake, empty kitchen) |
| 35 | Beautiful and slightly wrong / A Halloween playlist with actual taste | **IN USE** → pin-09 (levitating place settings) |

## Board 3 — Halloween Party Playlists (36–50)

Most commercial board. Highest search intent, most direct.
Banner: magenta. Recommended treatment: `band`.

| # | Headline / Subline | Status |
|---|---|---|
| 36 | Halloween playlist that doesn't embarrass you / 26 songs. Free on Spotify. | **IN LIBRARY** |
| 37 | Sequenced, not shuffled / Four acts from arrival to comedown | **IN LIBRARY** |
| 38 | Save this before October / You will forget and then it will be too late | **IN USE** -> pin-17 (poolside skeleton) |
| 39 | Goth Halloween party playlist / Bauhaus to Nine Inch Nails, properly ordered | **IN LIBRARY** |
| 40 | Industrial, goth, dark pop / The Halloween playlist for people with taste | **IN LIBRARY** |
| 41 | Track 22 is where it gets quiet / Sequenced to run the whole night | **IN LIBRARY** - accurate |
| 42 | Every Halloween playlist is the same 11 songs / This one isn't | **IN USE** → pin-07 (retro novelty kitchen) |
| 43 | Free Halloween playlist / No sign up. Just press play. | **IN USE** → pin-12 (desert pool) |
| 44 | Four hours, zero babysitting / Dusk to after midnight, already ordered | ⚠ see runtime note |
| 45 | The comedown matters too / Act four is for the people still on the floor | **IN LIBRARY** - accurate |
| 46 | Nu metal Halloween playlist / Deftones, Korn, Rob Zombie and more | **IN LIBRARY** - see genre note |
| 47 | For a party that's actually a little scary / 26 songs, no novelty tracks | |
| 48 | Halloween night, home alone, lights off / This is the playlist | **IN LIBRARY** |
| 49 | Curated by a musician / Not generated by an algorithm | **IN USE** → pin-13 (pool, close) |
| 50 | Made by Jody Lynn / Her songs are 4, 8, 15 and 22 | **IN LIBRARY** · ✓ verified |

---

## Accuracy notes

Checked against the real tracklist in `lib/playlists.ts`. Re-check these if the
playlist is ever re-sequenced.

**Verified correct:**

- **#50** — Jody's tracks are at 4 (Dearly Departed), 8 (The Hunted), 15 (Undertow)
  and 22 (DARK). Exact.
- **#17 / #14** — track 13 is Dragula, the first track of Act III, "The Peak / This
  is the dancefloor." Both lines land.
- **#41** — track 22 is in Act IV, "After Midnight / Comedown, eerier".
- **#45** — Act IV is indeed the comedown.
- **#46** — Deftones, Korn and Rob Zombie are all on it. Note the playlist is
  broader than nu metal (Bauhaus, Portishead, The Cure, Angelo Badalamenti), so this
  line narrows the pitch — fine as a targeted pin, misleading as the main one.

**⚠ Runtime overstated — #4, #10, #44.** #4 is now in the library in its
corrected form as `26-songs-two-hours`; #10 and #44 are still unfixed.

**Original note:** Twenty-six songs is roughly **1h45m–2h**,
not four hours. "26 songs. Two hours. No skips." is accurate and just as strong.
Worth fixing before any of these run as paid creative.

**⚠ Wrong playlist — #18.** "47 minutes to party ready" is The 47 Minute Rage Clean's
hook, not this playlist's. Keep it for that campaign.

---

## Adding copy

1. Add the line to `PIN_COPY` in `lib/pins.ts` with a short kebab-case id and its
   board.
2. Assign it to an image in `pins` with the right `zone`.
3. `npm run pins`

`npm run pins` lists unassigned images alongside unused copy ids and prints
paste-ready entries, so it will tell you what is missing.

---

## Round 2 — second batch of images

Six suburban / comic photographs (`pin-14` to `pin-19`), a different register from
the first batch's gothic interiors, so copy was matched to the joke in the frame
rather than to the mood:

| Image | What it is | Line | Why |
|---|---|---|---|
| pin-14 | Pram with a jack-o'-lantern, golden-hour street | #27 For the last week of October | The light in the shot *is* the line |
| pin-15 | Dog in a bat costume, mid-air | #12 Your costume is great | Only pairing worth making |
| pin-16 | Ghost leaf-blowing a driveway at night | #7 The one thing guests actually remember | Decoration labour, under a line saying decorations aren't it |
| pin-17 | Poolside skeleton in full sun | #38 Save this before October | Reads as pre-season, which is when that line has to land |
| pin-18 | Lone pumpkin on a bus-stop bench, flat grey light | #6 Zero Thriller | Deadpan image, deadpan line |
| pin-19 | Child witch, giant pumpkin, retro supermarket lot | #1 No Monster Mash | The exact nostalgia Monster Mash owns, refused |

All six use `top` except **pin-19**, which uses `split` — the FRESH PRODUCE sign
sits at 27% height, so a top-30% band would cover it, and the empty asphalt below
the subject is the cleanest area in the frame.

Twenty of the previously unused lines are now in `PIN_COPY`, so the next batch of
images is assignment-only with no copywriting step.
