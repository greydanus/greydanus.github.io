---
layout: post
comments: true
title:  "Studying Growth with Neural Cellular Automata"
excerpt: "We train simulated cells to grow into organisms by communicating with their neighbors. Then we use them to study patterns of growth found in nature."
date:   2022-05-24 6:50:00
mathjax: true
author: Sam Greydanus
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
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:95%"><b>Growing flowers.</b> The pixels in the images above represent cells. By exchanging signals with their neighbors, these cells coordinate their behavior and assemble themselves in the shapes of the three flowers shown.</div>
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

How does a single fertilized egg grow into a population of seventy trillion cells: a population that can walk, talk, and write sonnets? This is one of the great unanswered questions of biology. We may never finish answering it, but it is a productive question nonetheless. In asking it, scientists have discovered the structure of DNA, sequenced the human genome, and made essential contributions to modern medicine.

In this post, we will explore this question with a new tool called Neural Cellular Automata (NCA).

<!-- **Neural Cellular Automata.** A few years ago, scientists showed that it is possible to use neural networks to represent the rules for how simulated cells interact with one another. This allowed them to teach simulated cells to interact with one another at a local scale in order to produce complex emergent behaviors at the population level. So far, only a few papers have been written about these "Neural Cellular Automata" models. One reason is that they are a relatively new idea. Another reason is that, although they require expertise in ML to implement, their main intellectual appeal is to an audience interested in cellular morphogenesis. The intersection of people who are comfortable in both worlds is relatively small.

But the mechanics of cellular morphogenesis are extremely important. Indeed, NCA may be the best long-term means of understanding the programming language of our bodies' cells. If DNA is the source code that comes pre-installed on your computer, then cellular morphogenesis is the complex and varied means by which your computer performs its functions: booting up, decompressing files, creating pop-up windows, and so forth. In order to understand your computer as a whole, it makes a lot of sense to start by studying the mechanics of these everyday functions.

With all of this in mind, let's take a closer look at how NCA work and then apply them to some simple biology problems. -->

## Motivation

The purpose of cellular automata (CA) _writ large_ is to mimic biological growth at the cellular level. Most CAs begin with a grid of pixels where each pixel represents a different cell. Then a set of growth rules, controlling how cells respond to their neighbors, are applied to the population in an iterative manner. Although these growth rules are simple to write down, they are choosen so as to produce complex self-organizing behaviors. For example, Conway's Game of Life has just three simple growth rules that give rise to a diverse range of structures.[^fn4]

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

Classic versions of cellular automata like Conway's Game of Life are interesting because they produce emergent behavior starting from simple rules. But in a way, these versions of CA are _too simple_. Their cells only get to have two states, dead or alive, whereas biological cells get to have a near-infinite number of states, states which are determined by a wide variety of signaling molecules. We refer to these molecules as _morphogens_ because they work together to control growth and guide organisms towards specific final shapes or _morphologies_.

**Neural CA.** Based on this observation, we should move away from CA with cells that are only dead or alive. Instead, we should permit their cells to exist in a variety of states with each state defined by a list of continuous variables. Growth rules should operate on combinations of these variables in the same way that biological growth rules operate on combinations of different morphogens. And unlike Conway's Game of Life, the self-organizing behaviors that arise should not be arbitrary or chaotic. Rather, they should involve stable convergence to _specific_ large-scale morphologies like those that occur in biology. Much more complex growth rules are needed for this to occur.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/comparison.jpg">
</div>

The diagram above shows how NCA take a step in the right direction. Unlike regular cellular automata, they represent each cell state with a real-valued \\(n\\)-dimensional vector and then allow arbitrary growth rules to operate on that domain. They do this by _parameterizing growth rules with a neural network and then optimizing the neural network to obtain the desired pattern of growth_. To showcase the model's expressivity, the authors trained it to arrange a population of a 1600 cells in the shape of a lizard starting from local-only interactions between initially identical cells.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/nca_schema.jpg">
  <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">
  <b>NCA diagram.</b> The diagram above how a neural network can be used to parameterize the growth rules of a cellular autiomata. The <a href="https://distill.pub/2020/growing-ca/">original NCA article</a> uses this diagram to introduce the model and its training procedure.
  </div>
</div>

## Getting started

<!-- We need to start with a high-quality NCA implementation, one that is flexible enough to modify for the purposes of our experiments. The authors of the original NCA paper released a series of excellent Colab notebooks which show how to implement the model in TensorFlow. But after experimenting with their code, I decided to reimplement everything in PyTorch. I like PyTorch better and I wanted to make a minimalist implementation that would be easy to hack on in order to try out new ideas. You can find it [here](https://colab.research.google.com/drive/13wCM9OV2JR004zFvh7zPgUxrga8sU4d1). -->

The authors of the original paper released a Colab notebook that showed how to implement NCA in TensorFlow. Starting from this notebook, we reimplemented everything in PyTorch and boiled it down to a minimalist, 150-line implementation. Our goal was to make the NCA model as simple as possible so that we could hack and modify it without getting overwhelmed by implementation details.

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/13wCM9OV2JR004zFvh7zPgUxrga8sU4d1" id="linkbutton" target="_blank"><span class="colab-span">NCA</span> in 150 lines</a>
</div>

Having implemented our own NCA model, the next step was to scale it to determine the maximum size and complexity of the "organisms" it could produce. We found that the population size was going to be limited by the amount of RAM available on Google Colab GPUs. We maxed things out with a population of about 7500 cells running for about 100 updates. For context, the original paper used a population of 1600 cells running for 86 updates.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/bloopers.jpg">
</div>

Working in this scaled-up regime, we trained our NCA to grow a number of different flowers. Some of the early results were a bit mangled and blurry. Many were biased towards radial symmetry and required extra training in order to reveal symmetric features such as individual petals. But soon, after a few hyperparameter fixes, our NCA was able to grow some "HD" 64x64 flowers:

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:65%">
  <img src="/assets/studying-growth/garden.jpg">
</div>

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/1TgGN5qjjH6MrMrTcStEkdHO-giEJ4bZr" id="linkbutton" target="_blank"><span class="colab-span">HD</span> flowers</a>
</div>

Having implemented the NCA model and gained some intuition for how it trained, we were ready to use it to investigate patterns of biological growth.


## Patterns of biological growth

Biological growth is wonderfully diverse. Consider this passage from the first chapter of _Growth_ by Life Science Library:

_A eucalyptus native to Uganda has been known to grow 45 feet in two years, whereas dwarf ivy generally grows one inch a year. The majestic sequoia of California, which starts out as a seed weighing only one three-thousandth of an ounce, may end up... [with a] weight estimated at 6,200 tons. It takes more than 1,000 years for the sequoia to achieve the feat of multiplying 600 billion times in mass._

_The animal kingdom, too, has its champions of growth. The blue whale, which cruises the oceans from the North to the South Pole, begins life as a barely visible egg weighing only a fraction of an ounce. At birth, it weighs from two to three tons. When it is weaned, at about seven months, it is 52 feet long and weighs 23 tons, having gained an average of 200 pounds a day._

Given the diversity of life forms on our planet, maybe one of the biggest surprises is how much they have in common. For the most part they share the same genetic materials, signaling mechanisms, and metabolic pathways. Their cells have the same life cycles. Indeed, the cellular mechanics in a gnat look pretty similar to those in a blue whale...even though the creatures themselves could not be more different.

### [1. Gnomonic growth](https://colab.research.google.com/drive/1DUFL5glyej725r8VAYDZIFrWvpR6a6-0)

One shared pattern of growth is called _gnomonic growth_. This pattern tends to occur when an organism needs to increase in size and part of its body is defined by a rigid structure. You can see this in clams, for example. Their shells are rigid and cannot be deformed. And yet they need to grow their shells as the rest of them grows. Clams solve this problem by incrementally adding long crescent-shaped lips to the edges of their shells. Each new lip is just a little larger than the one that came before it. These lips, or _gnomons_ as they are called, permit organisms to increase in size without changing form. Gnomons also appear in horns, tusks, and tree trunks.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width:300px">
  <img src="/assets/studying-growth/gnomons.jpeg">
</div>

One of the most famous products of gnomonic growth is the nautilus shell. In this shell, the gnomons grow with such regularity that the overall shape can be modeled with a simple Fibonacci sequence. The elegance and simplicity of the pattern makes it an interesting testbed for NCA.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width:300px">
  <img src="/assets/studying-growth/nautilus_photo.jpeg">
</div>


To set up this problem, we split the shell into three regions: frozen, mature, and growing. These regions are shown in cyan, black and magenta respectively:
<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/nautilus_train.png">
</div>
The cells in the frozen region are, as the name would suggest, frozen. Both their RGBA and hidden channels are fixed throughout training. The cells in the mature region are similar; the only difference is that their hidden channels are allowed to change. The growing region, meanwhile, begins the simulation without any living cells. Cells from the mature region need to grow outwards into this area and arrange themselves properly before the simulation ends.

**Scale and rotation invariance.** Part of the objective in this "gnomonic growth" problem is to learn a growth rule that is scale and rotation invariant. We can accomplish this by rotating and scaling the nautilus template as shown in the six examples above. By training on all of these examples at once, we are able to obtain a model that grows properly at any scale or orientation. Once it learns to do this, it can grow multiple gnomons, one after the other, without much interference. Below, for example, we add eight new compartments and quadruple the shell's size by letting the NCA run for eight growth cycles.[^fn3]

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/nautilus_bw.png">
</div>

One of the things that makes this growth pattern interesting is that the NCA cells have to reach a global consensus as to what the scale and rotation of the mature region is. Only by agreeing on this are they able to construct a properly-sized addition. And yet in practice, we see that expansion into the growth region begins from the first simulation step. This suggests that cells in the mature region try to come to a distributed consensus as to the target shape _even as_ new cells are already beginning to grow that shape. Once cells in the mature region know the proper scale and rotation of the gnomon, they transmit this information to the growing region so that it can make small adjustments to its borders. If you look closely, you can see these adjustments happening in the video below.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="naut_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/nautilus.png">
      <source src="/assets/studying-growth/nautilus.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="naut_video_button" onclick="playPauseNaut()">Play</button>
  </div>
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

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/1DUFL5glyej725r8VAYDZIFrWvpR6a6-0" id="linkbutton" target="_blank"><span class="colab-span">Growing</span> a nautilus</a>
</div>

This process of _reaching a consensus in a decentralized and asynchronous manner_ is a common problem for biological cells. In fact, we already touched on it in our [Self-classifying MNIST Digits](/2020/08/27/selforg-mnist/) post. It's also important in human organizations: from new cities agreeing on development codes, to democratic institutions agreeing on legislation, to the stock market agreeing on how to value companies. It is not always a low-entropy process.

Indeed, sometimes groups of cells have to resort to other means of reaching consensus...


### [2. Embryonic induction](https://colab.research.google.com/drive/1fbakmrgkk1y-ZXamH1mKbN1tvkogNrWq)

The alternative to a fully decentralized consensus mechanism is cellular induction. This happens when one small group of cells (usually in an embryo) tells the rest how to grow. The first group of cells is called the inducing tissue and the second is called the responding tissue. Induction controls the growth of many tissues and organs including the eye and the heart.

In this section, we will grow an image of a newt and then graft part of its eye tissue onto its belly. After doing this, we will watch to see whether those cells are able to induce growth in the rest of the eye in that region. We've chosen this particular experiment as an homage to [Hans Spemann](https://en.wikipedia.org/wiki/Hans_Spemann),[^fn2] who won the Nobel Prize for Medicine in 1935 for using similar experiments on real newts to discover "the organizer effect in embryonic development."[^fn5] Spemann's major insight was that "at every stage of embryonic development, structures already present act as organizers, inducing the emergence of whatever structures are next on the timetable."[^fn7]

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:90%">
  <img src="/assets/studying-growth/newt_timeline_tall.png" style="width:75%; min-width:320px">
  <!-- <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">
    <b>Reproducing Hans Spemann's newt experiment.</b> In the first 100 frames, we grow an image of a newt using the vanilla NCA model described in <a href="https://distill.pub/2020/growing-ca/">Mordvintsev et al. (2020)</a>. Then, in frame 150 we copy the pixels in the yellow rectangle and paste them onto the newt's belly, as shown by the yellow arrow. Note that these pixels contain the upper half of the newt's eye, but not the lower half. We freeze those cells and let the rest of the cells perform updates for another 25 steps. As you can see in frame 175, this induces the belly cells in the blue rectangle to turn black, completing the lower half of the new eye.
  </div> -->
</div>

To reproduce this effect, we first trained an NCA to grow a picture of a newt. Once the growth phase was complete, we grafted a patch of cells from its head onto its stomach. This patch of cells included the upper, light-colored portion of the newt's eye but not the dark-colored, lower portion. Then we froze their states and allowed the rest of the cells to undergo updates as usual. Within 25 steps, the stomach cells below the grafted patch had regrown into a dark-colored strip to complete the lower half of the new eye.

<!-- Hans Spemann's experiment involved the same procedure and produced the same results: he grafted eye lens cells onto the stomach of a real newt and induced the growth of a new eye.
 -->
<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:300px; min-width:250px; display: inline-block; vertical-align: top;text-align:center;">
    <video id="newt_video" style="width:100%;min-width:250px;" controls poster="/assets/studying-growth/newt.jpg">
      <source src="/assets/studying-growth/newt.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="newt_video_button" onclick="playPauseNewt()">Play</button>
  </div>
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

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/1fbakmrgkk1y-ZXamH1mKbN1tvkogNrWq" id="linkbutton" target="_blank"><span class="colab-span">Embryonic</span> induction</a>
</div>

Cellular induction offers a simple explanation for how many growth rules are implemented: by and large, they are implemented as <code>if-then</code> statements. For example, _"If I am growing below some light-colored eye tissue, then I should be black-colored eye tissue."_ Early in embryonic development, these <code>if-then</code> statements are very general: _"If I am on the outside layer of the embryo, then I am going to be an ectoderm cell. Else, if I am on the inside layer of the embryo, then I am going to be a mesoderm cell. Else, if I am in the center of the embryo, then I am going to be an endoderm cell."_

As development progresses, these branching milestones occur dozens of times, each time causing a group of cells to become more specialized. Towards the end of development, the branching rules might read, _"If I am an ectoderm cell and if I am a nervous system cell and if I am an eye cell and if I am distal to the optic nerve then I am going to be part of the corneal epithelium."_

**Attractor theory of development.** While this sounds complex, it's actually the simplest and most robust way to construct a multicellular organism. Each of these branching statements determines how morphogenesis unfolds at a different hierarchy of complexity. Unlike a printer, which has to place every dot of ink on a page with perfect precision, a growing embryo doesn't need to know the final coordinates of every mature adult cell. Moreover, it can withstand plenty of noise and perturbations at each stage of development and still produce an intricate, well-formed organism in the end.[^fn6] Intuitively, this is possible because during each stage of growth, clusters of cells naturally converge to target "attractor" states in spite of perturbations. Errors get corrected before the next stage of growth begins. And in the next stage, new attractor states perform error-correction as well. In this way, embryonic induction allows nature to construct multicellular organisms with great reliability, even in a world full of noise and change.



### [3. Apoptosis](https://colab.research.google.com/drive/1qQcztNsqyMLLMB00CVRxc0Pm7ipca0ww)

**Death to form the living.** One of the most dramatic <code>if-then</code> statements is _"If I am in state <code>x</code>, then I must die."_ This gives rise to what biologists call _apoptosis_, or programmed cell death. Apoptosis is most common when an organism needs to undergo a major change in form: for example, a tadpole losing its tail as it grows into a frog, or a stubby projection in a chick embryo being sculpted into a leg.

<!-- This process is highly choreographed. For example, in the tail of a tadpole, each cell contains a sort of "suicide capsule" full of particular enzymes. When this capsule is broken at the appointed time, the enzymes are released to destroy the cell from the inside. -->

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/apoptosis.jpg">
  <div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">
  <b>Left.</b> The metamorphosis of a tadpole into a frog is a spectacular example of apoptosis. Soon after the tadpole's tail reaches full size, the frog's back legs begin to grow and the tail rapidly shrinks. In the span of a few months it vanishes entirely. <b>Right.</b> A blue dye that stains only dead cells is applied to a four-year-old chick embryo, revealing apoptosis in the wing and foot buds. These cells are programmed to die at an appointed time in order to shape the wings and feet of the newborn chick (see white circles). Even if these cells are moved to another part of the embryo, they still die at the appointed time. Photo credit: <i>Growth</i> from the LIFE Science Library.
  </div>
</div>

One of the best examples of apoptosis in the human body is [_bone remodeling_](https://en.wikipedia.org/wiki/Bone_resorption). This is the process by which bones grow, change shape, and even regrow after a fracture. It's also a process by which the body manages the supply of important minerals and nutrients such as calcium. In the first year of life, bone resorption proceeds at an especially rapid pace. By the end of that year, almost 100% of the skeleton has been absorbed and replaced.

Even in adults, about 10% of the skeleton is replaced every year.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:80%">
  <img src="/assets/studying-growth/grow_bone.png">
</div>

In this experiment, we trained an NCA model to grow into the shape of a slice of human bone. Since the bone starts its growth in the center of the image, but the center of the target image is empty, the NCA naturally learns a growth pattern that resembles apoptosis. Early in development, a small tan circle forms. The outside edge of this circle expands rapidly outward in a pattern of "bone growth" that would be carried out by [osteoblasts](https://en.wikipedia.org/wiki/Osteoblast) in nature. Meanwhile, the inside edge of the circle deteriorates at the same rate in a pattern of "bone resorption" associated with [osteoclasts](https://en.wikipedia.org/wiki/Osteoclast) in nature.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="bone_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/bone.png">
      <source src="/assets/studying-growth/bone.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="bone_video_button" onclick="playPauseBone()">Play</button>
  </div>
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

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/1qQcztNsqyMLLMB00CVRxc0Pm7ipca0ww" id="linkbutton" target="_blank"><span class="colab-span">Growing</span> a bone</a>
</div>

<!-- We should note that the cells in this particular NCA don't exactly _die_. They simply turn white. In the future, we hope to grow images with alpha values below 0.1 in the interior.[^fn8] -->

### [4. Speciation](https://colab.research.google.com/drive/1vG7yjOHxejdk_YfvKhASanNs0YvKDO5-)

We have remarked that gnats and blue whales have more in common, at least in terms of cellular mechanics, than one would guess. They share many of the same cell structures, protiens, and even stages of development like [gastrulation](https://en.wikipedia.org/wiki/Gastrulation). This points to the fact that many different organisms share the same cellular infrastructure. In more closely-related species, this observation is even more apt. For example, the three flowers we grew at the beginning of the article -- the rose, the marigold, and the crocus -- are all [angiosperms](https://en.wikipedia.org/wiki/Flowering_plant) and thus share structures like the [xylem](https://en.wikipedia.org/wiki/Xylem) and [phloem](https://en.wikipedia.org/wiki/Phloem).

Indeed, one of the biggest differences between these flowers is their genetic code. Making an analogy to computers, you might say that they have the same hardware (cell mechanics), but different software (DNA).

Our final experiment uses NCA to explore this idea. We run the same cellular dynamics (NCA neural network weights) across several flowers while varying the genetic information (initial state of the seed cell). Our training objective involved three separate targets: the rose, the marigold, and the crocus, each with its own trainable "seed state." Early in training, our model produced blurry flower-like images with various mixtures of red, yellow, and purple. As training progressed, these images diverged from one another and began to resemble the three target images.

Even though the final shapes diverge, you can still see shared features in the "embryonic" versions of the flowers. If you watch the video below, you can see that the three "embryos" all start out with red, yellow, and purple coloration. The developing crocus, in particular, has both red and purple petals during growth steps 10-20.


<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="seeds_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth/seeds.png">
      <source src="/assets/studying-growth/seeds.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="seeds_video_button" onclick="playPauseSeeds()">Play</button>
  </div>
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

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
  <a href="https://colab.research.google.com/drive/1vG7yjOHxejdk_YfvKhASanNs0YvKDO5-" id="linkbutton" target="_blank"><span class="colab-span">Speciation</span> with NCA</a>
</div>

From a dynamical systems perspective, this NCA model has three different [_basins of attraction_](http://www.scholarpedia.org/article/Basin_of_attraction), one for each flower. The initial seed determines which basin the system ultimately converges to. In the future, it would be interesting to train a model that produces a wider variety of final organisms. Then we could use its "DNA" vectors to construct a "tree of life," showing how closely-related various organisms are[^fn9] and at what point in training they split from a common ancestor.


## Final remarks

There are a number of ways that NCA can contribute to civilization. The prospect of isolating the top one hundred signaling molecules used in natural morphogenesis, tracking their concentrations during growth in various tissues, and then training an NCA to reproduce the same growth patterns with the same morphogens is particularly exciting. This would allow us to obtain a complex model of biological morphogenesis with some degree of predictive power. Such a model could allow us to solve for the optimal cocktail of signaling molecules needed to speed up, slow down, or otherwise modify cell growth. It could even be used to adversarially slow down the growth of cancerous cells in a patient with cancer or artificially accelerate the growth of bone cells in a patient with osteoporosis.

One of the themes of this post is that _patterns of growth are surprisingly similar_ across organisms. This hints at the fact that there are principles of growth that transcend biology. These principles can be studied in a computational substrate in a way that gives useful insights about the original biological systems. These insights, we believe, shine a new light on the everyday miracle of growth.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth/ferns.jpeg">
</div>

## Footnotes
[^fn0]: In this post, we will use "growth rules" to refer to the rules governing how each cell interacts with its neighbors.
[^fn1]: Trunk, Gerard V. "[A problem of dimensionality: A simple example](https://ieeexplore.ieee.org/document/4766926)." IEEE Transactions on pattern analysis and machine intelligence 3 (1979): 306-307.
[^fn2]: And his student Hilde
[^fn3]: Out only interference is to convert growin regions to mature regions and mature regions to frozen regions every 160 steps. This causes the system to move on to the next unit of growth.
[^fn4]: In fact, Conway's Game of Life is Turing Complete; it can be used to simulate computations of arbitrary complexity. It can even be used to [simulate itself](https://twitter.com/AlanZucconi/status/1315967202797981696).
[^fn5]: "[The Organizer-Effect in Embryonic Development](https://www.nobelprize.org/prizes/medicine/1935/spemann/lecture/)," Hans Spemann, Nobel Lecture, December 12, 1935
[^fn6]: There's probably an analogy to be made to fourier analysis where the spatial modes are reconstructed in order of their principal components. Like decompressing a .JPEG file.
[^fn7]: _Growth_, p38.
[^fn8]: In the NCA model, an alpha value below 0.1 indicates a dead cell.
[^fn9]: These "organisms" are actually _images of organisms_ in this context.

<!-- _Now two organisms are exactly alike. Each grows and develops in a unique fashion within the limits that its environment permits. Every species, however, has its own way of growing, and each has its own rate of growth. The range of variations is overwhelming. In as little as three months, for example, one of the grasses native to tropical Ceylon, a bamboo, may shoot up to a height of 120 feet, as tall as a 12-story building, by growing at an average rate of 16 inches a day. A eucalyptus native to Uganda has been known to grow 45 feet in two years, whereas dwarf ivy generally grows one inch a year. The majestic sequoia of California, which starts out as a seed weighing only one three-thousandth of an ounce, may end up 270 feet tall, with a base diameter of 40 feet and a weight estimated at 6,200 tons. It takes more than 1,000 years for the sequoia to achieve the feat of multiplying 600 billion times in mass._

_The animal kingdom, too, has its champions of growth. The blue whale, which cruises the oceans from the North to the South Pole, begins life as a barely visible egg weighing only a fraction of an ounce. At birth, it weighs from two to three tons. When it is weaned, at about seven months, it is 52 feet long and weighs 23 tons, having gained an average of 200 pounds a day. By the time it reaches maturity, in about 13 years, the blue whale is serious competition for many submarines. Then it may weight more than 85 tons and exceet 80 feet in length._ -->

<!-- 
Just as there is a shared but invisible structure -- based on Newtonian physics -- that underlies the motion of the planets or of a falling apple, so too there is shared structure to the growth rules of multicellular organisms. Of course, it's harder to reduce this structure to a clean set of equations than in physics. There are more exceptions and special cases. But since it reoccurs in diverse and unrelated biological organisms, there is good reason to believe that we can reproduce it in simulations of multicellular systems.
 -->