DROP COVER ART HERE
===================

Name each file after the playlist slug:

    actually-scary.png      ->  Halloween Party, Actually Scary
    revenge-dressing.png    ->  Revenge Dressing
    rage-clean.png          ->  The 47 Minute Rage Clean
    seventeen-again.png     ->  Feel Seventeen Again
    no-contact.png          ->  Day One Of No Contact

Accepted: .jpg  .jpeg  .png  .webp
Target size: 3000 x 3000 square. Bigger is fine. Output is capped at whatever
the source actually has, so a 1254px original ships at 1254px rather than being
upscaled and softened.

Non-square images are center-cropped, never stretched.

IMPORTANT — LEAVE THE BOTTOM CLEAR
----------------------------------
Compose the art so the bottom 25-30% is empty paper. The title is set directly
into that space. You do not need to be exact: the script MEASURES the clear band
in each image and fits the type to whatever room it finds. Leave less room and
the type just comes out smaller.

Then, from the project folder, run:

    npm run covers

That writes the same titled composition twice:

    public/covers/<slug>.jpg          used by the website
    art/spotify/<slug>-cover.jpg      upload this one to Spotify / Apple Music

The script prints, per cover:
  - the measured clear zone, as a percentage of the frame
  - the line break and type size it chose
  - a suggested `accent` colour sampled from the art. Paste it into the
    playlist's entry in lib/playlists.ts; it is the flat colour shown behind the
    cover while the image loads, so matching the art avoids a colour flash.
  - an ACTION line if `cover:` still points somewhere else

Title ink is set per playlist by `coverInk` in lib/playlists.ts: "magenta" or
"forest". Pick whichever CONTRASTS with the motif — magenta type on a magenta
motif disappears at thumbnail size.

A file whose name does not match a playlist slug is skipped with a warning, so a
typo will not silently do nothing.

Re-running is safe and idempotent; it overwrites both outputs from the source.
