---
layout: post
comments: true
title:  "Six Experiments in Action Minimization"
excerpt: "Using action minimization, we obtain dynamics for six different physical systems including a double pendulum and a gas with a Lennard-Jones potential."
date:   2023-03-12 6:50:00
mathjax: true
author: Sam Greydanus, Tim Strang, and Isabella Caruso
thumbnail: /assets/ncf/thumbnail_six.png
---
<style>
.wrap {
    max-width: 900px;
}
p {
    font-family: sans-serif;
    font-size: 16.75px;
    font-weight: 300;
    overflow-wrap: break-word; /* allow wrapping of very very long strings, like txids */
}
.post pre,
.post code {
    background-color: #fafafa;
    font-size: 14px; /* make code smaller for this post... */
}
pre {
 white-space: pre-wrap;       /* css-3 */
 white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
 white-space: -pre-wrap;      /* Opera 4-6 */
 white-space: -o-pre-wrap;    /* Opera 7 */
 word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:25%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_init" style="width:100%;min-width:250px;">
      <source src="/assets/ncf/video_3body_0.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_init_button" onclick="playPauseInit()">Play</button> 
    <div style="text-align: left;margin-left:10px;margin-right:10px;">The initial, highly-perturbed path for the three body problem.</div>
  </div>
  <div style="width:25%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_final" style="width:100%;min-width:250px;">
      <source src="/assets/ncf/video_3body_f.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_final_button" onclick="playPauseFinal()">Play</button> 
    <div style="text-align:left;margin-left:10px;margin-right:10px;">Dynamics of the three bodies after action minimization.</div>
  </div>
</div>

<script>  
function playPauseInit() { 
  var video = document.getElementById("video_init"); 
  var button = document.getElementById("video_init_button");
  if (video.paused) {
    video.play();
  button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 

function playPauseFinal() { 
  var video = document.getElementById("video_final"); 
  var button = document.getElementById("video_final_button");
  if (video.paused) {
    video.play();
  button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>

In a [recent post](../../../../2023/03/05/ncf-tutorial/), we used gradient descent to find the path of least action for a free body. That this worked at all was interesting -- but some important questions remain. For example: how well does this approach transfer to larger, more nonlinear, and more chaotic systems? That is the question we will tackle in this post.


<div style="display: block; margin-left: auto; margin-right:auto; width:100%; text-align:center;">
  <a href="https://arxiv.org/abs/2303.02115" id="linkbutton" target="_blank">Read the paper</a>
  <a href="https://colab.research.google.com/github/greydanus/ncf/blob/main/tutorial.ipynb" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/ncf" id="linkbutton" target="_blank">Get the code</a>
</div>

## Six systems

In order to determine how action minimization works on more complex systems, we studied six systems of increasing complexity. The first of these was the free body, which served as a minimal working example, useful for debugging. The next system was a simple pendulum -- another minimal working example, but this time with periodic nonlinearities and radial coordinates.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/lagn_plus_schema.png">
</div>

Once we had tuned our approach on these two simple systems, we turned our attention to four more complex systems: a double pendulum, the three body problem, a simple gas, and a real ephemeris dataset of planetary motion (the orbits were projected onto a 2D plane). These systems presented an interesting challenge because they were all nonlinear, chaotic, and high-dimensional.[^fn0] In each case, we compared our results to a baseline path obtained with a simple ODE solver using Euler integration.

## The unconstrained energy effect

Early in our experiments we encountered _the unconstrained energy effect_. This happens when the optimizer converges on a valid physical path with a different total energy from the baseline. The figure below shows an example. The reason this happens is that, although we fix the initial and final states, we do not constrain the path's total energy \\(T+V\\). Even though paths like the one shown below are not necessarily invalid, they make it difficult for us to recover baseline paths.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%;min-width: 300px;">
  <img src="/assets/ncf/unconstrained.png">
</div>

For this reason, we used the baseline ODE paths to initialize our paths, perturbed them with Gaussian noise, and then used early stopping to select for paths which were similar (often, identical) to the ODE baselines. This approach matched the mathematical ansatz of the "calculus of variations" where one studies perturbed paths in the vicinity of the true path. We note that there are other ways to mitigate this effect which don't require an ODE-generated initial path.[^fn1]

## Results

On all six physical systems we obtained paths of least action which were nearly identical to the baseline paths. In the figure below you can also see the optimization dynamics. Our results suggest that action minimization can generate physically-valid dynamics even for chaotic and strongly-coupled systems like the double pendulum and three body problem. One interesting pattern we noticed was that optimization dynamics were dominated by the kinetic energy term $$T$$. This occured because $$S$$ tended to be more sensitive to $$T$$ (which grew as $${\bf \dot{x}}^2$$) than $$V$$.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/results.png">
</div>


## Applications

The goal of this post was just to demonstrate that action minimization scales to larger problems. Nevertheless, we can't help but take a moment to speculate on potential applications of this method:

* <u>ODE super-resolution.</u> If one were to obtain a low-resolution trajectory via a traditional integration method such as Euler integration, one could then upsample the path by a factor of 10 to 100 (using, eg, linear interpolation) and then run action minimization to make it physically-valid. This procedure would take less time than using the ODE integrator alone.
* <u>Infilling missing data.</u> Many real-world datasets have periods of missing data. These might occur due to a sensor malfunction, or they might be built into the experimental setup -- for example, a satellite can't image clouds and weather patterns as well at night -- either way, action minimization is well-suited for inferring the sequence of states that connect a fixed start and end state. Doing this with an ODE integrator, meanwhile, is not as natural because there's no easy way to incorporate the known end state into the problem definition.
* <u>When the final state is irrelevant.</u> There are many simulation scenarios where the final state is not important at all. What really matters is that the dynamics look realistic in between times $$t_1$$ and $$t_2$$. This is the case for simulated smoke in a video game: the smoke just needs to look realistic. With that in mind, we could choose a random final state and then minimize the action of the intervening states. This could allow us to obtain realistic graphics more quickly than numerical methods that don't fix the final state.

## Discussion

Action minimization shows how the action really does act like a cost function. This isn't something you'll hear in your physics courses, even most high-level ones. And yet, it's an elegant and accurate way to view physics. In a future post, we'll see how this notion extends even into quantum mechanics.


## Footnotes
[^fn0]: The state of the simple gas, for example, has a hundred degrees of freedom.
[^fn1]: We discuss these in the Appendix of the paper.

The double pendulum and Lennard-Jones potentials were too long to fit into the table above. Here they are:

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/lagrangians_fn.png">
</div>
