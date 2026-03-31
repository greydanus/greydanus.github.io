---
layout: post
comments: true
title:  "Moviescape: Google Maps for Cinema"
excerpt: "We embedded 80k movies into a 2D landscape that users can fly over and explore. Think Google Maps over a UMAP of all cinema."
date:   2026-03-19 10:00:00
mathjax: false
author: Sam Greydanus
thumbnail: /assets/moviescape/thumbnail.png
---

<style>
.wrap {
    max-width: 900px;
}
p {
    font-family: sans-serif;
    font-size: 16.75px;
    font-weight: 300;
    overflow-wrap: break-word;
}
.post pre,
.post code {
    background-color: #fafafa;
    font-size: 14px;
}
pre {
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 word-wrap: break-word;
}
.img-expand {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}
.img-expand .fullscreen-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.55);
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    line-height: 32px;
    text-align: center;
    padding: 0;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
}
.img-expand:hover .fullscreen-btn { opacity: 1; }
.img-expand .fullscreen-btn:hover { background: rgba(0,0,0,0.8); }
.img-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.92);
    z-index: 9999;
    cursor: zoom-out;
    justify-content: center;
    align-items: center;
}
.img-overlay.active { display: flex; }
.img-overlay img {
    max-width: 95vw;
    max-height: 95vh;
    object-fit: contain;
}
.grid-2x2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 4px;
}
@media (max-width: 600px) {
    .grid-2x2 { grid-template-columns: 1fr; }
}
.grid-2x2 .img-expand { width: 100%; }
.grid-2x2 .img-expand img { width: 100%; display: block; }
.thecap-sm {
    font-size: 15px;
    line-height: 1.45;
    color: #666;
}
</style>

<div class="imgcap_noborder img-expand" style="cursor:zoom-in;" onclick="openOverlay('/assets/moviescape/moviescape_all.png')">
  <img src="/assets/moviescape/moviescape_all.png">
  <button class="fullscreen-btn" title="View fullscreen">&#x26F6;</button>
  <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:95%">
    80,000 movies embedded into a 2D landscape by thematic and emotional similarity. Each dot is a film, colored by genre. Cluster labels name the regions — European Art Cinema, Character-Driven Indie Drama, East Asian Cinema, Classic Animation &amp; Holiday, South Asian Social Drama, Italian Cinema, Crime &amp; Corruption, and more. The map is browsable and searchable.
  </div>
</div>

<div id="imgOverlay" class="img-overlay" onclick="this.classList.remove('active')">
  <img id="imgOverlaySrc" src="">
</div>

<script>
function openOverlay(src) {
  var o = document.getElementById('imgOverlay');
  document.getElementById('imgOverlaySrc').src = src;
  o.classList.add('active');
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('imgOverlay').classList.remove('active');
});
</script>

<div style="display: block; margin-left: auto; margin-right:auto; width:100%; text-align:center;">
  <a href="https://tidepool.sh" id="linkbutton" target="_blank"><img src="/assets/moviescape/tidepool.svg" style="height:1.4em;vertical-align:middle;margin-right:4px;display:inline-block;position:relative;top:-2px;">Built with Tidepool</a>
  <a href="https://moviescape.site" id="linkbutton" target="_blank">Explore the map</a>
  <a href="https://www.kaggle.com/datasets/backinblack77/moviescape" id="linkbutton" target="_blank">Get the data</a>
</div>

## The Library of Babel

In Borges' story *The Library of Babel*, the universe is an infinite library containing every possible arrangement of letters. Every book that could be written is somewhere in this library: every novel, proof, or love letter. But since there is no catalogue the library is useless. People wander through the twisted stacks of books for lifetimes, finding only gibberish.

The internet often feels like exactly that library. It contains more film criticism, reviews, recommendations, and AI-generated summaries of AI-generated summaries than anyone could read -- and yet I, and many others -- find it increasingly difficult to find a good new niche movie. Every year, somewhere around 10,000 feature films are produced around the world, and yet most recommendation algorithms point us towards the same top 20 titles. These recommendation algorithms, which promised to help us discover more variety and customization, actually seem to be sharpening the power law distribution of "movies people actually watch."

The problem is not information -- we have more of that than ever before -- but structure and geography. We need a map to orient ourselves. And it needs to be spatial, ideally 2D, and organized in such a way that we can use popular movies and categories to orient ourselves, but it is also easy to stumble across a niche/unusual title by accident. The "top 10" lists don't do this. They are based on the taste of movie critics and Hollywood institutions which, at this point, are wildly out of sync with what most people actually care about or want to watch.

Moviescape is a first attempt at that map. We took 80,000 movies, used AI to characterize their plots, themes and mood, and projected them onto a 2D map that's zoomable, pannable, and searchable. In this post, we will walk through how this was done and how the map itself can be used to explore the world of cinema and pick out interesting films on the "long tail" of content. We will see that perhaps AI itself is the best tool we have for imposing structure on the chaotic depths of the post-ChatGPT internet.

## Making a Navigable UMAP of the top 80k movies

**Enrichment of Metadata.** We got our list of movies from [TMDb (The Movie Database) daily export](https://www.kaggle.com/datasets/alanvourch/tmdb-movies-daily-updates), a Kaggle dataset with 960,000+ movies updated daily. This dataset contains titles and some metadata such as ratings, number of votes, and year produced. We sorted by vote count and took the top 80k items, giving us a dataset of the most well-known movies, plus a fairly long tail of obscure movies (I hadn't heard of most movies beyond the 1k mark).

This was a good place to start, but in order to build a better UMAP, we needed to make our context vectors as rich as possible. To this end, we decided to first enrich the metadata with "deep fields" -- open-ended descriptions of the `plot`, `mood`, `what_its_really_about`, `the_experience`, and `who_loves_it`. These fields were chosen to produce per-movie context vectors that would group movies together not just based on surface-level similarities (title, year made, some basic plot notes), but also around mood, aesthetics, themes, and other things that people might actually care about when organizing a library of the world's movies.

For example, we want a context vector for *Fight Club* that doesn't put the movie next to movies about "fighting" or "clubs." We want there to be something in the context vector about the unique mood of the movie and, on the theme side -- the subterranean identity crisis that men undergo when trapped in a soft, consumerist society.

To this end, we asked Claude Haiku (via the [Anthropic Message Batches API](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing), at a cost of about $80) to fill in these fields for every movie in the whole dataset:

```
Fields:
- id, title, year, rating, vote_count, poster_url, director: pass through from input
- decade: derive from year ("1990s", "2010s", etc.)
- country: primary production country (short form: "USA", "UK", "France", etc.)
- language: full name from the code provided
- genre: exactly ONE from: {Action, Adventure, Animation, Comedy, Crime,
    Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery,
    Romance, Sci-Fi, Thriller, War, Western}
- subgenres: 2-3 specific subgenre terms (e.g. "neo-noir", "body horror", "mumblecore")
- cast: top 7 cast in billing order from YOUR knowledge. Empty list if unknown.

Deep fields — write for an embedding model, not an audience. Semantic precision over style:
- plot: 1-2 sentences. Concrete events, setting, social milieu, central conflict.
- mood: 1-2 sentences. Visual/sonic texture. Name the filmmaking tradition.
- what_its_really_about: 2 sentences. Thematic core — philosophical tensions, not plot.
    Use analytical vocabulary an embedding model can match across films.
- the_experience: 1-2 sentences. Specific emotional/cognitive effect on viewer.
    Name the feeling precisely.

Geographic fields (NEVER null — use 0.0 only in worst-case):
- setting_lat/setting_lng: primary setting location of the film.
    For fantastical settings, use the most relevant real-world location.
- origin_lat/origin_lng: where the film was primarily produced (studio/filming location).
```

For Fight Club, the result looked like this:


```json
{
  "decade": "1990s",
  "cast": ["Brad Pitt", "Edward Norton", "Helena Bonham Carter",
    "Meat Loaf", "Jared Leto", "Zach Grenier", "Holt McCallany"],
  "country": "USA",
  "language": "English",
  "genre": "Drama",
  "subgenres": ["psychological thriller", "dark satire", "neo-noir"],
  "plot": "A depressed office worker forms an underground fight club with
    a charismatic soap salesman, escalating from bare-knuckle brawling into
    anti-capitalist domestic terrorism across late-1990s urban America.",
  "mood": "Grimy fluorescent lighting and subliminal flash frames create a
    dissociative fever dream. Dust Brothers electronic score pulses
    underneath Fincher's precise, clinical compositions.",
  "what_its_really_about": "The crisis of masculinity in consumer capitalism
    — how identity dissolves when defined solely by possessions and
    white-collar labor. Explores whether destruction is creation's
    prerequisite or its narcissistic shadow.",
  "the_experience": "Mounting paranoia and anarchic glee that curdles into
    genuine dread. The twist reframes everything, producing the vertiginous
    sensation of having been complicit in your own deception.",
  "setting_lat": 40.7128, "setting_lng": -74.006,
  "origin_lat": 34.0522, "origin_lng": -118.2437
}
```

The deep fields are written for the embedding model, not for humans. They're designed so that two films with shared themes end up as neighbors even if their titles and genres look nothing alike.

**Obtaining per-movie context vectors.** With the enriched per-movie JSONs in hand, we proceeded to concatenate the fields of each json to create a single per-movie string (as shown below) and then convert these strings into vectors with [Voyage AI](https://www.voyageai.com/) (`voyage-3-large`, 512 dimensions). The deep fields dominate the context vectors because they have the most words, but the simpler fields (title, cast, genre) are also present and searchable. Which movies end up as neighbors is mostly driven by the deep fields.

```
{title} ({year}, {decade}). {country}, {language}.
Directed by {director}, starring {cast}.
{genre}; {subgenres}.
{plot} {mood}
What it's really about: {what_its_really_about}
The experience: {the_experience}
```

The full embedding matrix is 80,000 × 512 values, stored as float16 to halve memory (from ~195MB to ~79MB). At runtime, the server loads this matrix into memory once at startup and uses a numpy dot product for search (cosine similarity against the full matrix of movie vectors).

**UMAP dimensionality reduction.** The last step of the data pipeline involves projecting the 512-dimensional context vectors to 2D using the [UMAP](https://umap-learn.readthedocs.io/) (Uniform Manifold Approximation and Projection) algorithm. The result is an approximation of the high-dimensional space that preserves some of the global and local structure while making the overall point cloud viewable in two dimensions.

In order to make the UMAP zoomable and interactive, we decided to plot it on a full-viewport dark Mapbox map. Mapbox comes with nice zoom properties, thumbnail support, and it's relatively easy to embed coordinates in links. So we chose to plot our UMAP as if each movie coordinate were literally a position on earth with latitude/longitude coordinates. To this end, we scaled the 2D coordinates to latitude/longitude ranges of -30° to +30° lng and -20° to +20° lat so that Mapbox can render them at a reasonable scale.

Running UMAP on 80,000 × 512 vectors takes less than 10 minutes on a laptop. After we got our 2D coordinates, we ran a two-level hierarchical k-means clustering on the points, yielding about 12 large-scale clusters and 80 sub-regions. Then we drew about 20 random samples from each of these regions and used Haiku to name each cluster based on that random sample (eg "French Art House", "Slasher Horror", "90s Action"). These labels appear at different zoom levels and are meant to help orient the reader.

**Final result.** The final result is Google Maps for all movies. It is a dark map full of dots, each corresponding to a different movie. The dots are colored by genre and filterable by IMDB rating, year made, and popularity (top 10%, 50%, etc). The user can also search the corpus of movies with a search bar, and when this happens the dots are all made partially transparent except for the top 200 results, which are rendered with a glow effect. The glow color varies from white to yellow to red to cyan to dark blue, where lighter colors represent higher ranks. Thus the regions of the map with the highest density of relevant results glow white or yellow while other parts of the map look dark. The result looks like a milky way with different densities and brightnesses of stars and is quite beautiful to pan over and explore.

<div class="imgcap_noborder img-expand" style="cursor:zoom-in;" onclick="openOverlay('/assets/moviescape/search.png')">
  <img src="/assets/moviescape/search.png">
  <button class="fullscreen-btn" title="View fullscreen">&#x26F6;</button>
  <div class="thecap thecap-sm"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:95%">
    A search for "movies to recommend to an 18 year old who is interested in physics and history." The top results glow on the map and are ranked in the sidebar: <i>Oppenheimer</i>, <i>A Brief History of Time</i>, ... <i>Fat Man and Little Boy</i>. The results span biopics, documentaries, and sci-fi, all united by physics and history rather than genre. The search embeds the query with the same model used for the movies and computes cosine similarity against all 80,000 films.
  </div>
</div>

The whole application (data loading, API endpoints, search, and the entire frontend) is about 2,000 lines of Python, deployed as a [Tidepool](https://tidepool.sh) pod.

## Genre clusters

The lion's share of movies live on a large central landmass of character-driven indie drama and European indie comedy. Bollywood forms its own island to the northwest. Superhero and animation films sit in the south, with Japanese pop culture (anime, tokusatsu, manga adaptations) just below them. Horror and transgressive cinema dominate the west, with action films between them and the center. And floating off to the northeast is a little island of "Holiday Entertainment Mix" movies: whimsical, safe and far from the horror regions.

Of the 80,000+ movies, the majority are dramas of one form or another. There are historical dramas, crime dramas, character studies, and family dramas. The long tail of cinema is not distributed evenly across genres; it is especially rich in character-driven stories. This is partly because dramas are the easiest kind of movie to make (no elaborate sets or special effects required). But another, deeper cause might be that indie filmmakers disproportionately care about families, friendships, and romantic relationships. In short, about our relationships with one another. If you only pay attention to blockbusters and top-1000 movies you might miss this fact.

Zooming in reveals structure that no genre taxonomy would predict. Here are four regions that show what the embedding captures.

<div class="grid-2x2">
  <div class="img-expand">
    <img src="/assets/moviescape/scooby.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/scooby.png')" title="View fullscreen">&#x26F6;</button>
  </div>
  <div class="img-expand">
    <img src="/assets/moviescape/tintin.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/tintin.png')" title="View fullscreen">&#x26F6;</button>
  </div>
  <div class="img-expand">
    <img src="/assets/moviescape/comedy.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/comedy.png')" title="View fullscreen">&#x26F6;</button>
  </div>
  <div class="img-expand">
    <img src="/assets/moviescape/martial_arts.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/martial_arts.png')" title="View fullscreen">&#x26F6;</button>
  </div>
</div>
<div style="margin-bottom:20px;">
  <div class="thecap thecap-sm"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:95%">
    <b>Four genre clusters.</b> <b>Top left:</b> The Scooby-Doo region with dozens of direct-to-video animated mysteries cluster together, from <i>Scooby Goes Hollywood</i> (1979) to <i>Scoob!</i> (2020). Surrounding them are other children's franchise films: <i>The Powerpuff Girls</i>, <i>Doug's 1st Movie</i>, and <i>Whopass Stew</i>. Simpsons specials like <i>The Simpsons in Plusaversary</i> and <i>Maggie Simpson in "The Longest Daycare"</i> sit nearby. Many people know of one or two Scooby-Doo movies but have not heard of all the others — a person who likes Scooby-Doo can zoom in on this little region and see how the lesser-known titles relate to the better-known ones. <b>Top right:</b> The Tintin cluster — all the Tintin films end up as neighbors even though they span decades and different animation styles, from <i>The Calculus Affair</i> (1964) to <i>Tintin and I</i> (2004) and <i>Hergé: In the Shadow of Tintin</i> (2016). The popup for <i>The Calculus Affair</i> shows how Haiku characterizes its themes — Cold War espionage and scientific knowledge as geopolitical commodity — which is what makes it land near other spy-adjacent adventure films rather than generic animation. <b>Bottom left:</b> The comedy region and <b>bottom right:</b> the martial arts cluster show the embedding working at two different scales. Zoomed out, comedy specials and roasts form a visible region within the broader Performance &amp; Achievement area — the popup for <i>Jonas Brothers Family Roast</i> shows Haiku's analysis of celebrity vulnerability and performative self-deprecation. Zoomed in, Hong Kong martial arts films cluster tightly within East Asian Cinema. The popup for <i>The Way of the Dragon</i> (1972) shows how Haiku frames Bruce Lee's film: cultural identity under globalization, a Hong Kong hero navigating Western colonial systems through the only language that transcends borders — physical dominance.
  </div>
</div>

**Globe view.** Moviescape also has a globe view that plots each movie at the real-world location where it is set or was filmed. This turns the thematic map into a geographic one: you can explore what movies were made in a given city or region and see how cinema clusters around the world.

<div class="grid-2x2">
  <div class="img-expand">
    <img src="/assets/moviescape/hawaii.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/hawaii.png')" title="View fullscreen">&#x26F6;</button>
  </div>
  <div class="img-expand">
    <img src="/assets/moviescape/lima.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/lima.png')" title="View fullscreen">&#x26F6;</button>
  </div>
  <div class="img-expand">
    <img src="/assets/moviescape/paris_best.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/paris_best.png')" title="View fullscreen">&#x26F6;</button>
  </div>
  <div class="img-expand">
    <img src="/assets/moviescape/mumbai_best.png">
    <button class="fullscreen-btn" onclick="openOverlay('/assets/moviescape/mumbai_best.png')" title="View fullscreen">&#x26F6;</button>
  </div>
</div>
<div style="margin-bottom:20px;">
  <div class="thecap thecap-sm"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:95%">
    <b>Globe view:</b> movies plotted at real-world locations. A small amount of jitter is applied around cities so that titles don't overlap too much. <b>Top left:</b> Movies set in Hawaii. WWII films like <i>Tora! Tora! Tora!</i>, <i>1941</i>, and <i>December 7th</i> cluster densely around Pearl Harbor on Oahu, while surf films like <i>Take Every Wave: The Life of Laird Hamilton</i>, <i>Race the Sun</i>, and <i>Rip Girls</i> scatter across Maui and the Big Island. <i>Molokai: The Story of Father Damien</i> sits on its namesake island; <i>Aloha</i> (2015) floats off on its own. <b>Top right:</b> Movies set in and around Lima, Peru — a sparse but varied scatter ranging from <i>The Plague</i> (1992) and <i>Night Flight</i> (1933) in the north to <i>The Milk of Sorrow</i> (2009) and <i>State of Siege</i> (1972) along the coast. Also present: <i>Paddington in Peru</i> (2024), <i>I Love Peru</i> (2025), and the Peruvian classic <i>The City and the Dogs</i> (1985). <b>Bottom left:</b> The top movies filmed in Paris, filtered to pre-2000 titles — a constellation of French cinema's golden age. <i>The Two Orphans</i> (1933), <i>The Wages of Fear</i> (1953), <i>Eyes Without a Face</i> (1960), <i>Le Trou</i> (1960), <i>La Chinoise</i> (1967), <i>The Rules of the Game</i> (1939), and <i>Hiroshima Mon Amour</i> (1959) all appear. <i>The Passion of Joan of Arc</i> (1928) and <i>Grand Illusion</i> (1937) sit nearby. <b>Bottom right:</b> The top 1% of movies filmed in Mumbai — spanning seven decades of Indian cinema from <i>Aan</i> (1952) to <i>All We Imagine as Light</i> (2024). The density is remarkable: <i>Gangs of Wasseypur</i>, <i>Tumbbad</i>, <i>Sholay</i>, <i>Devdas</i>, <i>Mother India</i> (1957), <i>Slumdog Millionaire</i>, and <i>Namak Haraam</i> (1973) all cluster along the coast. The popup for <i>Namak Haraam</i> shows Haiku's theme analysis: class solidarity against personal ambition, the question of whether friendship can survive the divide between inherited privilege and lived material deprivation.
  </div>
</div>

**Discovering new films.** These clusters show the embedding working at medium zoom. But the map is most useful at close zoom, where you can discover individual films you might never have found otherwise.

<div class="imgcap_noborder img-expand" style="cursor:zoom-in;" onclick="openOverlay('/assets/moviescape/terminator.png')">
  <img src="/assets/moviescape/terminator.png">
  <button class="fullscreen-btn" title="View fullscreen">&#x26F6;</button>
  <div class="thecap thecap-sm"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:95%">
    <b>Discovering new films.</b> The neighborhood around the Terminator franchise. Zoomed in enough to see individual titles. Neighbors include <i>RoboCop</i>, <i>The Matrix</i>, <i>Blade Runner</i>, <i>Ex Machina</i>, <i>I, Robot</i>, and <i>A.I. Artificial Intelligence</i> — all films about the boundary between human and machine consciousness. But also less obvious neighbors like <i>Upgrade</i> (2018) and <i>Automata</i> (2014) that share the same themes.
  </div>
</div>

This zoomed-in view is where the embedding really shines. If we just grouped films by genre, *The Terminator* would be next to other 1980s sci-fi action films. But our embedding puts it next to *Ex Machina*, *Blade Runner*, *A.I. Artificial Intelligence*, and *2001: A Space Odyssey*. These films span four decades and range from action movies to slower, more philosophical pieces. But all of them are about what it means to be human in a world where AI is real. You can also see some rarer films in this zoomed-in view: *Automata* (2014), *Singularity* (2017), and *Alpha Code* (2020) all sound like relevant and interesting films for someone who liked *The Terminator*.

It's important to note that this map is showing you something different from "people who liked movie X also like the set of movies {Y}", which is what many recommender systems do. Rather, it shows "the themes, mood, and ideas of movie X are shared by the set of neighbors {Y}". This is a different and more first-principles way for users to discover new films.

## Landscapes are better than feeds

Most of our information today is consumed as part of endless social media scrolling, search result scrolling, or AI chat scrolling. Scrolling is the opposite of exploring a map. It causes us to over-index on the top few elements of a Pareto distribution while missing the long tail. And while the top few elements can indeed be interesting, over a long timeframe this approach to information consumption will homogenize our information diets and cause the long tail of information -- where truly unique and interesting elements live -- to collapse.

I have long wished that information on the internet from movies, to books, to music, to websites, to really any other data modality were spatially organized. We humans have strong spatial "software" in the sense that we are better at remembering and manipulating information when it is associated with a specific place. Look into, for example, memory palaces and the [Method of loci](https://en.wikipedia.org/wiki/Method_of_loci). Interfaces like Moviescape take advantage of these spatial intuitions: they let the user examine a corpus from a bird's eye view, organize it spatially, and then zoom into the unique regions that hold the greatest interest and appeal. I am optimistic that this makes for a fundamentally better and more intuitive user experience.

Moviescape is live at [moviescape.site](https://moviescape.site). The code is on [GitHub](https://github.com/greydanus/tidepool/tree/main/moviescape). This project was built with [Tidepool](https://tidepool.sh).
