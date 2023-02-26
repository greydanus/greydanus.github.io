---
layout: post
comments: true
title:  "Six Experiments in Action Minimization"
excerpt: "Using action minimization, we obtain dynamics for six different physical systems including a double pendulum and a gas with a Lennard-Jones potential."
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

In a recent post [link], we used gradient descent to find the path of least action for a free body. That this worked at all was interesting -- but how well this approach transfer to larger, more nonlinear, and more chaotic systems? That is the question we tackle in this short post.


<div style="display: block; margin-left: auto; margin-right:auto; width:100%; text-align:center;">
  <a href="" id="linkbutton" target="_blank">Read the paper</a>
  <a href="https://colab.research.google.com/github/greydanus/ncf/blob/main/tutorial.ipynb" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/ncf" id="linkbutton" target="_blank">Get the code</a>
</div>

## Six Systems

We studied six systems of increasing size and complexity. The first of these was the free body: it served as a minimal working example. The next system was a simple pendulum, which was a minimal working example for studying periodic nonlinearities and radial coordinates.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/lagn_plus_schema.png">
</div>

Once we had tuned our approach on these two simple systems, we turned our attention to four more complex systems: a double pendulum, the three body problem, a simple gas, and a real ephemeris dataset of planetary motion (the orbits were projected onto a 2D plane). These systems presented an interesting challenge because they were all nonlinear, chaotic, and high-dimensional.[^fn0] In each case, we compared our results to a baseline path obtained with a simple ODE solver using Euler integration.

## The unconstrained energy effect

Early in our experiments we encountered _the unconstrained energy effect_. This happens when the optimizer converges on a valid physical path with a different total energy from the baseline. The figure below shows an example. The reason this happens is that, although we fix the initial and final states, we do not constrain the path's total energy \\(T+V\\). Even though paths like the one shown below are not necessarily invalid, they make it difficult for us to recover baseline ODE paths. For this reason, we used the baseline ODE paths to initialize our paths, perturbed them with Gaussian noise, and then used early stopping to select for paths which were similar (often, identical) to the ODE baselines. This approach matched the mathematical ansatz of the "calculus of variations" where one studies perturbed paths in the vicinity of the true path of least action. We note that there are other ways to mitigate this effect which don't require an ODE-generated initial path - we discuss them in the paper.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%;min-width: 300px;">
  <img src="/assets/ncf/unconstrained.png">
</div>

## Results

On all six physical systems we obtained paths of least action which were nearly identical to the baseline paths of the ODE solver. Figure X shows optimization dynamics and qualitative results while Table X shows quantitative results. These results suggest that action minimization can generate physically-valid dynamics even for chaotic and strongly-coupled systems like the double pendulum and three body problem. One interesting pattern we noticed was that optimization dynamics were dominated by the kinetic energy term $$T$$ (third row of Figure X. This occurs because $$S$$ tends to be more sensitive to $$T$$ (which grows as $${\bf \dot{x}}^2$$) than $$V$$. Future methods should focus on stabilizing $$T$$.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/results.png">
</div>


### Applications

The goal of this post was just to demonstrate that it's possible to find a path of least action via gradient descent. Determining whether it has useful applications is a question for another day. Nevertheless, here are a few speculations as to what those applications might look like:

* <u>ODE super-resolution.</u>
* <u>Infilling missing data.</u> Some chaotic deterministic systems
* <u>When the final state is irrelevant.</u> There are many simulation scenarios where the final state is not important at all. What really matters is that the dynamics look realistic in between times $$t_1$$ and $$t_2$$. This is the case for simulated smoke in a video game: the smoke just needs to look realistic. With that in mind, we could choose a random final state and then minimize the action of the intervening states. This could allow us to obtain realistic graphics more quickly than numerical methods that don't fix the final state.

The thing I like most about this little experiment is that it shows how the action really does act like a cost function. This isn't something you'll hear in your physics courses, even high level ones. And yet, it's quite surprising and interesting to learn that nature has a cost function! The action is a very, very fundamental quantity. In a future post, we'll see how this notion extends even into quantum mechanics - with a few modifications of course.


## Footnotes
[^fn0]: The state of the simple gas, for example, has a hundred degrees of freedom.

The double pendulum and Lennard-Jones potentials were too long to fit into the table above. Here they are:

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%;">
  <img src="/assets/ncf/lagrangians_fn.png">
</div>

**Details: gas simulation.** Molecular dynamics (MD) simulations enable investigation of dynamic systems that would be difficult to observe experimentally \citep{hollingsworth2018molecular}. These types of simulations date back to the 1950s, with the earliest work studying hard sphere gasses \citep{alder1959studies}. Today, MD is used to understand far more complicated systems, from helium diffusion in titanium to protein folding \citep{zhang2013molecular, lee2017finding}. These lines of work have advanced in step with our computing abilities. At their most basic and traditional, MD simulations operate by taking the locations of all atoms in the system, using some potential to model interactions between the atoms, calculating each pairwise interaction, and updating the velocities and positions of the atoms accordingly \citep{schroeder2015interactive}.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:40%;min-width: 300px;">
  <img src="/assets/ncf/lj_states.png">
</div>

Our simulation is similar to early MD simulations and simple MD simulations such as \cite{schroeder2015interactive} that are often used to help students understand the properties of gasses in introductory chemistry and physics classes. This simulation is not optimized for a particular material or problem, so there are limits to the quantitative information that we can get from it. We use a Lennard-Jones potential (Figure \ref{fig:capped-lj}) in determining interaction forces for simplicity, but this only describes pairwise interactions. More sophisticated force fields are possible. Even with this simple simulation, we are able to generate a gas-like state and a solid-like state (Figure  \ref{fig:states-lj}), akin to those possible with other simple MD simulations that use a Lennard-Jones potential \citep{schroeder2015interactive,sweet2018facilitating}. 

**Details: Ephemeris experiment.** We downloaded raw ephemeris data for the inner planets of the solar system for the calendar year 2022 (1 day resolution). To do this we used the online interface provided by NASA's Horizons project. We used the Solar System Barycenter (SSB) for a coordinate center. In constructing our simulation, we used the simple gravitational well potential of $$\frac{Gm_i m_j}{r_{ij}}$$ and used SI units for the gravitational constant $G$, planet masses $m$, and durations of time. In exploring whether action minimization could reconstruct the inner planetary orbits, we perturbed only the paths of the inner planets and not that of the Sun. We considered a time duration of two months for this experiment because the orbits of Venus and Mercury cycle more rapidly than that of the Earth (qualitative visualizations of initial and final paths grew difficult as their orbits begin to extend over more than one cycle and overlap their tails).


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
