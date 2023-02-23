---
layout: post
comments: true
title:  "Six Experiments in Action Minimization"
excerpt: "We obtain dynamics for six different physical systems, including a double pendulum and a gas simulation, by minimizing the action."
date:   2023-02-16 6:50:00
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
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_init" style="width:100%;min-width:250px;">
      <source src="/assets/ncf/video_3body_0.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_sim_button" onclick="playPauseInit()">Play</button> 
    <div style="text-align: left;margin-left:10px;margin-right:10px;">The initial, highly-perturbed path for the three body problem.</div>
  </div>
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
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

In the previous post, we found the path of least action for a free bodyusing gradient descent. That this worked in the first place was interesting, but it is natural to wonder if this approach can transfer to larger, more nonlinear, or more chaotic systems. With this in mind, we are going to apply action minimization to six different physical systems.


<div style="display: block; margin-left: auto; margin-right:auto; width:100%; text-align:center;">
  <a href="" id="linkbutton" target="_blank">Read the paper</a>
  <a href="https://colab.research.google.com/github/greydanus/ncf/blob/main/tutorial.ipynb" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/ncf" id="linkbutton" target="_blank">Get the code</a>
</div>

### Standard approaches

We will begin with two toy problems (one of which is the free body) for the purpose of debugging. Then we will apply our methods to four more complex systems: a double pendulum, the three body problem, a simple gas, and a real ephemeris dataset of planetary motion. These systems presented an interesting challenge because they were all nonlinear, chaotic, and high-dimensional.[^fn0] In each case, we compared our results to a baseline path obtained with a simple ODE solver using Euler integration.

Minimizing the action in the way we have described has not been studied in detail. We have discussed a few related works which do this in the context of the OM function but their scope and details diverge from this work and each other. Thus in our experiments we prioritized simplicity. Unless otherwise specified, we set all constants such as mass and gravity to one. When selecting physical systems, we began with two toy problems (for debugging): a free body and a pendulum. Then we investigated four more complex systems: a double pendulum, the three body problem, a simple gas, and a real ephemeris dataset of planetary motion. These systems presented an interesting challenge because they were all nonlinear, chaotic, and high-dimensional.[^fn0] In each case, we compared our results to a baseline path obtained with a simple ODE solver using Euler integration. The paper gives more details, including the Lagrangians and equations of motion.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/results.png">
</div>

**The unconstrained energy effect.** Early in our experiments we encountered \textit{the unconstrained energy effect}. This happens when the optimizer converges on a valid physical path with a different total energy from the baseline. The figure above shows an example. The reason this happens is that, although we fix the initial and final states, we do not constrain the path's total energy \\(T+V\\). Even though paths like the one in Figure X are not necessarily invalid, they make it difficult for us to recover baseline ODE paths. For this reason, we use the baseline ODE paths to initialize our paths, perturb them with Gaussian noise, and then use early stopping to select for paths which are similar (often, identical) to the ODE baselines. This approach matches the mathematical ansatz of the "calculus of variations" where one studies perturbed paths in the vicinity of the true path of least action. We note that there are other ways to mitigate this effect which don't require an ODE-generated initial path. We discuss them [here], as they are beyond the main scope of this work.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%;min-width: 300px;">
  <img src="/assets/ncf/unconstrained.png">
</div>

**Results.** On all six physical systems we obtained paths of least action which were nearly identical to the baseline paths of the ODE solver. Figure X shows optimization dynamics and qualitative results while Table X shows quantitative results. These results suggest that action minimization can generate physically-valid dynamics even for chaotic and strongly-coupled systems like the double pendulum and three body problem. One interesting pattern we noticed was that optimization dynamics were dominated by the kinetic energy term $$T$$ (third row of Figure X. This occurs because $$S$$ tends to be more sensitive to $$T$$ (which grows as $${\bf \dot{x}}^2$$) than $$V$$. Future methods should focus on stabilizing $$T$$.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:40%;min-width: 300px;">
  <img src="/assets/ncf/lj_states.png">
</div>


### Applications

The goal of this post is to show that this technique is possible. Determining whether it has useful applications is a question for another day. Nevertheless, I can't resist including a few speculations.

**Chaotic deterministic systems.** Some chaotic deterministic systems, such as those found in fluid dynamics, are so sensitive to integration error that no single final state can be predicted with certainty. A more relevant question to ask, then, is _"which of two final states, A or B, is more likely?"_. For example, when making a weather forecast for tomorrow, is weather A or weather B more likely? Minimizing the action may allow us to compute these relative probabilities more efficiently by directly comparing the final values of $$S$$.

**When the final state is irrelevant.** There are many simulation scenarios where the final state is not important at all. What really matters is that the dynamics look realistic in between times t\\(_1\\) and t\\(_2\\). This is the case for simulated smoke in a video game: the smoke just needs to look realistic. With that in mind, we could choose a random final state and then minimize the action of the intervening states. This could allow us to obtain realistic graphics more quickly than numerical methods that don't fix the final state.

**Evaluating ensembles of paths.** If one wants to compare many different paths, perhaps all having slightly different outcomes, then one could solve them in parallel with this approach. Importantly, this could be done _even if those paths interact with one another_ as is the case, for example, in quantum mechanics with path integrals. A common way to do this with traditional numerical computing techniques is to compute all-to-all interactions at each timestep or to evolve the system as if it were a probability distribution.

### Closing thoughts

Once again we have persuaded a path of random coordinates to make a serpentine transition into a structured and orderly parabolic shape -- the shape of the one trajectory that a free body will take under the influence of a constant gravitational field. This is a simple example, but we have investigated it in detail because it is illustrative of the broader "principle of least action" which defies natural human intuition and sculpts the very structure of our physical universe.

In subsequent posts, we will explore how it works in the realm of quantum mechanics. And after that, we will talk about its history: how it was discovered, what its discoverers thought of it. And most importantly, _the lingering speculations as to what, exactly, it means_.


## Footnotes
[^fn0]: The state of the simple gas, for example, has a hundred degrees of freedom.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%;min-width: 330px;">
  <img src="/assets/ncf/lagrangians.png">
</div>

The double pendulum and Lennard-Jones potentials were too long to fit into the table above. Here they are:

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%;min-width: 330px;">
  <img src="/assets/ncf/lagrangians_fn.png">
</div>


<script language="javascript">
  function toggleCompare() {

    path = document.getElementById("compareImage").src
      if (path.split('/').pop() == "compare.png")
      {
          document.getElementById("compareImage").src = "/assets/ncf/compare.gif";
          document.getElementById("compareButton").textContent = "Reset";
      }
      else 
      {
          document.getElementById("compareImage").src = "/assets/ncf/compare.png";
          document.getElementById("compareButton").textContent = "Play";
      }
  }
</script>
