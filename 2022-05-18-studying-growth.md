---
layout: post
comments: true
title:  "Studying Growth with Cellular Automata"
excerpt: "We train simulated cells to grow into organisms by communicating with their neighbors. Then we use them to study patterns of growth found in nature."
date:   2022-05-18 11:00:00
mathjax: true
thumbnail: /assets/studying-growth/thumbnail.png
---

<!-- "We simulate the process of cell growth called morphogenesis. Then we find growth rules that generate a range of flowers and use them to grow a garden." -->

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video1" style="width:100%;min-width:250px;" poster="/assets/studying-growth/rose.jpg">
      <source src="/assets/studying-growth/rose.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video1_button" onclick="playPauseVideo1()">Play</button>
  </div>
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video2" style="width:100%;min-width:250px;" poster="/assets/studying-growth/marigold.jpg">
      <source src="/assets/studying-growth/marigold.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video2_button" onclick="playPauseVideo2()">Play</button>
  </div>
   <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;">
    <video id="video3" style="width:100%;min-width:250px;" poster="/assets/studying-growth/crocus.jpg">
      <source src="/assets/studying-growth/crocus.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video3_button" onclick="playPauseVideo3()">Play</button>
  </div>
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:75%">We train simulated cells to grow into organisms by communicating with their neighbors. Here these cells are growing into flowers starting from single seed pixels.</div>
</div>

<script> 
function playPauseVideo1() { 
  var video = document.getElementById("video1"); 
  var button = document.getElementById("video1_button");
  if (video.paused) {
    video.play();
    button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 

function playPauseVideo2() { 
  var video = document.getElementById("video2"); 
  var button = document.getElementById("video2_button");
  if (video.paused) {
    video.play();
  button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 

function playPauseVideo3() { 
  var video = document.getElementById("video3"); 
  var button = document.getElementById("video3_button");
  if (video.paused) {
    video.play();
  button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/1TgGN5qjjH6MrMrTcStEkdHO-giEJ4bZr" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/studying_growth" id="linkbutton" target="_blank">Get the code</a>
</div>

<!-- ## A Productive Question -->

How does a single fertilized egg grow into a population of seventy trillion cells -- a population that can walk, talk, and write sonnets? This is one of the great unanswered questions of biology. We may never finish answering it -- and indeed the mere asking of it should be tempered with humility. But it's a productive question. Scientists who have asked it over the past seventy years have discovered the structure of DNA, sequenced the human genome, and made essential contributions to modern medicine. In this post, we will ask this question using a new tool called Neural Cellular Automata (NCA).

<!-- **Neural Cellular Automata.** A few years ago, scientists showed that it is possible to use neural networks to represent the rules for how simulated cells interact with one another. This allowed them to teach simulated cells to interact with one another at a local scale in order to produce complex emergent behaviors at the population level. So far, only a few papers have been written about these "Neural Cellular Automata" models. One reason is that they are a relatively new idea. Another reason is that, although they require expertise in ML to implement, their main intellectual appeal is to an audience interested in cellular morphogenesis. The intersection of people who are comfortable in both worlds is relatively small.

But the mechanics of cellular morphogenesis are extremely important. Indeed, NCA may be the best long-term means of understanding the programming language of our bodies' cells. If DNA is the source code that comes pre-installed on your computer, then cellular morphogenesis is the complex and varied means by which your computer performs its functions: booting up, decompressing files, creating pop-up windows, and so forth. In order to understand your computer as a whole, it makes a lot of sense to start by studying the mechanics of these everyday functions.

With all of this in mind, let's take a closer look at how NCA work and then apply them to some simple biology problems. -->

## Neural Cellular Automata

The purpose of cellular automata (CA) is to mimic biological growth at the cellular level. Most CAs begin with a grid of pixels with each pixel representing an individual cell. Then a set of growth rules, which control how each cell responds to its neighbors, are applied repeatedly to the population. Although these growth rules are simple to write down, scientists generally choose them so as to produce complex, self-organizing behaviors. Conway's Game of Life, for example, has just three simple growth rules but can give rise to diverse structures and dynamics.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:49.4%; min-width:280px; display: inline-block; vertical-align: top;text-align:center;">
    <img src="/assets/studying-growth/conway_rules.jpg">
  </div>
  <div style="width:49.7%; min-width:280px; display: inline-block; vertical-align: top;text-align:center;">
    <video id="video_conway" controls style="width:100%">
      <source src="/assets/studying-growth/conway.mp4" type="video/mp4">
    </video>
  </div>
</div>

Classic versions of cellular automata like Conway's Game of Life are interesting because they produce emergent behavior starting from simple rules. But in a way, these versions of CA are _too simple_. Their cells only get to have two states, dead or alive, whereas biological cells get to have a near-infinite number of states, states which are determined by a wide variety of signaling molecules. We refer to these molecules as _morphogens_ because they work together to control growth and guide organisms toward specific final shapes or _morphologies_.

**A more flexible framework.** Based on this observation, we should move away from cells that are only dead or alive. Rather, we should allow cells to exist in a variety of states, with each state defined by a list of continuous variables. Growth rules should operate on combinations of these variables in the same way that biological growth rules operate on combinations of different morphogens. And unlike Conway's Game of Life, the self-organizing behaviors that arise should not be arbitrary. Rather, they should involve convergence to _specific_ large-scale morphologies like those that occur in biology. Much more complex growth rules are required to make this happen.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/comparison.jpg">
</div>

The diagram above shows how NCA take a step in the right direction. Unlike regular cellular automata, they represent each cell state with a real-valued \\(n\\)-dimensional vector and then allow arbitrary growth rules to operate on that domain. They do this by _parameterizing growth rules with a neural network and then optimizing the neural network to obtain the desired pattern of growth_. To showcase the model's expressivity, the authors trained it to arrange a population of a 1600 cells in the shape of a lizard starting from local-only interactions between initially identical cells.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/nca_schema.jpg">
  <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">
  A detailed schema showing how a neural network can be used to parameterize the growth rules of a population of cells. You can find the specific implementation details in the <a href="https://distill.pub/2020/growing-ca/">original NCA article</a>.
  </div>
</div>

## Getting started ([notebook](https://colab.research.google.com/drive/13wCM9OV2JR004zFvh7zPgUxrga8sU4d1))

<!-- We need to start with a high-quality NCA implementation, one that is flexible enough to modify for the purposes of our experiments. The authors of the original NCA paper released a series of excellent Colab notebooks which show how to implement the model in TensorFlow. But after experimenting with their code, I decided to reimplement everything in PyTorch. I like PyTorch better and I wanted to make a minimalist implementation that would be easy to hack on in order to try out new ideas. You can find it [here](https://colab.research.google.com/drive/13wCM9OV2JR004zFvh7zPgUxrga8sU4d1). -->

The authors of the original paper released a Colab notebook that showed how to implement NCA in TensorFlow. Starting from this notebook, we reimplemented everything in PyTorch and boiled it down to a minimalist, 150-line implementation. Our goal was to make the NCA model as simple as possible so that we could hack and modify it without getting overwhelmed by implementation details.

Having implemented our own NCA model, the next step was to scale it to determine the maximum size and complexity of the "organisms" it could produce. We found that the population size was going to be limited by the amount of RAM available on the Google Colab GPUs. We maxed things out with a population of about 7500 cells running for about 100 updates. For context, the original paper used a population of 1600 cells running for 86 updates.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/bloopers.jpg">
  <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">
  Some early attempts.
  </div>
</div>

Working in this scaled up regime, we trained our NCA to grow a number of different flowers, eventually settling on a rose, a marigold, and a crocus. Some of the early results were a bit mangled and blurry (above), but before long we were able to grow a pleasant little garden.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:65%">
  <img src="/assets/studying-growth/garden.jpg">
  <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">
  Growing flowers with NCA.
  </div>
</div>

Having implemented the original model and gotten a feeling for how it trained, we were ready to study some basic patterns of biological growth.


## Patterns of biological growth

Biological growth is wonderfully diverse. Consider this passage from the first chapter of _Growth_ by Life Science Library:

_A eucalyptus native to Uganda has been known to grow 45 feet in two years, whereas dwarf ivy generally grows one inch a year. The majestic sequoia of California, which starts out as a seed weighing only one three-thousandth of an ounce, may end up... [with a] weight estimated at 6,200 tons. It takes more than 1,000 years for the sequoia to achieve the feat of multiplying 600 billion times in mass._

_The animal kingdom, too, has its champions of growth. The blue whale, which cruises the oceans from the North to the South Pole, begins life as a barely visible egg weighing only a fraction of an ounce. At birth, it weighs from two to three tons. When it is weaned, at about seven months, it is 52 feet long and weighs 23 tons, having gained an average of 200 pounds a day._

Given the extraordinary diversity of life forms on our planet, one of the biggest surprises might actually be how much they have in common. For the most part they have the same genetic materials, signaling pathways, enzymes, and metabolic pathways. Their cells have the same life cycles. Indeed, the cellular mechanics in a gnat look pretty similar to those in a blue whale -- even though the two creatures could not be more different.

### [1. Gnomonic growth](https://colab.research.google.com/drive/1DUFL5glyej725r8VAYDZIFrWvpR6a6-0)

One shared pattern of growth is called _gnomonic growth_. This pattern tends to occur whenever an organism needs to grow in size but its body shape is defined by a rigid structure. You can see this in clams, for example. Their shells are rigid and cannot be deformed. And yet they need to grow their shells as the rest of them grows. Clams solve this problem by incrementally adding long crescent-shaped lips to the edges of their shells. Each new lip is just a little larger than the one that came before it. These lips, or _gnomons_ as they are called, permit organisms to increase in size without changing form. Gnomons are a pattern of growth that also appears in shells, horns, tusks, and tree trunks.

One of the most famous products of gnomonic growth is the nautilus shell. In this shell, the gnomons grow with such regularity that its overall shape can be modeled with a simple Fibonacci sequence. The elegance and simplicity of the pattern makes it an interesting testbed for NCA.


To set up this problem, we split the shell into three regions: frozen, mature, and growing. These regions are shown in cyan, black and magenta respectively in the figure above. The cells in the frozen region are, as the name would suggest, frozen. Alive cells along their edges can observe their states and those states never change. The mature cells, meanwhile, begin the simulation in the exact shape of the black region shown. They can grow and change however they wish during the simulation. But at the end of the simulation, the loss function encourages them to look just the way they did at the beginning. The growing region, meanwhile, begins the simulation without any living cells. Cells from the mature region need to grow outwards into this area and arrange themselves in the proper shape before the simulation ends.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/nautilus_train.png">
</div>

Part of the objective in this "gnomonic growth" problem is to learn a growth rule that is scale and rotation invariant. We can accomplish this by rotating and scaling the nautilus template as shown in the six examples above. By training on all of these examples at once, we are able to obtain a model that grows properly at any scale or orientation. Once our model learns this, it is able to grow long sequences of gnomons without much interference. Shown below, for example, we add eight new compartments and quadruple the shell's size with minimal interference.[^fn3]

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/nautilus_bw.png">
</div>

One of the things that makes this growth pattern interesting is that the NCA cells have to reach a global consensus as to what the scale and rotation of the mature region is. Only by agreeing on this are they able to construct a properly-sized addition. And yet, we noticed that expansion into the growth region began in the first simulation step. This suggests that cells in the mature region try to come to a distributed consensus _even as_ new cells are expanding into the growth region. Once cells in the mature region know the proper scale and rotation of the gnomon, they transmit this information to the growing region so that it can make small adjustments to its borders. If you look closely, you can see these adjustments happening in the video below.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="naut_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/nautilus.png">
      <source src="/assets/studying-growth/nautilus.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="naut_video_button" onclick="playPauseNaut()">Play</button>
  </div>
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:75%">We grow a nautilus shell.</div>
</div>

<script> 
function playPauseNaut() { 
  var video = document.getElementById("naut_video"); 
  var button = document.getElementById("naut_video_button");
  if (video.paused) {
    video.play();
    button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>

This process of _reaching a consensus in a decentralized and asynchronous manner_ is a common problem in biology. In fact, we already touched on it in our [Self-classifying MNIST Digits](/2020/08/27/selforg-mnist/) post. It's also important in human organizations: from new cities agreeing on development codes, to democratic institutions agreeing on legislation. to the stock market agreeing on how to value companies. It is not always a low-entropy process.

Indeed, sometimes even cells have to resort to other means of reaching a consensus.


### [2. Embryonic induction](https://colab.research.google.com/drive/1fbakmrgkk1y-ZXamH1mKbN1tvkogNrWq)

The alternative to a fully decentralized consensus mechanism is cellular induction. This happens when one small group of cells in an embryo tell the rest how to grow. The first group of cells is called the inducing tissue and the second is called the respondoing tissue. Induction controls the growth of many tissues and organs including the eye lens and the heart.

In this section, we will grow an image of a newt and then graft part of its eye tissue onto its belly. After doing this, we will watch to see whether those cells are able to induce growth of the rest of the eye lens in that region. We've chosen this peculiar experiment as homage to [Hans Spemann](https://en.wikipedia.org/wiki/Hans_Spemann),[^fn2] who won a Nobel Prize in 1935 for doing the same thing with real newts.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:80%">
  <img src="/assets/studying-growth/newt_timeline_tall.png">
  <div class="thecap"  style="text-align:center; display:block; margin-left: auto; margin-right: auto; width:100%">
  Reproducing embryonic induction in a picture of a newt.
  </div>
</div>

Some more text

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="newt_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/newt.jpg">
      <source src="/assets/studying-growth/newt.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="newt_video_button" onclick="playPauseNewt()">Play</button>
  </div>
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:75%">We train simulated cells to grow into organisms by communicating with their neighbors. Here these cells are growing into flowers starting from single seed pixels.</div>
</div>

<script> 
function playPauseNewt() { 
  var video = document.getElementById("newt_video"); 
  var button = document.getElementById("newt_video_button");
  if (video.paused) {
    video.play();
    button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>


### [3. Apoptosis](https://colab.research.google.com/drive/1qQcztNsqyMLLMB00CVRxc0Pm7ipca0ww)

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:80%">
  <img src="/assets/studying-growth/grow_bone.png">
</div>

In this experiment we simulate bone growth. Bone growth is interesting because it uses apoptosis (programmed cell death) in order to produce a hollow area in the center of the bone. We see something analogous happen in our model, with a circular tan frontier that gradually expands outwards until it reaches the size of the target image.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="bone_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/bone.png">
      <source src="/assets/studying-growth/bone.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="bone_video_button" onclick="playPauseBone()">Play</button>
  </div>
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:75%">We grow a bone.</div>
</div>

<script> 
function playPauseBone() { 
  var video = document.getElementById("bone_video"); 
  var button = document.getElementById("bone_video_button");
  if (video.paused) {
    video.play();
    button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>

### [4. Speciation](https://colab.research.google.com/drive/1vG7yjOHxejdk_YfvKhASanNs0YvKDO5-)

Train a neural CA that can grow from a seed pixel into one of three different flowers depending on initial value of the seed. From a dynamical systems perspective, we are training a model that has three different basins of attraction, one for each flower. The initial seed determines which basin the system ultimately converges to. The initial seed vs. the shared attractor dynamics are analogous to the DNA of a specific flower vs. the shared cellular dynamics across related flower species.


<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="seeds_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/seeds.png">
      <source src="/assets/studying-growth/seeds.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="seeds_video_button" onclick="playPauseSeeds()">Play</button>
  </div>
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:75%">We grow a bone.</div>
</div>

<script> 
function playPauseSeeds() { 
  var video = document.getElementById("seeds_video"); 
  var button = document.getElementById("seeds_video_button");
  if (video.paused) {
    video.play();
    button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>


## Closing thoughts / Why are these models significant?

**Applications**
* Art
* Studying developmental diseases
* Tackling cancer
* Virtual worlds with visual programming languages
* Physics simulations

Romantic and beautiful introduction; channel Phil Anderson & More is different; talk about _simplicity_. Close by saying that we need to analyze how exactly these models work; how the self-organization occurs mechanistically. There is a counterintuitive possibility that in order to explore the limits of how large we can scale neural networks, we may need to explore the limits of how small we can scale them first. Scaling models and datasets downward in a way that preserves the nuances of their behaviors at scale will allow researchers to iterate quickly on fundamental and creative ideas.

### Footnotes
[^fn0]: In this post, we will use "growth rules" to refer to the rules governing how each cell interacts with its neighbors.
[^fn1]: Trunk, Gerard V. "[A problem of dimensionality: A simple example](https://ieeexplore.ieee.org/document/4766926)." IEEE Transactions on pattern analysis and machine intelligence 3 (1979): 306-307.
[^fn2]: And his student Hilde
[^fn3]: Out only interference is to convert growin regions to mature regions and mature regions to frozen regions every 160 steps. This causes the system to move on to the next unit of growth.

<!-- _Now two organisms are exactly alike. Each grows and develops in a unique fashion within the limits that its environment permits. Every species, however, has its own way of growing, and each has its own rate of growth. The range of variations is overwhelming. In as little as three months, for example, one of the grasses native to tropical Ceylon, a bamboo, may shoot up to a height of 120 feet, as tall as a 12-story building, by growing at an average rate of 16 inches a day. A eucalyptus native to Uganda has been known to grow 45 feet in two years, whereas dwarf ivy generally grows one inch a year. The majestic sequoia of California, which starts out as a seed weighing only one three-thousandth of an ounce, may end up 270 feet tall, with a base diameter of 40 feet and a weight estimated at 6,200 tons. It takes more than 1,000 years for the sequoia to achieve the feat of multiplying 600 billion times in mass._

_The animal kingdom, too, has its champions of growth. The blue whale, which cruises the oceans from the North to the South Pole, begins life as a barely visible egg weighing only a fraction of an ounce. At birth, it weighs from two to three tons. When it is weaned, at about seven months, it is 52 feet long and weighs 23 tons, having gained an average of 200 pounds a day. By the time it reaches maturity, in about 13 years, the blue whale is serious competition for many submarines. Then it may weight more than 85 tons and exceet 80 feet in length._ -->

<!-- 
Just as there is a shared but invisible structure -- based on Newtonian physics -- that underlies the motion of the planets or of a falling apple, so too there is shared structure to the growth rules of multicellular organisms. Of course, it's harder to reduce this structure to a clean set of equations than in physics. There are more exceptions and special cases. But since it reoccurs in diverse and unrelated biological organisms, there is good reason to believe that we can reproduce it in simulations of multicellular systems.
 -->