---
layout: post
comments: true
title:  "The Story of Flight"
excerpt: "Why do humans want to fly? Let's start by looking at the humans for whom the desire to fly was strongest: the early aviators."
date:   2020-10-12 11:00:00
mathjax: true
author: Sam Greydanus
thumbnail: /assets/story-of-flight/thumbnail.png
---

<div>
  <style>
      #linkbutton:link, #linkbutton:visited {
        padding: 6px 0px;
        text-decoration: none;
        display: inline-block;

        border: 2px solid #777;
        padding: 10px;
        font-size: 20px;
        min-width: 200px;
        width: 50%;
        text-align: center;
        color: #999;
        margin: 0px auto;
        cursor: pointer;
        margin-bottom: 10px;
      }

      #linkbutton:hover, #linkbutton:active {
        background-color: rgba(245, 245, 245);
      }

    .playbutton {
      background-color: rgba(0, 153, 51);
      /*background-color: rgba(255, 130, 0);*/
      border-radius: 4px;
      color: white;
      padding: 3px 8px;
      /*width: 60px;*/
      text-align: center;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 12px;
      /*display: block;*/
      /*margin-left: auto;*/
      margin: 8px 0px;
      margin-right: auto;
      min-width:80px;
    }
  </style>
</div>

<!-- <div class="imgcap_noborder">
  <img src="/assets/story-of-flight/hummingbird.png" style="width:10%;min-width:150px;">
</div> -->

When I was growing up, hummingbirds used to fly into our garage and get stuck. I remember finding one perched on a windowsill, weak from exertion. It let me fold my hands around it and carry it outside. And when I opened my hands, it lay on my palms for a moment. That's when the sunlight ignited its iridescent plumage and engulfed its whole body in a cloud of blues and greens. Then it understood it was free, whirred its wings, and vanished into the open air. Long after it had departed, my mind's eye gazed upon the little bird. With an idle curiosity, I tried to imagine how natural forces could have wrought such a thing. We know of lift and drag, thrust and gravity as rough textbook concepts. But it's another thing entirely to gaze upon a creature of beauty and sophistication and realize that it was shaped in part by those simple forces.
    
Since my encounter with the hummingbird, I have always been naturally drawn to flight. It's a bizarre desire to possess, since humans did not evolve to fly. And yet many humans have felt the same way over the years. Entire cultures, even, have dreamed of flight. And step by step, they have used technology to fashion their own artificial wings and bring about the modern-day miracle of flight. The purpose of this series of posts is to recount that epic adventure. I will tell it through the lens of history, looking at the individual people who wanted to fly, the lens of technology, looking at the key inventions leading up to modern airplanes, and the lens of physics, looking at the equations of airflow that made it all possible. As a final flourish, I will derive a wing from scratch by simulating a wind tunnel, differentiating through it, and using gradient descent to deform a rectangular occlusion into a wing.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32.8%; min-width:200px; display: inline-block; vertical-align: top;">
    <img src="/assets/story-of-flight/leonardo.jpg" style="width:100%">
    <div style="text-align: left;">Leonardo da Vinci, an important figure in the history of flight.</div>
  </div>
  <div style="width:32.8%; min-width:200px; display: inline-block; vertical-align: top;">
    <img src="/assets/story-of-flight/lilienthal.jpg" style="width:100%">
    <div style="text-align:left;">Otto Lilienthal, who made key technological breakthroughs in wing shape and design.</div>
  </div>
  <div style="width:32.8%; min-width:200px; display: inline-block; vertical-align: top;">
    <img src="/assets/story-of-flight/wing_shape.png" id="wingShapeImage" onclick="toggleWingShape()" style="width:100%">
    <div style="text-align:left;">Optimizing our own wing in a fluid simulation. <p style="color:grey;display:inline;">[Click to pause or play.]</p></div>
  </div>
</div>

### The Early Aviators

In the past century alone, airplane design has progressed from the Wright brothers’ ramshackle _Flyer_ to Lockheed Martin's streamlined _SR-71 Blackbird_. In parallel, our commercial aviation system has developed to the point where anyone can enjoy the possibilities of flight. Flight has become so common and so reasonable that it's easy to forget the towering lusts and follies that accompanied its invention. But if we are to understand why humans wanted to fly in the first place, we need to relive those lusts and follies. One way to do this is by looking back at the lives of the early aviators.

Perhaps none of the early aviators wanted to fly as much as the tower jumpers. Beginning in the Middle Ages, there was a string of inventors who fashioned wings for themselves and then leaped from towers in imitation of birds. These daredevils were the tower jumpers. Having neglected the essential calculations of lift and drag, they relied mostly on wits, intuition, and dumb luck to survive. Alas, gravity tended to be stronger. Most of their attempts ended in death or serious injury. But one exception to the rule was the Andalusian inventor Abbas ibn Firnas. The story goes that he made his jump at the astonishing age of seventy years. Once he was airborne, his feather suit cushioned his fall and allowed him to glide to the ground unharmed.[^fn1] Somehow, in spite of his wild deeds, Abbas lived on to the respectable age of 78.

The common folk of Andalusia must have enjoyed laughter and endless conversations about Abbas and his wingsuit. They would have asked, why does he want to fly? Pigs do not have wings and they are quite content about it. Why should humans, who likewise have no wings, want to pretend at flight? They would have been making a good point. After all, the tower jumpers needed to be more than half mad to take the risks they did. But on a fundamental level, they were probably driven by things that most humans can relate to: the desires for freedom, glory, and adventure. 


### The Freedom of Flight

We can see this in Leonardo da Vinci, whose work on flight was deeply rooted in a desire for freedom. Most people know that da Vinci painted the Mona Lisa and sketched a number of remarkable flying machines. However, few of them are aware of the pressures that shaped him.[^fn2] Leonardo began life as the illegitimate son of an Italian aristocrat and a peasant woman. And so he had to support himself from an early age by taking on strict apprenticeships and painting for wealthy patrons. The fact that he was gay complicated things even further.

His life reached a moment of crisis on his 27th birthday when he and his friends were imprisoned for acts of sodomy. Imprisonment affected him deeply. As soon as he was released, he sketched a machine meant to "open a prison from the inside" and another for tearing bars off of windows. Around the same time, he became obsessed with bird flight and began buying birds at markets in order to sketch them. When he finished sketching them, he would free them from their cages. "Once you have tasted flight," he wrote, "you will forever walk the earth with your eyes turned skyward. For there you have been, and there you will always long to return." For da Vinci, flight seems to have been a metaphor for freedom and an antidote to the horrors of captivity.

### The Glory of Flight

But freedom is not the only reason people wanted to fly. For others, flight was a shot at glory -- and nobody loved glory more than the French chemist Pilatre de Rozier. This man was quite a character. He was known to breathe fire, seduce older women, and give himself fake titles.[^fn3]

As a young scientist, he signed his papers, "Apothecary," then "first Apothecary,"" and finally, "Pharmacy Inspector" of the Prince of Limbourg. This impressed his colleagues until they discovered that the Prince of Limbourg did not, in fact, exist. In a twist of irony, it was this same hunger for glory that also led de Rozier to his greatest scientific breakthroughs. The first was the match, which he invented in order to show off his fire breathing skills in a public lecture. The second was the gas mask, which he used in a stunt that involved lowering himself into the fumes of a vat of fermenting beer. The final, and most significant breakthrough, was his completion of the first manned voyage in a hot air balloon. King Louis XVI wanted to put criminals in the balloon but de Rozier objected, saying "The glory should not be given to criminals!"[^fn4]

Pilatre was far from perfect, but his bravery and showmanship inspired people and gave aeronauts an immensely positive image in France. His initial balloon launch attracted a crowd of over a hundred thousand people. When these people saw him land safely, common attitudes about flight changed. No longer was human flight seen as a thing of folly. It became a source of national pride and a crowning achievement of science. And for many, it began to represent an exciting new frontier.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:35.5%; min-width:180px; display: inline-block; vertical-align: top;">
    <img src="/assets/story-of-flight/davinci_glider.jpg" style="width:100%">
    <div style="text-align: left;">A page from one of da Vinci's journals describes an "air screw" that resembles a modern helicopter. </div>
  </div>
  <div style="width:26.9%; min-width:130px; display: inline-block; vertical-align: top;">
    <img src="/assets/story-of-flight/balloon.png" style="width:100%">
    <div style="text-align:left;">Pilatre de Rozier and his companion take off in a hot air balloon.</div>
  </div>
  <div style="width:36.4%; min-width:180px; display: inline-block; vertical-align: top;">
    <img src="/assets/story-of-flight/earhart.jpg" style="width:100%">
    <div style="text-align:left;">Amelia Earhart sitting upon the nose of her plane in 1936.</div>
  </div>
</div>

Like any new frontier, flight called most strongly to those with a sense of imagination and adventure. One person who heeded this call was [Antoine de Saint-Exupery](https://en.wikipedia.org/wiki/Antoine_de_Saint-Exup%C3%A9ry). In his short life, he became both a decorated military pilot and one of France's best poets and novelists. He managed this double act by blending his writing with his flying until they became almost the same activity. There are eccentric stories about how he wrote poetry during military scouting missions and once circled a landing strip for an hour to finish reading a good novel.[^fn6] To Saint-Exupery, flight was as much an adventure of the mind as it was the body. In fact, he argued that these two adventures were inseparable: the way a mind perceives the physical world determines how the body will eventually shape it. Or, as he put it, "A rock pile ceases to be a rock pile the moment a single man contemplates it, bearing within him the image of a cathedral." His own life supports that idea, for, in thinking and writing about flight from the lens of an artist, he transformed it into something that promised not only freedom and glory, but also beauty and adventure.

The other side of venturing into a frontier is that one must leave behind the comforts of civilized life. Even as airplanes improved in the early 1900's, they remained costly, dangerous, and generally impractical. So every one of the early aviators had to make sacrifices in order to fly. But one person who had to make especially tough choices was Amelia Earhart.

Earhart was one of the best early airplane pilots and famously went missing during an attempt to fly around the world. The first, and most obvious choice she had to make was to risk her life in pursuit of that goal. But apart from safety, she had to risk bankruptcy throughout her twenties -- taking odd jobs and once selling her plane in order to support herself. And finally, once she was able to support herself financially, she had to risk losing love and the chance at marriage. The publicist George Putnam had proposed and the two were preparing for marriage when she explained to him, "I cannot endure at all times even an attractive cage."[^fn8] Putnam eventually agreed to an unconventional open marriage, but Earhart's letter suggests she was prepared to forgo it entirely if it interfered with her ability to fly. Like Earhart, many of the early aviators had to lose wealth, love, or life in the pursuit of flight.

That was the nature of life on the new frontier.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%;margin-bottom: 100px; margin-top: 50px">
    <a href="../../../../2020/10/13/stepping-stones/" id="featuredlink" target="_blank" style="margin-right: 10px;">Post #2: The Stepping Stones of Flight</a>
</div>


## Footnotes

[^fn1]: White, Lynn Townsend Jr. [Eilmer of Malmesbury, an Eleventh Century Aviator: A Case Study of Technological Innovation, Its Context and Tradition](https://www.jstor.org/stable/pdf/3101411.pdf?seq=1), _Technology and Culture 2_, p. 97-111, 1961. For a quick but less scholarly overview, try [this online article](https://www.thefamouspeople.com/profiles/abbas-ibn-firnas-33319.php).
[^fn2]: Isaacson, Walter. Leonardo da Vinci, _Simon & Schuster_, 2017. See also this New Yorker [review article](https://www.newyorker.com/magazine/2017/10/16/the-secret-lives-of-leonardo-da-vinci) about the book.
[^fn3]: Duval, Clément. [Pilatre de Rozier (1754-1785), Chemist and First Aeronaut](https://online.ucpress.edu/hsns/article/doi/10.2307/27757275/33554/Pilatre-de-Rozier-1754-1785-Chemist-and-First), _Chymia_, 1967. This article is well written, and quite fun to read. I'd recommend the whole thing.
[^fn4]: Penenberg, Adam L. [Sky Rivals: Two Men. Two Planes. An Epic Race Around the World.](https://books.google.com/books?id=WCmUCwAAQBAJ&pg=PT56&lpg=PT56&dq=rozier+louis+criminal+balloon&source=bl&ots=c0b-7imHWp&sig=ACfU3U14AFxunsLlX7D6PxEp82CYpVC5FQ&hl=en&sa=X&ved=2ahUKEwjHyZCZxJvqAhUU7J4KHRStCqcQ6AEwDHoECAwQAQ#v=onepage&q=rozier%20louis%20criminal%20balloon&f=false), _Wayzgoose Press_, 2016
[^fn5]: Stimson, Richard. [Einstein's Wing](https://wrightstories.com/einsteins-wing-flops/), _Air & Space Magazine_, May 2005. Also see [Twitter thread](https://twitter.com/yappelbaum/status/1105474335140204545?lang=en) by Yoni Appelbaum.
[^fn6]: Schiff, Stacy. [Saint-Exupéry: A Biography](https://web.archive.org/web/20161020193505/https://books.google.com/books?id=2G4Q_GNpCUMC&hl=en), _Da Capo Press_, 1997. See also the [Wikipedia article](https://en.wikipedia.org/wiki/Antoine_de_Saint-Exup%C3%A9ry) about Saint-Exupéry.
[^fn7]: Saint-Exupéry has some truly fantastic quotes. There wasn't a great place for them in this article, but I encourage you to read some of them [here](https://www.brainyquote.com/authors/antoine-de-saint-exupery-quotes).
[^fn8]: [Amelia Earhart's Prenup Is Remarkably Modern](https://www.huffpost.com/entry/amelia-earhart-prenup_n_2280057), _Huffington Post_, 2017. An image of the prenuptual letter itself is [here](https://images.huffingtonpost.com/2012-12-11-earhart.jpg).

<script language="javascript">
  function toggleWingShape() {

    path = document.getElementById("wingShapeImage").src
      if (path.split('/').pop() == "wing_shape.png") 
      {
          document.getElementById("wingShapeImage").src = "/assets/story-of-flight/wing_summary.gif";
      }
      else 
      {
          document.getElementById("wingShapeImage").src = "/assets/story-of-flight/wing_shape.png";
      }
  }
</script>
