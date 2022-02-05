---
layout: post
comments: true
title:  "Studying Growth with Cellular Automata"
excerpt: "We train simulated cells to grow into organisms by communicating with their neighbors. Then we use them to study patterns of growth found in nature."
date:   2022-01-26 11:00:00
mathjax: true
thumbnail: /assets/studying-growth/thumbnail.png
---

<!-- We train simulated cells to organize themselves via morphogenesis. We use them to study motifs of biological growth. -->

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video1" style="width:100%;min-width:250px;">
      <source src="/assets/studying-growth/rose.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video1_button" onclick="playPauseVideo1()">Play</button>
  </div>
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video2" style="width:100%;min-width:250px;">
      <source src="/assets/studying-growth/marigold.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video2_button" onclick="playPauseVideo2()">Play</button>
  </div>
   <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;">
    <video id="video3" style="width:100%;min-width:250px;">
      <source src="/assets/studying-growth/crocus.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video3_button" onclick="playPauseVideo3()">Play</button>
  </div>
  <div style="text-align:left;margin-left:20px;margin-right:20px;">In this post, we'll train simulated cells to organize themselves in a process that resembles biological morphogenesis. In this figure, for example, we are growing a rose, marigold, and crocus from scratch, respectively. The dynamics of these systems resemble common motifs in biological growth.</div>
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
  <a href="" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus" id="linkbutton" target="_blank">Get the code</a>
</div>

## Growth

How can one speak about the miracle of life without speaking about growth? Growth takes many forms. In the most straightforward definition, growth is increase in size. For example, an icicle may grow as additional layers of water freeze to its exterior. And a bank account may grow according to a specified rate of compound interest. These sorts of growth are easy to model with mathematical formulas, and we might respond to any divergence from the norm with surprise. Imagine if a bank suddenly began to pay more interest than usual!

But there are other and more nuanced forms of growth. Consider the growth of a flower, which begins with the most delicate of green buds, but within days produces a detailed microstructure which has enchanted poets and enticed bees since time immemorial. Then there is the complex transformation of a woodland at the onset of spring to consider. And yet more miraculous, there is the growth of young Danny from an infant, to a toddler, to a child, a teenager, and finally an adult. His growth is not only physical but also psychological and moral.

Most mathematical studies of growth are unable to contend with the complexity and nuance of biological systems. If they study these systems at all, it is in aggregate. In aggregate, we are capable of making rough forecasts at the population level, but we are unable to disentangle the intricate causal elements which drive the system. For example, we can plot the average length of a fish or insect throughout development, but when it comes to understanding the mechanics of morphogenesis which gives rises to these changes in size and length, we are far out of our element.

We know that during early morphogenesis, when an organism consists of only two or three cells, concentration gradients with respect to various signaling proteins appear. These gradients, which occur for dozens of independent proteins, direct the individual activities of each cell. And as each cell performs a unique duty in response to its unique set of cues, the small cluster of cells gradually transforms into a community of trillions, each with an important role.

It is not for us to contend with the full complexity of such a system. For now, all we can do is meditate on it with a sense of wonder.

But at a much smaller scale, the tools of machine learning and computational biology have begun to allow us to simulate small, simplistic populations of cells. In these situations, we start with a grid of pixels and imagine that each pixel is actually a cell. We say that each cell has four visible attributes: red, blue, green, and transparency. Each cell also has a set of invisible attributes; this set can vary in size, but we can think of each to these attributes as the concentration of a particular protein at that particular cell’s location. Each of these simulated cells can only observe its status and that of its neighbors. And from these observations, it can alter its observable attributes (red, green blue, and alpha channels) and its hidden attributes (local protein gradients).

In this post, we ask: what complexity of behavior is such a system capable of generating? From our observations of cells in the natural world, we hypothesize that simple concentrations gradients and local interactions between cells are capable of producing virtually limitless complexity. But in order to find a starting place, we will identify a few simple motifs of growth which occur in biological systems and then attempt to replicate them in simulation. In choosing these motifs, we look for properties of growth which cannot be explained using simple equations (as in the case of compound interest or an icicle), but which are simple enough for us to model with cell populations in the range of one thousand to ten thousand (corresponding to images of dimensions 32x32 to 100x100). Furthermore, we require that the growth dynamics be nonlinear — producing changes in the size, shape, color, and scale of the cell population as a whole over the course of development.

With some help from X author and X author, we selected nine motifs of growth which fit this description. They include growth from a point, growth by apoptosis, growth by embryonic induction, gnomonic growth, and phenotypic growth. We will present some simple experiments on each of these in turn, but before we progress any further, we must begin with a discussion of exactly how we simulate these multicellular dynamics, and why.

## On simulating cells and their signals




### [**Minimalist**](https://colab.research.google.com/drive/13wCM9OV2JR004zFvh7zPgUxrga8sU4d1)
A self-contained Neural Cellular Automata Implementation (150 lines of PyTorch). Reimplements all the methods described in [distill.pub/2020/growing-ca/](https://distill.pub/2020/growing-ca/) using the same hyperparameters. Written in PyTorch instead of TensorFlow.

![grow_gecko.png](/assets/studying-growth/grow_gecko.png)

### [**HD Flowers**](https://colab.research.google.com/drive/1TgGN5qjjH6MrMrTcStEkdHO-giEJ4bZr#scrollTo=k-2PCTfGI-pq)
Grow a 64x64 flower using the code in this GitHub repo. Scales up to 70x70 and hundreds of timesteps, which is nearly double the size of the model published in Distill. Flower options include `rose`, `marigold`, and `crocus` as shown in the lead image of this README.

![grow_rose.png](/assets/studying-growth/grow_rose.png)

### [**Multiclass**](https://colab.research.google.com/drive/1vG7yjOHxejdk_YfvKhASanNs0YvKDO5-)
Train a neural CA that can grow from a seed pixel into one of three different flowers depending on initial value of the seed. From a dynamical systems perspective, we are training a model that has three different basins of attraction, one for each flower. The initial seed determines which basin the system ultimately converges to. The initial seed vs. the shared attractor dynamics are analogous to the DNA of a specific flower vs. the shared cellular dynamics across related flower species.

![grow_multiclass.png](/assets/studying-growth/grow_multiclass.gif)

### [**Nautilus**](https://colab.research.google.com/drive/1DUFL5glyej725r8VAYDZIFrWvpR6a6-0)
Grow a Nautilus shell. The neural CA learns to implement a fractal growth pattern which is mostly rotation and scale invariant. The technical term for this pattern is _[gnomonic growth](https://www.geogebra.org/m/waR6eVCQ)_.

![grow_nautilus.png](/assets/studying-growth/grow_nautilus.gif)

### [**Newt**](https://colab.research.google.com/drive/1fbakmrgkk1y-ZXamH1mKbN1tvkogNrWq)
We grow an image of a newt and then graft its eye onto its belly during development. We do this in homage to [Hans Spemann](https://en.wikipedia.org/wiki/Hans_Spemann) and his student Hilde, who won a Nobel Prize in 1935 for doing something similar with real newts.

![newt_graft.png](/assets/studying-growth/newt_graft.png)

### [**Bone**](https://colab.research.google.com/drive/1qQcztNsqyMLLMB00CVRxc0Pm7ipca0ww?usp=sharing)
In this experiment we simulate bone growth. Bone growth is interesting because it uses apoptosis (programmed cell death) in order to produce a hollow area in the center of the bone. We see something analogous happen in our model, with a circular tan frontier that gradually expands outwards until it reaches the size of the target image.

![grow_bone.png](/assets/studying-growth/grow_bone.png)

### [**Worm v1**](https://colab.research.google.com/drive/1wg-PKNwPA5yNzcuyBomZ6IT3Fx2xrewp) [Worm v2](https://colab.research.google.com/drive/1hE8Vxqsf_PZhSitQP1dSg-K022T3jOkK)
In this experiment we grow some simple worm shapes. The idea was to study the dynamics of growth from a point. Growth from a point happens in tapeworms, hair, and fur whereas growth from at least two growth points occurs in plants.

![grow_worm.png](/assets/studying-growth/grow_worm.png)



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
[^fn1]: Trunk, Gerard V. "[A problem of dimensionality: A simple example](https://ieeexplore.ieee.org/document/4766926)." IEEE Transactions on pattern analysis and machine intelligence 3 (1979): 306-307.