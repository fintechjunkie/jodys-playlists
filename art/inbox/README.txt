DROP COVER ART HERE
===================

Name each file after the playlist slug:

    actually-scary.jpg        ->  Halloween Party, Actually Scary
    revenge-dressing.jpg      ->  Revenge Dressing

Accepted: .jpg  .jpeg  .png  .webp
Target size: 3000 x 3000 (square). Bigger is fine. Under 1200px triggers a
warning because it will upscale softly.

Non-square images are center-cropped to a square, never stretched.

Then, from the project folder, run:

    npm run covers

That produces TWO assets per playlist:

    public/covers/<slug>.jpg           1600px, NO text.
                                       Used by the website, which already
                                       displays the title in huge type right
                                       next to the image.

    art/spotify/<slug>-cover.jpg       3000px, title burned in using Anton.
                                       THIS is the one to upload to Spotify
                                       and Apple Music, where there's no
                                       surrounding page to carry the name.

The script prints a suggested `accent` color sampled from your artwork. Paste it
into the playlist's entry in lib/playlists.ts — it's the flat color shown behind
the cover while the image loads, so matching the art avoids a color flash.

It also tells you to set `cover:` to the new path. Do that, or the site keeps
showing the grey placeholder.

Note: a file whose name doesn't match a playlist slug is skipped with a warning,
so a typo won't silently do nothing.
