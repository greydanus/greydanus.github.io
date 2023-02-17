---
layout: post
comments: true
title:  "The Action: Nature's Cost Function"
excerpt: "In physics there is a scalar function called the action which behaves like a cost function. Here we minimize it to obtain paths of least action."
date:   2023-02-16 6:50:00
mathjax: true
author: Sam Greydanus, Tim Strang, and Isabella Caruso
thumbnail: /assets/ncf/thumbnail_tutorial.png
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

The purpose of this simple post is to bring to attention a view of physics which isn't often communicated in introductory courses: the view of _physics as optimization_.

It begins with a quantity called the action. If you minimize the action, you can obtain a _path of least action_ which represents the path a physical system will take through space and time. Generally speaking, physicists use analytic tools to do this minimization. In this post, we are going to attempt something different and slightly crazy: minimizing the action with gradient descent. For simplicity, we're going to run our experiment on a very simple system: a free body in a gravitational field. And in order to put our approach in perspective, we're going to begin by reviewing the standard approaches to this kind of problem.

<div style="display: block; margin-left: auto; margin-right:auto; width:100%; text-align:center;">
  <a href="" id="linkbutton" target="_blank">Read the paper</a>
  <a href="https://colab.research.google.com/github/greydanus/ncf/blob/main/tutorial.ipynb" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
  <a href="https://github.com/greydanus/ncf" id="linkbutton" target="_blank">Get the code</a>
</div>

<!-- <div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img style='width:51.6%; min-width:330px;' src="/assets/ncf/hero1.png">
  <img style='width:47.5%; min-width:330px;' src="/assets/ncf/hero2.png">
  <div class="thecap"  style="text-align:left;padding-left:0px;">
    We solve a simulation problem as though it were an optimization problem. First we compute the action <i>S</i>, then we minimize it. In doing so, we deform the initial random path (yellow) into the path of least action (blue). The final path happens to be a parabola -- the trajectory that a falling object would take in the real world.
  </div>
</div> -->

<!-- <div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <img alt="" src="/assets/ncf/hero.png" width="95%" id="lossImage" />
    <div style="text-align:left;margin-left:10px;margin-right:10px;text-align:center">Caption 2</div>
  </div>
</div> -->

### Standard approaches

**The analytic approach.** Here you use algebra, calculus, and other mathematical tools to find a closed-form equation of motion for the system. It gives the state of the system as a function of time. For an object in free fall, the equation of motion would be

$$y(t)=-\frac{1}{2}gt^2+v_0t+y_0.$$

```python
def falling_object_analytic(x0, x1, dt, g=1, steps=100):
    v0 = (x1 - x0) / dt
    t = np.linspace(0, steps, steps+1) * dt
    x = -.5*g*t**2 + v0*t + x0  # the equation of motion
    return t, x

x0, x1 = [0, 2]
dt = 0.19
t_ana, x_ana = falling_object_analytic(x0, x1, dt)
```
<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:300px">
  <img src="/assets/ncf/tutorial_ana.png">
</div>

**The numerical approach.** Not all physics problems have an analytic solution. Some, like the double pendulum or the three-body problem, are deterministic but chaotic. In other words, their dynamics are predictable but we can't know their state at some time in the future without simulating all the intervening states. These we can solve with numerical integration:

$$\frac{\partial y}{\partial t} = v(t) \quad \textrm{and} \quad \frac{\partial v}{\partial t} = -g$$

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
  <img src="/assets/ncf/tutorial_num.png">
</div>

### Our approach

**The Lagrangian method.** The approaches we just covered make intuitive sense. That's why we teach them in introductory physics classes. But there is an entirely different way of looking at dynamics called the Lagrangian method. The Lagrangian method does a better job of describing reality because it can produce equations of motion for _any_ physical system. Lagrangians figure prominently in all four branches of physics: classical mechanics, electricity and magnetism, thermodynamics, and quantum mechanics. Without the Lagrangian method, physicists would have a hard time unifying these disparate fields. But with the [Standard Model Lagrangian](https://www.symmetrymagazine.org/article/the-deconstructed-standard-model-equation) they can do precisely that.

Many of the details of the Lagrangian method are beyond the scope of this post.[^fn0] However, this half-page from David Morin's _Introduction to Classical Mechanics_ does a good job of setting the scene:

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px;">
  <img src="/assets/ncf/morin_ch6.png">
</div>

Earlier in the chapter, Morin asks us to take his word for the fact that L, the Lagrangian, is the difference between the potential and kinetic energy. For a falling particle, L would be \\(\mathcal{L}=T-V=\frac{1}{2}m\dot{y}^2-mgy_0\\). From there, Morin shows that we can use Equation 6.15 to obtain an equation of motion for the system.

**Discretizing the action** In the screenshot above, Morin mentions as an aside, _"If you don’t like infinities, you can imagine breaking up the time interval into, say, a million pieces, and then replacing the integral by a discrete sum."_ The goal of this sentence was to make the idea of a functional more intuitive -- not to provide practical advice for computing the action. But what if we took this sentence literally? What if we used a computer to estimate S (a scalar) and then searched for its stationary values using numerical optimization? In doing so, we could obtain the dynamics of the physical system between times t\\(_1\\) and t\\(_2\\).

### Coding up the discretized action

Let's begin with a list of coordinates, `x`, which contains all the position coordinates of the system between t\\(_1\\) and t\\(_2\\). We can write the Lagrangian and the action of the system in terms of these coordinates. 

```python
def lagrangian_freebody(x, xdot, m=1, g=1):
    T = .5*m*xdot**2
    V = m*g*x
    return T, V
  
def action(x, dt):
    xdot = (x[1:] - x[:-1]) / dt
    xdot = torch.cat([xdot, xdot[-1:]], axis=0)
    T, V = lagrangian_freebody(x, xdot)
    return T.sum()-V.sum()
```

Now let's look for a point of stationary action. Technically, this could be a minimum, a maximum, or an inflection point.[^fn1] Here, though, we're just going to look for a minimum:

```python
def get_path_between(x, steps=1000, step_size=1e-1, dt=1, num_prints=15, num_stashes=80):
    t = np.linspace(0, len(x)-1, len(x)) * dt
    print_on = np.linspace(0,int(np.sqrt(steps)),num_prints).astype(np.int32)**2 # print more, early on
    stash_on = np.linspace(0,int(np.sqrt(steps)),num_stashes).astype(np.int32)**2
    xs = []
    for i in range(steps):
        grad_x = torch.autograd.grad(action(x, dt), x)[0]
        grad_x[[0,-1]] *= 0  # fix first and last coordinates by zeroing their grads
        x.data -= grad_x * step_size

        if i in print_on:
            print('step={:04d}, S={:.4e}'.format(i, action(x, dt).item()))
        if i in stash_on:
            xs.append(x.clone().data.numpy())
    return t, x, np.stack(xs)
```

Now let's put it all together. We can initialize our falling particle's path to be any random path through space. In the code below, we choose a path where the particle bounces around x=0 at random until time t=19 seconds, at which point it leaps up to its final state of x = `x_num[-1]` = 21.3 meters. This path has a high action of S = 5330 J·s. As we run the optimization, this value decreases smoothly until we converge on a parabolic arc with an action of S = -2500 J·s.

```python
dt = 0.19
x0 = 1.5*torch.randn(len(x_num), requires_grad=True)  # a random path through space
x0[0].data *= 0.0 ; x0[-1].data *= 0.0  # set first and last points to zero
x0[-1].data += x_num[-1]  # set last point to be the end height of the numerical solution

t, x, xs = get_path_between(x0.clone(), steps=20000, step_size=1e-2, dt=dt)
```

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:60%; min-width:330px;">
  <img src="/assets/ncf/tutorial_printout.png">
</div>

### Direct comparison between the numerical (ODE) solution and our approach

On the left side of the figure below, we compare the normal approach of ODE integration to our approach of action minimization. As a reminder, the action is the sum, over every point in the path, of kinetic energy \\(T\\) minus potential energy \\(V\\). We compute the gradients of this quantity with respect to the path coordinates and then deform the initial path (yellow) into the path of least action (green). This path resolves to a parabola, matching the path obtained via ODE integration. On the right side of the figure, we plot of the path’s action \\(S\\), kinetic energy \\(T\\), and potential energy \\(V\\) over the course of optimization. All three quantities asymptote at the \\(S\\), \\(T\\), and \\(V\\) values of the ODE trajectory.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
  <img src="/assets/ncf/hero.png">
</div>


### Closing thoughts

The goal of this post was just to demonstrate that it's possible to find a path of least action via gradient descent. Determining whether it has useful applications is a question for another day. Nevertheless, here are a few speculations as to what those applications might look like:

* _ODE super-resolution._ 

* _Infilling missing data._ Some chaotic deterministic systems

* _When the final state is irrelevant._ There are many simulation scenarios where the final state is not important at all. What really matters is that the dynamics look realistic in between times t\\(_1\\) and t\\(_2\\). This is the case for simulated smoke in a video game: the smoke just needs to look realistic. With that in mind, we could choose a random final state and then minimize the action of the intervening states. This could allow us to obtain realistic graphics more quickly than numerical methods that don't fix the final state.

The thing I like most about this little experiment is that it shows how the action really does act like a cost function. This isn't something you'll hear in your physics courses, even high level ones. And yet, it's quite surprising and interesting to learn that nature has a cost function! The action is a very, very fundamental quantity. In a future post, we'll see how this notion extends even into quantum mechanics - with a few modifications of course.

<!-- Basic physical principles and the elegant reasoning behind them are often obscured in the midst of numerical approximations and domain-specific notation. This post shows that it's surprisingly easy to solve physics by working directly in terms of the action. It lets us solve simulation problems as though they are optimization problems -- a surprising result! -->


## Footnotes
[^fn0]: For a thorough introduction to the topic, I recommend [this](https://scholar.harvard.edu/files/david-morin/files/cmchap6.pdf) textbook chapter].
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
