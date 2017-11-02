---
layout: post
comments: true
title:  "Visualizing and Understanding Atari Agents"
excerpt: "**NOT FINISHED** Deep RL agents are effective at maximizing rewards, but it's often unclear what strategies they use to do so. I'll talk about a paper I just finished, aimed at solving this problem."
date:   2017-11-10 11:00:00
mathjax: true
---

<div class="imgcap">
    <img src="/assets/visualize-atari/robots.png" width="40%">
</div>

Deep RL agents are effective at maximizing rewards, but it's often unclear what strategies they use to do so. I'll talk about a paper I just finished, aimed at solving this problem.

## Solving Atari in 180 lines

<div class="imgcap_noborder">
    <img src="/assets/visualize-atari/breakout-v0.gif" width="20%" style="margin: 0px 20px">
    <img src="/assets/visualize-atari/pong-v0.gif" width="20%" style="margin: 0px 20px">
    <img src="/assets/visualize-atari/spaceinvaders-v0.gif" width="20%" style="margin: 0px 20px">
    <div class="thecap" style="text-align:center"><a href="https://github.com/greydanus/baby-a3c">Baby-A3C</a> after training on 40M frames.</div>
</div>

## Why should I trust you?

[Paper link](https://goo.gl/FQMeYN)

<div class="imgcap_noborder">
    <img src="/assets/visualize-atari/divination.jpg" width="50%">
    <div class="thecap" style="text-align:center">Deep learning algorithms are often perceived as black boxes.</div>
</div>


## Catching cheaters

<div class="imgcap_noborder">
	<iframe width="240" height="370" style="margin: 0px 20px" src="https://www.youtube.com/embed/xXGC6CQW97E?showinfo=0" frameborder="0" allowfullscreen></iframe>
    <iframe width="240" height="370" style="margin: 0px 20px" src="https://www.youtube.com/embed/eeXLUI73RTo?showinfo=0" frameborder="0" allowfullscreen></iframe>
	<div class="thecap" style="text-align:center">Left: a regular agent. Right: an overfit agent</div>
</div>

## Watching agents learn

<div class="imgcap_noborder">
    <img src="/assets/visualize-atari/breakout-learning.png" width="80%">
    <div class="thecap" style="text-align:center">A Breakout agent learns a tunneling strategy.</div>
</div>

<div class="imgcap_noborder">
    <img src="/assets/visualize-atari/pong-learning.png" width="80%">
    <div class="thecap" style="text-align:center">A Pong agent learns a kill shot.</div>
</div>

<div class="imgcap_noborder">
    <img src="/assets/visualize-atari/spaceinvaders-learning.png" width="80%">
    <div class="thecap" style="text-align:center">A SpaceInvaders agent learns an aiming strategy.</div>
</div>

## Going forward

<div class="imgcap_noborder">
    <img src="/assets/visualize-atari/darpa-xai.jpg" width="50%">
    <div class="thecap" style="text-align:center">Obtaining explanations that truly satisfy human users will require not just one, but many tools.</div>
</div>

