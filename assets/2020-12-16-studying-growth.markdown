---
layout: post
comments: true
title:  "Studying Growth with Cellular Automata"
excerpt: "We train simulated cells to organize themselves via morphogenesis. We use them to study motifs of biological growth."
date:   2021-05-07 11:00:00
mathjax: true
thumbnail: /assets/studying-growth/thumbnail.png
---

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