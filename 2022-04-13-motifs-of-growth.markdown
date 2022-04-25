---
layout: post
comments: true
title:  "Using Cellular Automata to Study Motifs of Growth"
excerpt: "We train simulated cells to grow into organisms by communicating with their neighbors. Then we use them to study patterns of growth found in nature."
date:   2022-04-13 11:00:00
mathjax: true
thumbnail: /assets/studying-growth-ii/thumbnail.png
---

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/studying-growth-ii/nautilus_bw.png">
</div>

## Orchestrating growth with embryonic induction ([notebook](https://colab.research.google.com/drive/1fbakmrgkk1y-ZXamH1mKbN1tvkogNrWq))

We grow an image of a newt and then graft its eye onto its belly during development. We do this in homage to [Hans Spemann](https://en.wikipedia.org/wiki/Hans_Spemann) and his student Hilde, who won a Nobel Prize in 1935 for doing something similar with real newts. Need to modify the experiment so that some transplanted skin cells are able to induce growth of a second eye on the newt's belly.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:80%">
  <img src="/assets/studying-growth-ii/newt_timeline_tall.png">
  <div class="thecap"  style="text-align:center; display:block; margin-left: auto; margin-right: auto; width:100%">
  Reproducing embryonic induction in a picture of a newt.
  </div>
</div>

Some more text

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="newt_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth-ii/newt.jpg">
      <source src="/assets/studying-growth-ii/newt.mp4" type="video/mp4">
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


## Building rigid structures with gnomonic growth ([notebook](https://colab.research.google.com/drive/1DUFL5glyej725r8VAYDZIFrWvpR6a6-0))

Grow a Nautilus shell. The neural CA learns to implement a fractal growth pattern which is mostly rotation and scale invariant. The technical term for this pattern is _[gnomonic growth](https://www.geogebra.org/m/waR6eVCQ)_.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="naut_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth-ii/nautilus.png">
      <source src="/assets/studying-growth-ii/nautilus.mp4" type="video/mp4">
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


## Apoptosis: using death to form the living ([notebook](https://colab.research.google.com/drive/1qQcztNsqyMLLMB00CVRxc0Pm7ipca0ww?usp=sharing))

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:80%">
  <img src="/assets/studying-growth-ii/grow_bone.png">
</div>

In this experiment we simulate bone growth. Bone growth is interesting because it uses apoptosis (programmed cell death) in order to produce a hollow area in the center of the bone. We see something analogous happen in our model, with a circular tan frontier that gradually expands outwards until it reaches the size of the target image.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="bone_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth-ii/bone.png">
      <source src="/assets/studying-growth-ii/bone.mp4" type="video/mp4">
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

## Directing growth with genetic material ([notebook](https://colab.research.google.com/drive/1vG7yjOHxejdk_YfvKhASanNs0YvKDO5-))

Train a neural CA that can grow from a seed pixel into one of three different flowers depending on initial value of the seed. From a dynamical systems perspective, we are training a model that has three different basins of attraction, one for each flower. The initial seed determines which basin the system ultimately converges to. The initial seed vs. the shared attractor dynamics are analogous to the DNA of a specific flower vs. the shared cellular dynamics across related flower species.


<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="shared_video" style="width:100%;min-width:250px;" poster="/assets/studying-growth-ii/shared.png">
      <source src="/assets/studying-growth-ii/shared.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="shared_video_button" onclick="playPauseShared()">Play</button>
  </div>
  <div style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%">We grow different flowers using the same NCA weights.</div>
</div>

<script> 
function playPauseShared() { 
  var video = document.getElementById("shared_video"); 
  var button = document.getElementById("shared_video_button");
  if (video.paused) {
    video.play();
    button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>


## Closing thoughts

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



## Footnotes
[^fn0]: In this post, we will use "growth rules" to refer to the rules governing how each cell interacts with its neighbors.
[^fn1]: Trunk, Gerard V. "[A problem of dimensionality: A simple example](https://ieeexplore.ieee.org/document/4766926)." IEEE Transactions on pattern analysis and machine intelligence 3 (1979): 306-307.