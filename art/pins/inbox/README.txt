DROP PINTEREST PIN ARTWORK HERE
==============================

Any filename works — pins are matched by name in lib/pins.ts, not by slug.
Something short helps: bat-candles.png, tablescape-01.png, doorway.png

Accepted: .jpg  .jpeg  .png  .webp
Shape: vertical 2:3 (1000 x 1500 is Pinterest's sweet spot). Aspect ratio is
PRESERVED and never cropped — you composed the quiet zone deliberately, and
cropping would slide the banner off it. Long edge is capped at 2000px, and
nothing is ever upscaled.

THE QUIET ZONE
--------------
Leave one area free of busy artwork, then tell the script which one:

    zone: "top"      banner across the TOP 30%
    zone: "middle"   banner across the MIDDLE 30%
    zone: "split"    TWO banners: headline in the top 20%,
                     subline in the bottom 20%

The banner is a solid flat block, so the artwork underneath it is covered — the
zone only needs to be free of anything you'd hate to lose.

WORKFLOW
--------
1. Drop images here.
2. Run:  npm run pins
   With no assignment yet, it lists every unassigned image, every unused line of
   copy, and prints a ready-to-paste entry for each.
3. Paste those into `pins` in lib/pins.ts and set the right zone per image.
4. Run `npm run pins` again. Finished pins land in art/pins/out/

COPY
----
Approved lines live in PIN_COPY in lib/pins.ts, keyed by a short id, five per
board:

    party-ideas       utility and problem-solving
    moody-aesthetic   atmosphere, save-optimised
    party-playlists   highest intent, most direct

Copy is kept separate from assignments so the same line can be tried on several
images without retyping it, and so approved wording lives in one place.

BANNER COLOUR
-------------
Defaults per board, so the three boards read as three campaigns rather than one
repeated template:

    party-ideas       charcoal banner, chartreuse headline, cream subline
    moody-aesthetic   cream banner, magenta headline, forest subline
    party-playlists   magenta banner, cream type

Override on any single pin with  banner: "charcoal" | "magenta" | "cream"

Type is Anton uppercase for the headline and Inter for the subline — the same
faces as the playlist covers and the website. Every pin also carries a small
JODY'S PLAYLISTS line above the headline.
