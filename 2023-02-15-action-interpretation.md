---
layout: post
comments: true
title:  "History and Interpretation of the Action"
excerpt: "At its conception, the utility of the action was the main focus. But its interpretation is of fundamental interest to physics."
date:   2023-02-16 6:50:00
mathjax: true
author: Sam Greydanus
thumbnail: /assets/ncf/thumbnail_interpretation.png
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
<div class="imgcap_noborder" style="display: inline-block; margin-left: auto; margin-right: auto; width:99.9%;margin-bottom: 0px;">
  <div style="width:225px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <img alt="" src="/assets/ncf/compare.png" width="95%" id="compareImage" />
    <button id="compareButton" onclick="toggleCompare()" class="playbutton">Play</button>
  </div>
</div>

In physics, there is a scalar function called the action which behaves like a cost function. When minimized, it yields the "path of least action" which represents the path a physical system will take through space and time. This function is crucial in theoretical physics and is usually minimized analytically to obtain equations of motion for various problems. In this post, we propose a different approach: instead of minimizing the action analytically, we discretize it and then minimize it directly with gradient descent.

<!-- <div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img style='width:51.6%; min-width:330px;' src="/assets/ncf/hero1.png">
  <img style='width:47.5%; min-width:330px;' src="/assets/ncf/hero2.png">
  <div class="thecap"  style="text-align:left;padding-left:0px;">
    We solve a simulation problem as though it were an optimization problem. First we compute the action <i>S</i>, then we minimize it. In doing so, we deform the initial random path (yellow) into the path of least action (blue). The final path happens to be a parabola -- the trajectory that a falling object would take in the real world.
  </div>
</div> -->

<div style="display: block; margin-left: auto; margin-right:auto; width:100%; text-align:center;">
  <a href="" id="linkbutton" target="_blank">Read the paper</a>
  <a href="https://colab.research.google.com/github/greydanus/ncf/blob/main/tutorial.ipynb" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/ncf" id="linkbutton" target="_blank">Get the code</a>
</div>

<!-- <div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <img alt="" src="/assets/ncf/hero.png" width="95%" id="lossImage" />
    <div style="text-align:left;margin-left:10px;margin-right:10px;text-align:center">Caption 2</div>
  </div>
</div> -->

To put our approach in perspective we will begin by reviewing standard approaches to solving physics problems.

### Standard approaches

**The analytic approach.** Here you use algebra, calculus, and other mathematical tools to find a closed-form equation of motion for the system. It gives the state of the system as a function of time. For an object in free fall, the equation of motion would be

$$y(t)=\frac{1}{2}gt^2+v_0t+y_0.$$

```python
def falling_object_analytic(x0, x1, dt, g=1, steps=100):
  v0 = (x1 - x0) / dt
  t = np.linspace(0, steps, steps+1) * dt
  x = .5*-g*t**2 + v0*t + x0  # the equation of motion
  return t, x

x0, x1 = [0, 2]
dt = 0.19
t_ana, x_ana = falling_object_analytic(x0, x1, dt)
```
<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:300px">
  <img src="/assets/ncf/analytic.png">
</div>

**The numerical approach.** Not all physics problems have an analytic solution. Some, like the double pendulum or the three-body problem, are deterministic but chaotic. In other words, their dynamics are predictable but we can't know their state at some time in the future without simulating all the intervening states. These we can solve by numerical integration

$$\frac{\partial y}{\partial t} = v(t) \quad \textrm{and} \quad \frac{\partial v}{\partial t} = a(t)$$

```python
def falling_object_numerical(x0, x1, dt, g=1, steps=100):
  xs = [x0, x1]
  ts = [0, dt]
  v = (x1 - x0) / dt
  x = xs[-1]
  for i in range(steps-1):
    v += -g*dt
    x += v*dt
    xs.append(x)
    ts.append(ts[-1]+dt)
  return np.asarray(ts), np.asarray(xs)

t_num, x_num = falling_object_numerical(x0, x1, dt)
```
<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:300px">
  <img src="/assets/ncf/numerical.png">
</div>

### Dynamics problems as optimization problems

**The Lagrangian method.** The approaches we just covered make intuitive sense. That's why we teach them in introductory physics classes. But there is an entirely different way of looking at dynamics called the Lagrangian method. The Lagrangian method does a better job of describing reality because it can produce equations of motion for _any_ physical system. Lagrangians figure prominently in all four branches of physics: classical mechanics, electricity and magnetism, thermodynamics, and quantum mechanics. Without the Lagrangian method, physicists would have a hard time unifying these disparate fields. But with the [Standard Model Lagrangian](https://www.symmetrymagazine.org/article/the-deconstructed-standard-model-equation) they can do precisely that.

Many of the details of the Lagrangian method are beyond the scope of this post.[^fn0] However, this half-page from David Morin's _Introduction to Classical Mechanics_ does a good job of setting the scene:

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px;">
  <img src="/assets/ncf/morin_ch6.png">
</div>

Earlier in the chapter, Morin asks us to take his word for the fact that L, the Lagrangian, is the difference between the potential and kinetic energy. For a falling particle, L would be \\(\mathcal{L}=T-V=\frac{1}{2}m\dot{y}^2-mgy_0\\). From there, Morin shows that we can use Equation 6.15 to obtain an equation of motion for the system.

**What if I don't like infinities?** In the screenshot above, Morin mentions as an aside, _"If you don’t like infinities, you can imagine breaking up the time interval into, say, a million pieces, and then replacing the integral by a discrete sum."_ The goal of this sentence was to make the idea of a functional more intuitive -- not to provide practical advice for computing the action. But what if we took this sentence literally? What if we used a computer to estimate S (a scalar) and then searched for its stationary values using numerical optimization? In doing so, we could obtain the dynamics of the physical system between times t\\(_1\\) and t\\(_2\\). To my knowledge, nobody has tried this. Why not give it a shot?

### A simple implementation

Let's begin with a list of coordinates, `x`, which contains all the position coordinates of the system between t\\(_1\\) and t\\(_2\\). We can write the Lagrangian and the action of the system in terms of these coordinates. 

```python
def lagrangian(q, g=1, m=1):
  (x, xdot) = q
  return .5*m*g*xdot**2 - x

def action(x, dt=1):
  '''q is a 1D tensor of n values, one for each (discretized) time step'''
  xdot = (x[1:] - x[:-1]) / dt
  xdot = torch.cat([xdot, xdot[-1:]])  # hacky approximation: v[-1] = v[-2]
  return lagrangian(q=(x, xdot)).sum()
```

Now let's look for a point of stationary action. Technically, this could be a minimum, a maximum, or an inflection point. In many cases, the point of stationary action occurs at a minimum in S.[^fn1] That's the case for this particular problem.

```python
def get_path_between(x, steps=1000, step_size=1e-1, dt=1):
  t = np.linspace(0, len(x)-1, len(x)) * dt
  xs = []
  for i in range(steps):
    grad = torch.autograd.grad(action(x, dt), x)
    grad_x = grad[0]
    grad_x[[0,-1]] *= 0  # fix first and last coordinates by zeroing their grads
    x.data -= grad_x * step_size

    if i % (steps//10) == 0:
      xs.append(x.clone().data)
      print('\ti={:04d}, S={:.3e}'.format(i, action(x).item()))
  return t, x, xs
```

Now let's put it all together. We can initialize our falling particle's path to be any random path through space. In the code below, we choose a path where the particle bounces around x=0 at random until time t=15 seconds, at which point it leaps up to its final state of x=7.5 meters. This path has a large action of S = 54.6 J·s. As we run the optimization, this value decreases smoothly until we converge on a parabolic arc with an action of S = -1292= J·s.

```python
dt = 0.25
x0 = 1.5*torch.randn(61, requires_grad=True)  # a random path through space
x0[0].data *= 0.0 ; x0[-1].data *= 0.0  # set first and last points to zero
x0[-1].data += 7.5  # set last point to 7.5 (end height of analytic solution)

t, x, xs = get_path_between(x0.clone(), steps=5000, step_size=3e-2, dt=dt)
```

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:50%; min-width:330px;">
  <img src="/assets/ncf/output.png">
</div>


### Applications

The goal of this post is to show that this technique is possible. Determining whether it has useful applications is a question for another day. Nevertheless, I can't resist including a few speculations.

**Chaotic deterministic systems.** Some chaotic deterministic systems, such as those found in fluid dynamics, are so sensitive to integration error that no single final state can be predicted with certainty. A more relevant question to ask, then, is _"which of two final states, A or B, is more likely?"_. For example, when making a weather forecast for tomorrow, is weather A or weather B more likely? Minimizing the action may allow us to compute these relative probabilities more efficiently by directly comparing the final values of S.

**When the final state is irrelevant.** There are many simulation scenarios where the final state is not important at all. What really matters is that the dynamics look realistic in between times t\\(_1\\) and t\\(_2\\). This is the case for simulated smoke in a video game: the smoke just needs to look realistic. With that in mind, we could choose a random final state and then minimize the action of the intervening states. This could allow us to obtain realistic graphics more quickly than numerical methods that don't fix the final state.

**Evaluating ensembles of paths.** If one wants to compare many different paths, perhaps all having slightly different outcomes, then one could solve them in parallel with this approach. Importantly, this could be done _even if those paths interact with one another_ as is the case, for example, in quantum mechanics with path integrals. A common way to do this with traditional numerical computing techniques is to compute all-to-all interactions at each timestep or to evolve the system as if it were a probability distribution.

<!-- **Adaptive error and computation time.** The action S is an ideal way to measure integration error. It even has physical units! Each optimization step reduces the error across all the coordinates in the path in proportion to their impact on the action. In order to obtain more accurate dynamics, use more steps of greadient descent. In order to use less computation, run for fewer steps. -->

### Closing thoughts

In describing how he viewed his life's work, Isaac Newton wrote, "_I do not know what I may appear to the world; but to myself I seem to have been only like a boy playing on the seashore, and diverting myself in now and then finding a smoother pebble or a prettier shell than ordinary, whilst the great ocean of truth lay all undiscovered before me._"

May this post offer for your inspection one more shell from that divine shore.

<!-- Like Newton, many contemporary physicists get a sense of awe from discovering this hidden structure. I remember an otherwise somber professor from my undergraduate days jumping out of his seat when the first clicks came out of his muon detector. "Do you hear that? Each click is a particle. Millions of them are showering down from space as we speak."

I hope that this perspective on simulation as optimization serves to deepen that sense of awe
 -->
<!-- The Lagrangian method, applied directly to numerical simulation, is quite elegant and I hope that it confers some of this awe to the casual reader. -->

<!-- There is hidden structure in the world around us. In the tradition of Greek philosophy, noticing that structure and describing it well is considered an intrinsic good. The Pythagoreans were of this view. The Judeo-Christian tradition holds a similar position _"It is the glory of God to conceal a thing, but the honor of kings is to search out a matter."_ Modern science, at its best, continues in this tradition.

For many physicists, this process is accompanied by a sense of awe. I remember an otherwise somber professor from my undergraduate days jumping out of his seat when the first clicks came out of his muon detector. "Do you hear that? Each click is a particle. Millions of them are showering down from space as we speak." In describing how he viewed his life's work, Isaac Newton wrote:

_I do not know what I may appear to the world; but to myself I seem to have been only like a boy playing on the seashore, and diverting myself in now and then finding a smoother pebble or a prettier shell than ordinary, whilst the great ocean of truth lay all undiscovered before me._

The Lagrangian method, applied directly to numerical simulation, is quite elegant and I hope that it confers some of this awe to the casual reader. -->

<!-- <div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/ncf/ferns.jpeg">
</div> -->

## Footnotes
[^fn0]: I have written previously about it here and here. For a thorough introduction to the topic, I recommend [this](https://scholar.harvard.edu/files/david-morin/files/cmchap6.pdf) textbook chapter].
[^fn1]: That's why the whole method is often called _The Principle of Least Action_, a misnomer which I personally picked up by reading the Feynman Lectures.
[^fn2]: Specifically, dynamics problems.


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
