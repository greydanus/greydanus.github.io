---
layout: post
comments: true
title:  "Studying Growth with Cellular Automata"
excerpt: "We train simulated cells to grow into organisms by communicating with their neighbors. Then we use them to study patterns of growth found in nature."
date:   2022-01-26 11:00:00
mathjax: true
thumbnail: /assets/studying-growth/thumbnail.png
---

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
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:75%">We train simulated cells to grow into organisms by communicating with their neighbors. Here these cells are growing into flowers starting from single "seed" pixels.</div>
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
  <a href="https://colab.research.google.com/drive/1TgGN5qjjH6MrMrTcStEkdHO-giEJ4bZr#scrollTo=k-2PCTfGI-pq" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/studying_growth" id="linkbutton" target="_blank">Get the code</a>
</div>

<!-- ## A Productive Question -->

How does a single fertilized egg grow into a population of seventy trillion cells -- a population which can walk, talk, and even write sonnets? This is one of the great unanswered questions of biology. We may never finish answering it; indeed, the mere asking of it should be tempered with a certain degree of humility. Nevertheless, it is a productive question. By asking it over the course of the past seventy years, humans have discovered the structure of DNA, sequenced the human genome, and transformed modern medicine.

In this post, we will use cellular automata to look at one aspect of this question: namely, what rules and logic are executed at the level of a cell in order to produce organized growth at the level of an organism. We will begin by simulating a large population of cells and letting them to interact with one another. Then, by experimenting with the rules that govern their interactions, we will first replicate patterns of biological growth and then examine how they are implemented.

## Growing Neural Cellular Automata

The purpose of cellular automata (CA) is to mimic biological growth at the cellular level. Most CAs begin with a grid of pixels with each pixel representing a different cell. Then a set of growth rules, which control how each cell responds to its neighbors, are repeatedly applied to all the cells in the grid. Although these growth rules are simple to write down, they are chosen so as to produce complex, self-organizing behaviors across the population as a whole. Conway's Game of Life, for example, has just three simple growth rules but it produces wild structures like the one shown below

[image: rules of Conway's Game of Life plus a video of the simulation in action]

Classic versions of cellular automata like the one above are interesting because they produce emergent behavior in spite of using very simple rules. But in many ways these versions of CA are _too simple_. Their cells only get to have two states, dead or alive, whereas biological cells get to have a near-infinite number of states, states which are determined by a wide variety of genetic materials, enzymes, and signaling protiens. We refer to all these things as _morphogens_ because they work together to control growth and guide organisms towards specific final shapes or _morphologies_.

Based on this observation, we should move away from cells that are only dead or alive. Rather, we should allow cells to exist in a variety of states, with each state defined by a list of variables. Growth rules should operate on combinations of these variables in the same way that biological growth rules operate on combinations of different morphogens. Finally, the self-organizing behaviors of these cells should be able to converge to _specific_ large-scale morphologies rather than arbitrary ones.

[image: chart comparing biological cells vs. cellular automata vs. neural cellular automata]

A major step in this direction was Mordvintsev et al. (2020)'s [Neural Cellular Automata](https://distill.pub/2020/growing-ca) (NCA) model. This model represented each cell state with an \\(n\\)-dimensional vector of scalar values and then allowed arbitrary growth rules to operate on the expanded domain. It did this by _parameterizing growth rules with a neural network and then optimizing the neural network to obtain the desired pattern of growth_. Mordvintsev et al. trained their model to arrange a population of over a thousand cells in the shape of a lizard using purely local interactions.

[image: lizard NCA]

## Growing flowers with NCA

Neural Cellular Automata represent a promising and underexplored tool for simulating growth. The purpose of this work is to see what they can tell us about how specific patterns of biological growth unfold.


## Outline

* The miracle of growth (charismatic introduction)
* Simulating populations of cells
  * Use flowers as an example
  * Flesh out analogy: seed=one pixel, target photo=adult organism, etc.
  * Show videos after varying number of training steps
  * Talk about value and expressiveness of this approach
* Healing tissues with self-organization
* Orchestrating growth with embryonic induction
* Building rigid structures with gnomonic growth
* Apoptosis: death to form the living
* Directing growth with genetic material
* Closing thoughts (+ future experiments)




### [**Simulating populations of cells**](https://colab.research.google.com/drive/1TgGN5qjjH6MrMrTcStEkdHO-giEJ4bZr#scrollTo=k-2PCTfGI-pq)
Grow a 64x64 flower using the code in this GitHub repo. Scales up to 70x70 and hundreds of timesteps, which is nearly double the size of the model published in Distill. Flower options include `rose`, `marigold`, and `crocus` as shown in the lead image of this README.

![grow_rose.png](/assets/studying-growth/grow_rose.png)

### [**Healing tissues with self-organization**](https://colab.research.google.com)
Look at neural textures, taking images and videos from Distill article

### [**Orchestrating growth with embryonic induction**](https://colab.research.google.com/drive/1fbakmrgkk1y-ZXamH1mKbN1tvkogNrWq)
We grow an image of a newt and then graft its eye onto its belly during development. We do this in homage to [Hans Spemann](https://en.wikipedia.org/wiki/Hans_Spemann) and his student Hilde, who won a Nobel Prize in 1935 for doing something similar with real newts. Need to modify the experiment so that some transplanted skin cells are able to induce growth of a second eye on the newt's belly.

![newt_graft.png](/assets/studying-growth/newt_graft.png)

### [**Building rigid structures with gnomonic growth**](https://colab.research.google.com/drive/1DUFL5glyej725r8VAYDZIFrWvpR6a6-0)
Grow a Nautilus shell. The neural CA learns to implement a fractal growth pattern which is mostly rotation and scale invariant. The technical term for this pattern is _[gnomonic growth](https://www.geogebra.org/m/waR6eVCQ)_.

![grow_nautilus.png](/assets/studying-growth/grow_nautilus.gif)

### [**Apoptosis: using death to form the living**](https://colab.research.google.com/drive/1qQcztNsqyMLLMB00CVRxc0Pm7ipca0ww?usp=sharing)
In this experiment we simulate bone growth. Bone growth is interesting because it uses apoptosis (programmed cell death) in order to produce a hollow area in the center of the bone. We see something analogous happen in our model, with a circular tan frontier that gradually expands outwards until it reaches the size of the target image.

![grow_bone.png](/assets/studying-growth/grow_bone.png)

### [**Directing growth with genetic material**](https://colab.research.google.com/drive/1vG7yjOHxejdk_YfvKhASanNs0YvKDO5-)
Train a neural CA that can grow from a seed pixel into one of three different flowers depending on initial value of the seed. From a dynamical systems perspective, we are training a model that has three different basins of attraction, one for each flower. The initial seed determines which basin the system ultimately converges to. The initial seed vs. the shared attractor dynamics are analogous to the DNA of a specific flower vs. the shared cellular dynamics across related flower species.

![grow_multiclass.png](/assets/studying-growth/grow_multiclass.gif)

### Closing thoughts (+ future experiments)



____________________________________________________________







**Relevant things**
* Minimal 100-line PyTorch reimplementation
* Improvements that help; changes; ease of training
* Grow some flowers at 70x70
* Learning seeds for different flowers (shared weights) (make a small dataset of different flowers...then breed them)
* Make a garden of flowers
* Talk about connections to biology & what that would allow us to do
* Draw a schema of what it would look like
* Talk about what this would let us do someday
* Close with some artistic quotes about growth; maybe end with some mushroons
*[Nautilus link](https://www.nicepng.com/ourpic/u2t4e6t4o0i1w7q8_549-x-750-4-nautilus-shell-drawing/)

Also
* Other loss functions: fluid sim, structural optimization, 

**Outline**
* Romantic and beautiful introduction; channel Phil Anderson & More is different; talk about _simplicity_
* 

**Applications**
* Art
* Studying developmental diseases
* Tackling cancer
* A more decentralized internet
* Physics simulations

## Closing thoughts

There is a counterintuitive possibility that in order to explore the limits of how large we can scale neural networks, we may need to explore the limits of how small we can scale them first. Scaling models and datasets downward in a way that preserves the nuances of their behaviors at scale will allow researchers to iterate quickly on fundamental and creative ideas. This fast iteration cycle is the best way of obtaining insights about how to incorporate progressively more complex inductive biases into our models. We can then transfer these inductive biases across spatial scales in order to dramatically improve the sample efficiency and generalization properties of large-scale models. We see the humble MNIST-1D dataset as a first step in that direction.

## Footnotes
[^fn0]: In this post, we will use "growth rules" to refer to the rules governing how each cell interacts with its neighbors.
[^fn1]: Trunk, Gerard V. "[A problem of dimensionality: A simple example](https://ieeexplore.ieee.org/document/4766926)." IEEE Transactions on pattern analysis and machine intelligence 3 (1979): 306-307.