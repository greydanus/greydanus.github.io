---
layout: post
comments: true
title:  "Optimizing a Wing Inside a Fluid Simulation"
excerpt: "How does physics shape flight? To show how fundamental wings are, I derive one from scratch by differentiating through a wind tunnel simulation."
date:   2020-10-14 11:00:00
mathjax: true
author: Sam Greydanus
thumbnail: /assets/optimizing-a-wing/thumbnail.png
---

<p style="font-size: 20px;text-align: center;color: #999;"><i>(My last post in a series about human flight; <a target="_blank" style="color: #777;" href="../../../../2020/10/12/story-of-flight/">post 1</a>, <a target="_blank" style="color: #777;" href="../../../../2020/10/13/stepping-stones/">post 2</a>).</i></p>


<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; text-align:center; width:80%" >
    <img alt="" src="/assets/optimizing-a-wing/wing_shape.png" onclick="toggleWingShape()" style="width:315px" id="wingShapeImage" />
    <img alt="" src="/assets/optimizing-a-wing/wing_flow.png" onclick="toggleWingFlow()" style="width:315px" id="wingFlowImage" />
	<div class="thecap" style="text-align:left;"><b>Figure 1:</b> In this post, we'll simulate a wind tunnel, place a rectangular occlusion in it, and then use gradient descent to turn it into a wing. <p style="color:grey; display:inline;">[The images above are videos. Click to pause or play.]</p></div>
</div>

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
	<a href="https://bit.ly/3j3Wcu4" id="linkbutton" target="_blank">Read the paper</a>
	<a href="https://bit.ly/2H5r401" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
	<a href="https://github.com/greydanus/optimize_wing" id="linkbutton" target="_blank">Get the code</a>
</div>

Legos are an excellent meta-toy in that they represent the potential for a near-infinite number of toys depending on how you assemble them. Each brick has structure. But each brick is only interesting to the extent that it can combine with other bricks, forming new and more complex structures. So in order to enjoy Legos, you have to figure out how they fit together and come up with a clever way of making the particular toy you have in mind. Once you have mastered a few simple rules, the open-ended design of Lego bricks lets you build anything you can imagine.

Our universe has the same versatile structure. It seems to run according to just a few simple forces, but as those forces interact, they give rise to intricate patterns across many scales of space and time. You see this everywhere you look in nature -- in the fractal design of a seashell or the intricate polities of a coral. In the convection of a teacup or the circulation of the atmosphere. And this simple structure even determines the shape and behavior of man's most complicated flying machines.


To see this more clearly, we are going to start from the basic physical laws of airflow and use them to derive the shape of a wing.[^fn18] Since we are using so few assumptions, the wing shape we come up with will be as fundamental as the physics of the air that swirls around it. This is pretty fundamental. In fact, if an alien species started building flying machines on another planet, they would probably converge on a similar shape.

## Navier-Stokes

We will begin this journey with the [Navier-Stokes equation](https://www.britannica.com/science/Navier-Stokes-equation), which sums up pretty much everything we know about fluid dynamics. It describes how tiny fluid parcels interact with their neighbors. The process of solving fluid dynamics problems comes down to writing out this equation and then deciding which terms we can safely ignore. In our case, we would like to simulate the flow of air through a wind tunnel and then use it to evaluate various wing shapes.

Since the pressure differences across a wind tunnel are small, one of the first assumptions we can make is that air is incompressible. This lets us use the [incompressible form](https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations#Incompressible_flow) of the Navier-Stokes equation:


<span id="longEqnWithSmallScript_A" style="display:block; margin-left:auto;margin-right:auto;text-align:center;">
$$
\underbrace{\frac{\partial \mathbf{u}}{\partial t}}_{\text{velocity update}} ~=~ - \underbrace{(\mathbf{u} \cdot \nabla)\mathbf{u}}_{\text{self-advection}} ~+~ \underbrace{\nu \nabla^2 \mathbf{u}}_{\text{viscous diffusion}} \\
~+~ \underbrace{f}_{\text{velocity $\uparrow$ due to forces}}
$$
</span>
<span id="longEqnWithLargeScript_A" style="display:block; margin-left:auto;margin-right:auto;text-align:center;">
$$
\underbrace{\frac{\partial \mathbf{u}}{\partial t}}_{\text{velocity update}} ~=~ - \underbrace{(\mathbf{u} \cdot \nabla)\mathbf{u}}_{\text{self-advection}} ~+~ \underbrace{\nu \nabla^2 \mathbf{u}}_{\text{viscous diffusion}} ~+~ \underbrace{f}_{\text{velocity $\uparrow$ due to forces}}
$$
</span>

Another term we can ignore is viscous diffusion. Viscous diffusion describes how fluid parcels distribute their momenta due to sticky interactions with their neighbors. We would say that a fluid with high viscosity is "thick": common examples include molasses and motor oil. Even though air is much thinner, viscous interactions still cause a layer of slow-moving air to form along the surface of an airplane wing. However, we can ignore this boundary layer because its contribution to the aerodynamics of the wing is small compared to that of self-advection.

The final term we can ignore is the forces term, as there will be no forces on the air once it enters the wind tunnel. And so we are left with but a hair of the original Navier-Stokes hairball:

$$
\underbrace{\frac{\partial \mathbf{u}}{\partial t}}_{\text{velocity update}} = \underbrace{- (\mathbf{u} \cdot \nabla)\mathbf{u}}_{\text{self-advection ("velocity follows itself")}}
$$

This simple expression describes the effects that really dominate wind tunnel physics. It says, intuitively, that "the change in velocity over time is due to the fact that velocity follows itself." So the entire simulation comes down to two simple rules:

<ul>
	<li>
		Rule 1: Velocity follows itself <div id="advection_info_toggle" onclick="hideShowAdvection()" style="cursor: pointer;display:inline">(+)</div>
		<ul>
		<div id="advection_info" style="display: none;"><i>The technical term for this effect is "self-advection." Advection is when a field, say, of smoke, is moved around by the velocity of a fluid. Self-advection is a special case where the field being advected is the velocity field, and so it actually advects itself. In principle, a self-advection step is as simple as moving the velocity field according to x' = v * dt + x at every point on the grid. We can simulate self-advection over time by repeating this over and over again.</i></div>
		</ul>
	</li>
	<li>
		<!-- <b>Rule 1: Velocity follows itself</b> -->
		Rule 2: Volume is conserved <div id="projection_info_toggle" onclick="hideShowProjection()" style="cursor: pointer;display:inline">(+)</div>
		<ul>
		<div id="projection_info" style="display: none;"><i>This rule comes from our incompressibility assumption and the process of enforcing it is called projection. Since volume is conserved, fluid parcels can only move into positions that their neighbors have recently vacated. This puts a strong constraint on our simulation's velocity field: it needs to be volume-conserving. Fortunately, Helmholtz’s theorem tells us that any vector field can be decomposed into an incompressible field and a gradient field, as a figure from <a href="https://drive.google.com/file/d/1upKFdtnM0xcTVxNsPHI1KCvmcanAJheL/view?usp=sharing">this paper</a> shows:
			<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%">
				<img src="/assets/optimizing-a-wing/decomposition.png" style="width:100%">
			</div>
		One way to make our velocity field incompressible is to find the gradient field and then subtract it from the original field as shown above. This <i>projects</i> our velocity field onto a volume-conserving manifold.</i>
		</div>
		</ul>
	</li>
</ul>

By alternating between these two rules, we can iteratively 1) move the system forward in time and 2) enforce conservation of volume and mass. In practice, we implement each rule as a separate function and then apply both functions to the system at every time step. This allows us to simulate, say, a gust of wind passing through the wind tunnel. But before we can direct this wind over a wing, we need to decide how to represent the wing itself.

## Representing the Wing

<div>
<div style="display:inline">The wing is an internal boundary, or occlusion, of the flow. A good way to represent an occlusion is with a mask of zeros and ones. But since the goal of our wind tunnel is to try out different wing shapes, we need our wing to be continuously deformable. So we will allow the mask to take on continuous values between zero and one, making it semi-permeable in proportion to its mask values. This lets us add semi-permeable obstructions to the wind tunnel as shown:</div> <div id="filter_info_toggle" onclick="hideShowFilter()" style="cursor: pointer;display:inline">(+)</div>
</div>


<div id="filter_info" style="display: none;"><i><b>A note on filtering.</b> In practice, the wing is still not quite continuously deformable. Big differences in the mask at neighboring grid points can lead to sharp boundary conditions and non-physical airflows around the mask. One way to reduce this effect is to apply a Gaussian filter around the edges of the mask so as to prevent these grid-level pathologies. This approach may seem a bit arbitrary at first glance, but it is actually a common simulation technique used in, for example, <a href="https://doi.org/10.1007/s00158-010-0594-7">topology optimization</a>, <a href="https://web.stanford.edu/group/ctr/ResBriefs03/gullbrand.pdf">large</a> <a href="https://doi.org/10.1063/1.3485774">eddy simulation</a>, and <a href="https://graphics.stanford.edu/courses/cs468-03-fall/Papers/Levin_MovingLeastSquares.pdf">3D graphics</a>.</i></div>

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:19.5%; min-width:150px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/mask/mask_0.00.png" style="width:100%">
    <div style="text-align: left;">Mask = 0.0</div>
  </div>
    <div style="width:19.5%; min-width:150px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/mask/mask_0.05.png" style="width:100%">
    <div style="text-align: left;">Mask = 0.05</div>
  </div>
    <div style="width:19.5%; min-width:150px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/mask/mask_0.12.png" style="width:100%">
    <div style="text-align: left;">Mask = 0.12</div>
  </div>
  <div style="width:19.5%; min-width:150px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/mask/mask_0.50.png" style="width:100%">
    <div style="text-align: left;">Mask = 0.5</div>
  </div>
  <div style="width:19.5%; min-width:150px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/mask/mask_1.00.png" style="width:100%">
    <div style="text-align: left;">Mask = 1.0</div>
  </div>
</div>

## Choosing an Objective

Now we are at the point where we can simulate how air flows over arbitrary, semi-permeable shapes. But in order to determine which of these shapes makes a better wing, we still need to define a measure of performance. There are many qualities that one could look for in a good wing, but we will begin with the most obvious: it should convert horizontal air velocity into upward force as efficiently as possible. We can measure this ability using something called the lift-drag ratio where "lift" measures the upward force generated by the wing and "drag" measures the frictional forces between the air and the wing. Since "change in downward airflow" in the tunnel is proportional to the upward force on the wing, we can use it as a proxy for lift. Likewise, "change in rightward airflow" is a good proxy for the drag forces on the wing. With this in mind, we can write out the objective function as

$$
\max_{\theta} L/D
$$

where \\(\theta\\) represents some tunable parameters associated with the shape of the wing mask and \\(L/D\\) can be obtained using the initial and final wind velocities of the simulation according to

$$
\begin{align}
     L/D &= \frac{\text{lift}}{\text{drag}}\\
    &= \frac{\text{change in downward airflow}}{-\text{change in rightward airflow}}\\
    &= \frac{ -\big ( v_y(t)-v_y(0) \big )}{-\big ( v_x(t)-v_x(0) \big )}\\
    &= \frac{ v_y(t)-v_y(0) }{ v_x(t)-v_x(0)}
\end{align}
$$

Solving this optimization problem will give us a wing shape that generates the most efficient lift possible. In other words, we new have the correct problem setup; what remains is to figure out how to solve it.

## Optimization

<div>
<div style="display:inline">We are going to solve this problem with gradient ascent. Gradient ascent is simple and easy to implement, but there is one important caveat: we need a way to efficiently compute the gradient of the objective function with respect to the wing mask parameters. This involves differentiating through each step of the fluid simulation in turn – all of the way back to the initial conditions. This would be difficult to implement by hand, but fortunately there is a tool called <a href="https://github.com/HIPS/autograd">Autograd</a> which can perform this back-propagation of gradients automatically. We will use Autograd to compute the gradients of the mask parameters, move the mask parameters in that direction, and then repeat this process until the lift-drag ratio reaches a local maximum.</div> <div id="autograd_info_toggle" onclick="hideShowAutograd()" style="cursor: pointer;display:inline">(+)</div>
</div>

<div id="autograd_info" style="display: none;"><i><b>A note on Autograd.</b> Amazingly, every mathematical operation we've described so far – from the wing masking operation to the advection and projection functions to the lift-drag ratio – is differentiable. This is why we can use Autograd to compute analytic gradients with respect to the mask parameters. Autograd uses <a href="https://en.wikipedia.org/wiki/Automatic_differentiation">automatic differentiation</a>, closely related to the <a href="http://www.dolfin-adjoint.org/en/latest/documentation/maths/2-problem.html">adjoint method</a>, to propagate gradient information backwards through the simulation until it reaches the parameters of the wing mask. We can do all of this in a one-line function transformation:<code>grad_fn = autograd.value_and_grad(get_lift_drag_ratio)</code>.</i></div>

So let’s review. Our goal is to simulate a wind tunnel and use it to derive a wing shape. We began by writing down the general Navier-Stokes equation and eliminating irrelevant terms: all of them but self-advection. Next, we figured out how to represent a wing shape in the tunnel using a continuously-deformable occlusion. Finally, we wrote down an equation for what a good wing should do and discussed how to optimize it. Now it is time to put everything together in about two hundred lines of code and see what happens when we run it...

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px; text-align:center;">
	<img alt="" src="/assets/optimizing-a-wing/optimize_wing.png" />
</div>

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:43%; min-width: 300px; text-align:center;">
	<p style="display:inline;"><div style="color:black;font-size: 18px">Final result</div> <div style="color:grey;">[Click image to pause or play.]</div></p>
	<img style="width:100%" alt="" src="/assets/optimizing-a-wing/wing.png" onclick="toggleBasicWing()" id="basicWing" />
</div>

Sure enough, we get a beautiful little wing. Of all possible shapes, this is the very best one for creating efficient lift in our wind tunnel. This wing is definitely a toy solution since our simulation is coarse and not especially accurate. However, after making a few simple improvements we would be able to design real airplane wings this way. We would just need to:

1. Simulate in 3D instead of 2D
2. Use a mesh parameterization instead of a grid
3. Make the flow laminar and compressible

Aside from these improvements, the overall principle is much the same. In both cases, we write down some words and symbols, turn them into code, and then use the code to shape our wing.[^fn14] The fact that we can do all of this without ever building a physical wing makes it feel a bit like magic. But this process really works, for when we [put these wings on airplanes](http://aero-comlab.stanford.edu/Papers/jameson-cincin-pm.pdf#page=36) and trust them with our lives, they carry us safely to our destinations.[^fn3] [^fn17]




Just like the real wind tunnels of the twentieth century, these simulated wind tunnels need to go through lots of debugging before we can trust them. In fact, while building this demo we discovered a number of ways that things can go wrong. Here are some of the most amusing failure cases:

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<img src="/assets/optimizing-a-wing/sim_bloopers.png" style="width:100%">
</div>

Several of these wings are just plain dreadful. But others seem reasonable, if unexpected. The two-wing solution is particularly amusing. We did not intend for this "biplane" solution to occur, and yet it is a completely viable way of solving the objective we wrote down. One advantage to keeping the problem setup so simple is that, in doing so, we left space for these surprising behaviors to occur.

## The Manifold of Solutions

There are variations on the base wing shape which excel in particular niches. Sometimes we will want a wing that is optimal at high speeds and other times we will want one that is optimal at low speeds. In order to accommodate a large fuselage, we might want an extra-thick wing. Alternatively, in order to reduce its overall weight, we might want to keep it thin. It turns out that we can change simulation parameters and add auxiliary losses to find optimal wing shapes for each of these scenarios.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:60%; min-width: 300px">
	<img src="/assets/optimizing-a-wing/sim_manifold.png" style="width:100%">
</div>
Our wind tunnel simulation is interesting first, because it illustrates how the Platonic ideal of wing design is rooted in the laws of physics. As we saw in the earlier posts, there were many cultural and technological forces that contributed to airfoil design. These forces were important for many reasons, but they were not the primary factor in the wing shapes they produced -- physics was.

But to balance this idea, we have also shown how a million variants of the Platonic form of a wing can fulfill particular needs. Indeed, these variants could be said to occupy complimentary niches in the same way that different birds and flying insects occupy different niches in nature. After all, even though nature follows the laws of physics with absolute precision, she takes a consummate joy in variation. Look at the variety of wing shapes in birds, for example.[^fn4] Species of hummingbirds have wings with low aspect ratios that enable quick, agile flight patterns. Other birds, like the albatross, have high aspect ratios for extreme efficiency. Still others, like the common raven, are good all-around fliers. Remarkably, we are beginning to see this same speciation occur in modern aircraft as well. There are surveillance planes built for speed and stealth, short-winged bush planes built for maneuverability, and massive commercial airliners built for efficiency.[^fn5]

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:36.4815%; min-width:200px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/bird_shapes.png" style="width:100%">
    <div style="text-align: left;">A figure from <a href="https://doi.org/10.2307/3677110">Lockwood (1998)</a> arranging bird species by wing pointedness and wingtip convexity. Different wing designs stem from adaptations to different ecological niches.</div>
  </div>
  <div style="width:62.073%; min-width:300px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/norberg2002.png" style="width:100%">
    <div style="text-align:left;">A plot by <a href="https://doi.org/10.1002/jmor.10013">Lindhe (2002)</a> showing aspect ratio versus wing loading index in some birds, airplanes, a hang-glider, a butterfly, and a maple seed. Just like the families of birds, different human flying machines display substantial variation along these axes.</div>
  </div>
</div>

Perhaps less intuitively, even a single bird is capable of a huge range of wing shapes. The falcon, for example, uses different wing shapes for soaring, diving, turning, and landing. Its wings are not static things, but rather deformable, dynamic objects which are constantly adapting to their surroundings. And once again, we are beginning to see the same thing happen in modern aircrafts like the Boeing 747. The figure below shows how its triple-slotted wing design lets pilots reconfigure the airfoil shape during takeoff, cruising, and landing.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:55%; min-width:250px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/bird_morph.png" style="width:100%">
  </div>
  <div style="width:44.3%; min-width:250px; display: inline-block; vertical-align: top;">
    <img src="/assets/optimizing-a-wing/plane_morph.png" style="width:100%">
  </div>
</div>

## Closing Thoughts

One of the lessons from attempting to optimize a wing is that the optimization itself is never the full story. When we write down the optimization objective (like we did above), our minds already have a vague desire to obtain a wing. And behind that desire, our minds may want to obtain a wing because we are drawn to the technology of flight. And perhaps we are drawn to flight for the same reasons that the early aviators were -- because it promises freedom, glory, and adventure. And behind those desires -- what? The paradox of an objective function is that it always seems to have a deeper objective behind it.

The deeper objectives do not change as quickly. Even as the early aviators progressed from wingsuits to gliders to planes, they retained the same fundamental desire to fly. Their specific desires, of course, were different: some wanted to survive a tower jump and others wanted to break the speed of sound. And their specific desires led to specific improvements in technology such as a better understanding of the Smeaton coefficient or a stable supercritical airfoil. Once they made these improvements, the next generation was able to use them to pursue more ambitious goals. But even as this cycle progressed, the more deeply-held desire to fly continued to inspire and unify their efforts.

<!-- The desire to fly is remarkable in that it is something that our biology alone cannot satisfy. In this way we are a bit like hermit crabs -- creatures who are born without the ability to grow a shell and yet need one to survive as adults. As they mature, they must cast about their tide pools for a suitable shell. And when they find one, they clean it, fit themselves to it, and their bodies grow or shrink to make the fit perfect. But whereas hermit crabs seek out shells because they want safety, humans seek out flight because they are after things like freedom, adventure, and beauty. We are not trying to achieve stasis; rather, we are aiming for a future that is different and better. That is what made us a flying species in the first place and that is what will propel us even higher tomorrow. -->
<div class="imgcap_noborder" style="text-align:center">
  <img src="/assets/optimizing-a-wing/hummingbird.png" style="width:15%;min-width:150px;">
</div>

<!-- So we beat on, wings angled into the wind, borne ceaselessly into the future. -->

## Thanks

Thanks to Maclaurin et al. (2018) for releasing Autograd[^fn18] to the world along with a number of thought-provoking demos.
Thanks to Stephan Hoyer, Shan Carter, and Matthew Johnson for conversations that shaped some of the early versions
of this work. And thanks to Andrew Sosanya, Jason Yosinski, and Tina White for feedback on early versions of this
essay. Special thanks to my family and friends for serving as guinea pigs for early iterations of this story.

## Footnotes

[^fn1]: Note: the code and overall approach to optimizing a wing in a fluid simulation is built on [this Autograd example](https://github.com/HIPS/autograd/blob/master/examples/fluidsim/wing.png).
[^fn2]: Our simulation is based on: Stam, Jos. [Real-Time Fluid Dynamics for Games](https://drive.google.com/file/d/1upKFdtnM0xcTVxNsPHI1KCvmcanAJheL/view). _Proceedings of the Game Developer Conference_, 2003.
[^fn3]: Jameson, Antony and Vassberg, John. [Computational fluid dynamics for aerodynamic design - Its current and future impact](https://doi.org/10.2514/6.2001-538), _American Institute of Aeronautics & Astronautics_, 2012.
[^fn4]: Lockwood, Rowan and Swaddle, John P. and Rayner, Jeremy M. V. [Avian Wingtip Shape Reconsidered: Wingtip Shape Indices and Morphological Adaptations to Migration](https://doi.org/10.2307/3677110), _Journal of Avian Biology_ Vol. 29, No. 3, pp. 273-292, 1998.
[^fn5]: Norberg, Ulla M. Lindhe. [Structure, Form, and Function of Flight in Engineering and the Living World](https://doi.org/10.1002/jmor.10013). _Journal of Morphology_, 2002.
[^fn6]: Mouret, Jean-Baptiste and Clune, Jeff. [Illuminating search spaces by mapping elites](https://arxiv.org/abs/1504.04909). _ArXiv preprint_, 2015.
[^fn7]: Cully, Antoine and Clune, Jeff and Taraporeand, Danesh and Mouret, Jean-Baptiste. [Robots that can adapt like animals](https://www.nature.com/articles/nature14422). _Nature_, 2015.
[^fn8]: Wang, Rui and Lehman, Joel and Rawal, Aditya and Zhi, Jiale and Li, Yulun and Clune, Jeff, Stanley, Kenneth O. [Enhanced POET: Open-ended Reinforcement Learning through Unbounded Invention of Learning Challenges and their Solutions](https://arxiv.org/abs/2003.08536). _International Conference on Machine Learning (ICML)_, 2020.
[^fn9]: Czarnecki, Wojciech Marian, et al. [Real World Games Look Like Spinning Tops](https://arxiv.org/abs/2004.09468). _arXiv preprint arXiv:2004.09468_, 2020.
[^fn10]: Vinyals, O., Babuschkin, I., Czarnecki, W.M. et al. [Grandmaster level in StarCraft II using multi-agent reinforcement learning](https://doi.org/10.1038/s41586-019-1724-z). Nature 575, 350–354 (2019).
[^fn11]: This is the intuition behind [emergence](https://en.wikipedia.org/wiki/Emergence) in complexity theory. Emergence makes the most sense in the context of physics because toy examples are easy to isolate. Phil Anderson does a good job explaining a few of these examples in his article "[More is Different](http://robotics.cs.tamu.edu/dshell/cs689/papers/anderson72more_is_different.pdf)."
[^fn13]: See also the myth of [Sisyphus](https://en.wikipedia.org/wiki/Sisyphus).
[^fn14]: See [this online textbook page](https://optimization.mccormick.northwestern.edu/index.php/Wing_Shape_Optimization) for an overview of full-scale wing optimization techniques.
[^fn15]: Balduzzi, David, et al. [Open-ended Learning in Symmetric Zero-sum Games](https://arxiv.org/abs/1901.08106). arXiv preprint arXiv:1901.08106 (2019).
[^fn16]: Lehman, Joel, and Kenneth O. Stanley. [Evolving a diversity of virtual creatures through novelty search and local competition.](https://doi.org/10.1145/2001576.2001606) _Proceedings of the 13th annual conference on Genetic and evolutionary computation._ 2011.
[^fn17]: Jameson, Antony. [Airplane Design with Aerodynamic Shape Optimization](http://aero-comlab.stanford.edu/Papers/AirplaneDesignShanghai.pdf), _Commercial Aircraft Company of China, Shanghai_, 2010.
[^fn18]: Specifically, we build on ideas laid out in [Maclaurin et al. (2018)](https://github.com/HIPS/autograd/blob/master/examples/fluidsim/wing.png).
[^fn19]: We'd call this an "Euler integration" of the dynamics. The problem with Euler integration is that when you run it on a grid, small numerical errors can accumulate into big ones. There's a related approach called the "Backward Euler" method which mitigates these errors. In Backward Euler, we use the final velocity rather than the initial velocity to perform advection: the update becomes \\(x_1 = v_1 \Delta t + x_0\\) instead. To gain deeper intuition for why this is a good idea, refer to page eight of [Stam (2003)](https://drive.google.com/file/d/1upKFdtnM0xcTVxNsPHI1KCvmcanAJheL/view).
[^fn20]: Following [Stam (2003)](https://drive.google.com/file/d/1upKFdtnM0xcTVxNsPHI1KCvmcanAJheL/view), we implement this step by using a few iterations of the <a href="https://en.wikipedia.org/wiki/Gauss%E2%80%93Seidel_method">Gauss-Seidel method</a> to solve <a href="https://en.wikipedia.org/wiki/Poisson%27s_equation">Poisson's equation</a>.

<script language="javascript">
	function toggleWingShape() {

		path = document.getElementById("wingShapeImage").src
	    if (path.split('/').pop() == "wing_shape.png") {
	        document.getElementById("wingShapeImage").src = "/assets/optimizing-a-wing/wing_shape.gif";
	    } else {
	        document.getElementById("wingShapeImage").src = "/assets/optimizing-a-wing/wing_shape.png";
	    }
	}
</script>

<script language="javascript">
	function toggleWingFlow() {

		path = document.getElementById("wingFlowImage").src
	    if (path.split('/').pop() == "wing_flow.png") {
	        document.getElementById("wingFlowImage").src = "/assets/optimizing-a-wing/wing_flow.gif";
	    } else {
	        document.getElementById("wingFlowImage").src = "/assets/optimizing-a-wing/wing_flow.png";
	    }
	}

function toggleBasicWing() {

    path = document.getElementById("basicWing").src
      if (path.split('/').pop() == "wing.png") {
          document.getElementById("basicWing").src = "/assets/optimizing-a-wing/wing_flow.gif";
      } else {
          document.getElementById("basicWing").src = "/assets/optimizing-a-wing/wing.png";
      }
  }

function hideShowAdvection() {
  var x = document.getElementById("advection_info");
  var y = document.getElementById("advection_info_toggle");
  if (x.style.display === "none") {
    x.style.display = "inline"; y.textContent = "(–)"
  } else {
    x.style.display = "none"; y.textContent = "(+)"
  }
}
function hideShowProjection() {
  var x = document.getElementById("projection_info");
  var y = document.getElementById("projection_info_toggle");
  if (x.style.display === "none") {
    x.style.display = "inline"; y.textContent = "(–)"
  } else {
    x.style.display = "none"; y.textContent = "(+)"
  }
}
function hideShowFilter() {
  var x = document.getElementById("filter_info");
  var y = document.getElementById("filter_info_toggle");
  if (x.style.display === "none") {
    x.style.display = "inline"; y.textContent = "(–)"
  } else {
    x.style.display = "none"; y.textContent = "(+)"
  }
}
function hideShowAutograd() {
  var x = document.getElementById("autograd_info");
  var y = document.getElementById("autograd_info_toggle");
  if (x.style.display === "none") {
    x.style.display = "inline"; y.textContent = "(–)"
  } else {
    x.style.display = "none"; y.textContent = "(+)"
  }
}
</script>


<script>
    function getBrowserSize(){
       var w, h;

         if(typeof window.innerWidth != 'undefined')
         {
          w = window.innerWidth; //other browsers
          h = window.innerHeight;
         } 
         else if(typeof document.documentElement != 'undefined' && typeof      document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) 
         {
          w =  document.documentElement.clientWidth; //IE
          h = document.documentElement.clientHeight;
         }
         else{
          w = document.body.clientWidth; //IE
          h = document.body.clientHeight;
         }
       return {'width':w, 'height': h};
}

if(parseInt(getBrowserSize().width) < 600){
 document.getElementById("longEqnWithLargeScript_A").style.display = "none";
}
if(parseInt(getBrowserSize().width) > 600){
 document.getElementById("longEqnWithSmallScript_A").style.display = "none";
}
</script>