---
layout: post
comments: true
title:  "Self-classifying MNIST Digits"
excerpt: "We treat every pixel in an image as a biological cell. We train these cells to signal to one another and determine what digit they are shaping."
date:   2020-08-27 11:00:00
mathjax: true
author: Sam Greydanus
thumbnail: /assets/selforg-digits/thumbnail.png
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
		  background-color: rgb(148, 196, 146);
		  border-width: 0;
		  /*background-color: rgba(255, 130, 0);*/
		  border-radius: 4px;
		  color: white;
		  padding: 5px 8px;
		  /*width: 60px;*/
		  text-align: center;
		  text-decoration: none;
		  text-transform: uppercase;
		  font-size: 12px;
		  /*display: block;*/
		  /*margin-left: auto;*/
		  margin: 8px 0px;
		  margin-right: auto;
		  min-width:60px;
		}

		.playbutton:hover, .playbutton:active {
		  background-color: rgb(128, 176, 126);
		}
	</style>
</div>

In this project, we treat every pixel in an image as a biological cell. Then we train these cells to send signals to their neighbors so that, over time, the entire population will agree on what digit they are shaping. Every cell "votes" on the global shape by turning one of ten different colors, corresponding to the ten digits. Sometimes the truth prevails and sometimes they are collectively misguided. I like <a href="https://twitter.com/hardmaru/status/1299152583328559105">@hardmaru's example</a>, reproduced below, of a 4 vs. a 2 (🔴 🔵). It's similar to an election process -- it even has “swing states:”

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;">
    <video style="width:100%;min-width:250px;" controls>
    	<source src="/assets/selforg-digits/screencapture.mp4" type="video/mp4">
    </video>
<!--     <div style="text-align: left;margin-left:10px;margin-right:10px;padding-top: 20px;">

    	</div> -->
  </div>
</div>

I encourage you to read the article and try the interactive demo for yourself on Distill:

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<a href="https://distill.pub/2020/selforg/mnist/" id="featuredlink" target="_blank" style="margin-right: 10px;">Read the article on Distill</a>
</div>

## Useful properties of Cellular Automata

One of the takeaways from helping write this Distill article is that cellular automata are fascinating and underrated. In particular, I like them because they are:

**Local.** All interactions in physics are local -- aside from quantum entanglement, and even that is up for debate.[^fn2] All interactions in chemistry and biology are also local, including the interactions between neurons that allow us to learn. The value of locality is that it is one of the _strongest_ bounds on the complexity of a system. Without locality, any unit (atom, molecule, cell, human) can interact with any other, leading to an exponential growth in causal influences on each unit as the size of the system increases. This is bad news if you want to establish any interesting chains of causality between various sub-units.[^fn3] For example, when you store information using a small chunk of matter, you do so under the assumption that that information will remain where it is and not change in response to external factors.

**Parallelizable.** One particularly important advantage of locality is that it makes CAs immensely parallelizable. It's not hard to train or evaluate a large population of CAs asynchronously: disparate parts of the system never have to communicate or synchronize with one another. This is why, if we do live in a simulation, it is probably implemented with a CA.[^fn4]

**Scalable in number of cells.** This is closely connected to "parallelizable." Imagine training a 20x20 population of cells to do something and then running a 200x200 population of them on some downstream task. The numbers are different, but we actually do this in the demo. This is not something you can do with neural networks.

**Expressive.** Given how simple some CAs can be -- for example, Conway's Game of Life -- they have impressive theoretical properties. They are Turing complete and can simulate any other system. You could even use Conway's Game of Life to simulate Conway's Game of Life...and yes, [someone actually did this](https://twitter.com/AlanZucconi/status/1315967202797981696).

**Resilient.** Systems where local interactions eventually lead to global behavior are extraordinarily resilient. You can cut a 2-headed planarian in half and both halves will regenerate. You can cut a limb from a tree and the tree will survive. You can leave your company and your coworkers will continue on without you, barely noticing your absence. Ok, that was a joke, they will miss you, but in theory they should be able to cover for you when you take a few vacation days.

**Likely to fail gracefully.** It's hard to define what it means to "fail gracefully" so this last point is a bit subjective. Consider the failure case of the 4/2 pattern from the video above, reproduced below. That shape is far outside of the CA's training distribution, but it responded in a fairly intuitive manner. On the left is another fun failure case where a CA was trained to grow, from a single cell, into a yellow fish emoji. The population of cells kept growing even after it became a mature fish, but did so in a way that preserved the fish's shape and body texture.


<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:47.3%; min-width:200px; display: inline-block; vertical-align: top;">
    <img src="/assets/selforg-digits/42_color.png" style="width:100%">
  </div>
  <div style="width:52%; min-width:300px; display: inline-block; vertical-align: top;">
    <img src="/assets/selforg-digits/fish.png" style="width:100%">
<!--     <div style="text-align:left;">A plot by <a href="https://doi.org/10.1002/jmor.10013">Lindhe (2002)</a> showing aspect ratio versus wing loading index in some birds, airplanes, a hang-glider, a butterfly, and a maple seed. Just like the families of birds, different human flying machines display substantial variation along these axes.</div> -->
  </div>
</div>

I like CA as a design motif. They capture a set of elegant design principles that, even if we don't follow them strictly at all times in other areas of science, are worth thinking about.

## Parting words

It feels good to have released the Distill article and demo to the world. Now, on thousands of different browser screens, our little cells are coming to life. They are looking at their particular MNIST pixels, talking to their neighbors, and trying to figure out what their overall digit shape is. Little do they know, they are part of a human scientific endeavor that is much the same. For we humans, too, are looking at our local surroundings, talking with our neighbors, and trying to agree on the overall shape of our reality.

Best of luck to the little cells and to us humans as well.

## Footnotes
[^fn1]: My main contribution, by the way, was to help write the article. Alex, Eyvind, and Ettore obtained the core results. I've also been running my own experiments on Neural Cellular Automata lately. Stay tuned for more on this in a future post!
[^fn2]: I want to write a post on this, but I have more reading to do first.
[^fn3]: One of the problems with fully-connected neural networks is that they use very dense connectivity patterns -- denser, perhaps, than locality constraints permit in the brain. In recent years, we've seen that particular connectivity patterns (e.g. the local connectivity of ConvNets) have major advantages.
[^fn4]: Which makes the fact that this article is about CA pretty meta.
[^fn5]: Especially if you're a politician :)
