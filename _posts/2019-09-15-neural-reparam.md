---
layout: post
comments: true
title:  "Neural Reparameterization Improves Structural Optimization"
excerpt: "We use neural networks to reparameterize structural optimization, building better bridges, skyscrapers, and cantilevers while enforcing hard physical constraints."
date:   2019-12-15 11:00:00
mathjax: true
meta: <a href="https://deep-inverse.org/">NeurIPS 2019 Deep Inverse Workshop</a>
thumbnail: /assets/neural-reparam/thumbnail.png
author: Sam Greydanus
---

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:90%" >
    <img alt="" src="/assets/neural-reparam/bridge-start.png" width="95%" id="bridgeImage" />
    <button id="bridgeButton" onclick="toggleBridge()" class="playbutton">Play</button>
	<div class="thecap" style="text-align:left; width:85%;padding-left:22px"><b>Figure 1:</b> Optimizing a bridge structure. In the top frame, optimization happens in the weight space of a CNN. In the next two frames it happens on a finite element grid.</div>
</div>

<script language="javascript">
	function toggleBridge() {

		path = document.getElementById("bridgeImage").src
	    if (path.split('/').pop() == "bridge-start.png") 
	    {
	        document.getElementById("bridgeImage").src = "/assets/neural-reparam/bridge.gif";
	        document.getElementById("bridgeButton").textContent = "Reset";
	    }
	    else 
	    {
	        document.getElementById("bridgeImage").src = "/assets/neural-reparam/bridge-start.png";
	        document.getElementById("bridgeButton").textContent = "Play";
	    }
	}
</script>

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
	<a href="https://arxiv.org/abs/1909.04240" id="linkbutton" target="_blank">Read the paper</a>
	<a href="https://colab.research.google.com/github/google-research/neural-structural-optimization/blob/master/notebooks/optimization-examples.ipynb" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
	<a href="https://github.com/google-research/neural-structural-optimization" id="linkbutton" target="_blank">Get the code</a>
</div>

## A Visual Introduction

In this post we propose using neural networks to reparameterize physics problems. This helps us design better bridges, skyscrapers, and cantilevers while enforcing hard physical constraints. In the figure above, you can see that our approach optimizes more quickly and has a smoother transition from large-scale to small-scale features. In the figure below, you can explore all 116 tasks that we studied.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<img src="/assets/neural-reparam/selected-tasks.png" style="width:55%">
	<div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:60%"><b>Figure 2:</b> Results from the 116 structural optimization tasks. The scores below each structure measure how much worse the design was than the best overall design.</div>

	<button id="tasksButton1" onclick="toggleTasks1()" class="playbutton" style="display: block; margin-left: auto; margin-right: auto;">Show more tasks</button>
	<div id="alltasks1" style="display:none">
		<img src="/assets/neural-reparam/tasks/tasks1.png">
		<img src="/assets/neural-reparam/tasks/tasks2.png">
		<img src="/assets/neural-reparam/tasks/tasks3.png">
		<button id="tasksButton2" onclick="toggleTasks2()" class="playbutton" style="display: block; margin-left: auto; margin-right: auto;">Show even more tasks</button>
		<div id="alltasks2" style="display:none">
			<img src="/assets/neural-reparam/tasks/tasks4.png">
			<img src="/assets/neural-reparam/tasks/tasks5.png">
			<img src="/assets/neural-reparam/tasks/tasks6.png">
			<img src="/assets/neural-reparam/tasks/tasks7.png">
			<img src="/assets/neural-reparam/tasks/tasks8.png">
			<button id="tasksButton3" onclick="toggleTasks3()" class="playbutton" style="display: block; margin-left: auto; margin-right: auto;">Show even more tasks</button>
			<div id="alltasks3" style="display:none">
				<img src="/assets/neural-reparam/tasks/tasks9.png">
				<img src="/assets/neural-reparam/tasks/tasks10.png">
				<img src="/assets/neural-reparam/tasks/tasks11.png">
				<img src="/assets/neural-reparam/tasks/tasks12.png">
				<img src="/assets/neural-reparam/tasks/tasks13.png">
				<img src="/assets/neural-reparam/tasks/tasks14.png">
				<img src="/assets/neural-reparam/tasks/tasks15.png">
				<img src="/assets/neural-reparam/tasks/tasks16.png">
			</div>
		</div>
	</div>
</div>

Now that I've sparked your curiosity, I'm going to use the rest of this post to put our results in the proper context. The proper context is _parameterization_ and my message is that it matters much more than you might expect.


## A Philosophical Take on Parameterization

The word “parameterization” means different things in different fields. Generally speaking, it's just a math term for the quirks and biases of a specific view of reality. Consider, for example, the parameterizations of a 3D surface. If the surface is rectilinear, then we'd probably want to use Cartesian coordinates. If it's cylindrical or spherical, we may be better off using polar or spherical coordinates. So we have three parameterizations but each one describes the same underlying reality. After all, a sphere will remain a sphere regardless of how its equation is written.

**Reparameterization.** And yet, some parameterizations are better than others _for solving particular types of problems_. This is why reparameterization -- the process of switching between parameterizations -- is so important. It lets us take advantage of the good properties of two different parameterizations at the same time. For example, when we are editing a photograph in Photoshop, we may edit specific objects while working in a pixel parameterization. Then we may switch to a Fourier basis in order to adjust lighting and saturation. Technically speaking, we’ve just taken advantage of reparameterization.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:60%">
	<img src="/assets/neural-reparam/photoshop.png">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 3:</b> A simple example of reparameterization. We might use the pixel image of Baby Yoda (on the left) to make spatially localized edits. Then we might use its spectral decomposition (on the right) to adjust lighting and saturation.</div>
</div>

**Physics examples.** Physicists use reparameterization or “change of basis” tricks all the time. Sometimes it's a matter of notation and other times it's a matter of what question they are asking. Here are a few examples:
<ul style="list-style-type:disc;">
<li><a href="https://en.wikipedia.org/wiki/Fourier_analysis">Spatial vs Fourier analysis</a> for studying light and sound</li>
<li><a href="https://en.wikipedia.org/wiki/List_of_map_projections">Angle vs area preserving projections</a> for studying different properties of Earth and space</li>
<li><a href="https://en.wikipedia.org/wiki/Spherical_harmonics">Spherical harmonics vs Cartesian coordinates</a> for describing the position and momentum of an electron</li>
<li><a href="https://en.wikipedia.org/wiki/Topology_optimization">Grids</a> vs <a href="https://arxiv.org/abs/1910.05585">adaptive meshes</a> for structural optimization problems</li>
<li><a href="https://en.wikipedia.org/wiki/Canonical_transformation">Canonical transformations</a> for transforming between arbitrary coordinate systems</li>
</ul>

These are some of the simplest examples, but there are countless others. In this post we’ll focus on an exciting new tool for doing this sort of thing: neural networks.



## Reparameterization and Neural Networks

Neural networks have all sorts of nice properties. They work well with high-dimensional data, they have great spatial priors, and they can change their representations during learning. But there is still a lot that we don't understand about them. In fact, two recent studies suggest that we've underestimated the importance of their architectural priors.

**[The Deep Image Prior](https://dmitryulyanov.github.io/deep_image_prior).[^fn1]** The first study tells us that even untrained networks have fantastic image priors. The authors hammer this point home by showing that it's possible to perform state-of-the-art denoising, super-resolution, and inpainting on a single image with an untrained network.

<div class="imgcap_noborder" style="display:block; margin-left: auto; margin-right: auto; width:70%">
	<img src="/assets/neural-reparam/deep-prior.png">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 4:</b> Visualization of the Deep Image Prior. Optimizing a single image using the weight space of an untrained CNN gives state of the art super-resolution results.</div>
</div>

**[Differentiable Image Parameterizations](https://distill.pub/2018/differentiable-parameterizations/)[^fn2].** The second study _highlights the relationship between image parameterizations and better optimization results_. The authors argue that well-chosen parameterizations can
<ul style="list-style-type:disc;">
<li>Precondition the optimization landscape</li>
<li>Enforce constraints (such as conservation of volume)</li>
<li>Bias optimization towards certain outcomes</li>
<li>Implicitly optimize other objects (eg a 3D surface projected to 2D)</li>
</ul>

<div class="imgcap_noborder" style="display:block; margin-left: auto; margin-right: auto; width:100%">
	<img src="/assets/neural-reparam/diff-params.png">
	<div class="thecap" style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:100%"><b>Figure 5:</b> Specific examples of differentiable image parameterizations applied to neural network visualizations and art.</div>
</div>

These two papers are interesting because they don’t focus on the process of training neural networks. Rather, they focus on how this process is shaped by good priors.


## Good Priors for Physics


With the rise of powerful neural network models, many scientists have grown interested in applying them to physics research. But there are some challenges. Data that is generated by physical processes is subject to exact physical constraints such as conservation of energy, mass, or charge and it can be challenging to enforce these constraints on neural network models. Another challenge is that neural networks require large datasets which are not always practical in physics. So the core challenge is to leverage deep learning...
<ul style="list-style-type:disc;">
<li>without sacrificing exact physics (many people train models to approximate physics, but often that isn’t enough)</li>
<li>without excessively large training datasets (often we only care about a few solutions)</li>
</ul>

Satisfying these requirements with supervised learning methods is hard. But what if we used neural networks for _reparameterization_ instead? When we looked into this idea, we found lots of evidence that the deep image prior extends beyond natural images. Some examples include style transfer in fonts[^fn3], uncertainty estimation in fluid dynamics[^fn4], and data upsampling in medical imaging[^fn5]. Indeed, whenever data contains translation invariance, spatial correlation, or multi-scale features, the deep image prior is a useful tool. So we decided to push the limits of this idea in the context of physics. We chose structural optimization as a case study because it's a domain where good spatial priors are essential.


## The Joys of Structural Optimization

Structural optimization is a computational tool which, in an ironic turn of events, often comes up with more organic-looking structures than human engineers do. These structures are beautiful, lightweight, and extremely strong.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<img src="/assets/neural-reparam/autodesk.png" style="width:50%">
	<div class="thecap" style="text-align:center; width:100%"><b>Figure 6:</b> Autodesk uses structural optimization to augment the design process.</div>
</div>

**How it works.** In structural optimization, you are given a fixed amount of material, a set of anchor points, and a set of force points. Your goal is to design load-bearing structures which balance out the force points as much as possible. You are also given a physics simulator which computes how much your structure is displaced by a given load. By differentiating through this physics simulator, you can take the gradient of the structure’s performance (called compliance) with respect to each of its components. Then you can follow this gradient to improve your design.


**Enforcing constraints.** The most common approach to topology optimization is the “modified SIMP” method[^fn6]. In this approach, we begin with a discretized domain of finite elements on a rectangular grid. We associate each grid element with an unconstrained logit and then map this logit to a mass density between 0 and 1. The mapping has two steps. The first step is to convolve the grid of logits with a cone filter in order to enforce local smoothness. The second step is to enforce volume constraints: 1) the volume of every grid cell must stay between 0 and 1 and 2) the total volume must not change.

We satisfied the first constraint by applying an element-wise sigmoid function to the logits. Then we satisfied the second by using a root finder to choose the sigmoid saturation constant \\(b\\). We can write these two steps as a single operation

$$
\begin{align}
    x_{ij} &= \frac{1}{1 + e^{- \hat x_{ij} - b}},\\
    &\quad\text{with $b$ such that} \quad
    V(x) = V_0.
\end{align}
$$

**Simulating the physics.** Letting  \\(K(\tilde x)\\) be the global stiffness matrix, \\(U(K, F)\\) be the displacement vector, \\(F\\) be the vector of applied forces, and \\(V (\tilde x)\\) be the total volume, we simulated the physics of displacement and wrote our objective as

$$
\begin{align}
    \min_x: c(x) &= U^T K U
    \quad\text{such that}\\
    &\quad
    K U = F, \quad
    V(x) = V_0, \\
    &\quad \text{and }
    0 \leq x_{ij} \leq 1
\end{align}
$$


<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:70%">
	<img src="/assets/neural-reparam/baseline-schema.png">
	<div class="thecap" style="text-align:left; display: block; margin-left: auto; margin-right: auto; width:90%"><b>Figure 7:</b>  Visualization of structural optimization. Here we are using it to design a bridge.</div>
</div>

**Automatic differentiation.** The coolest thing about our implementation is that it is fully differentiable. In fact, we implemented everything in Autograd and then used automatic differentiation to solve for updates to the parameters. This made our code much simpler than previous approaches (which had implemented reverse-mode differentiation by hand).

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:60%; min-width:250px">
	<img src="/assets/neural-reparam/implicit-diff.png">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 8:</b> Instead of differentiating directly through the root finder, we can use the <a href="https://en.wikipedia.org/wiki/Implicit_function_theorem">implicit function theorem</a> to <a href="https://link.springer.com/article/10.1023/A:1016051717120">differentiate through the optimal point</a>.</div>
</div>

The careful reader might be wondering how we differentiated through our root finder. At first we tried to naively backpropagate through the full search process. Bad idea. A better solution is to [differentiate straight through the optimal point](https://link.springer.com/article/10.1023/A:1016051717120) using implicit differentiation[^fn7] (Figure 7).


**Reparameterizing the problem.** Next, we built a CNN image generator in Keras and used it to reparameterize the grid of logits. The entire process, from the neural network forward pass to the constraint functions to the physics simulation, reduced to a single forward pass:

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%">
	<img src="/assets/neural-reparam/our-schema.png">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 9:</b> Reparameterizing structural optimization. We implement the forward pass as a TensorFlow graph and compute gradients via automatic differentiation.</div>
</div>

## Bridges, Towers, and Trees

In order to compare our method to baselines, we developed a suite of 116 structural optimization tasks. In designing these tasks, our goal was to create a distribution of diverse, well-studied problems with real-world significance. We started with a selection of problems from (Valdez et al. 2017)[^fn8] and (Sokol 2011).[^fn9] Most of these problems were simple beams with only a few forces, so we hand-designed additional tasks reflecting real-world designs such as bridges, towers, and trees.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:70%; min-width:280px">
	<img src="/assets/neural-reparam/quant-results.png">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 10:</b> Neural reparameterization improves structural optimization, especially for large problems.</div>
</div>

**Why do large problems benefit more?** One of the first things we noticed was that large problems benefit more from our approach. Why is this? It turns out that finite grids suffer from a “mesh-dependency problem," with solutions varying as grid resolution changes.[^fn10] When grid resolution is high, small-scale “spiderweb" patterns interfere with large-scale structures. We suspect that working in the weight space of a CNN allows us to optimize structures on several spatial scales at once, effectively solving the mesh-dependency problem. To investigate this idea, we plotted structures from all 116 design tasks and then chose five examples to highlight important qualitative trends (Figure 2).

One specific example is that the cantilever beam in Figure 2 had a total of eight supports under our method, whereas the next-best method (MMA[^fn11]) used eighteen. Most of the qualitative results are at the beginning of this post, so refer to that section for more details.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:90%" >
    <button id="buildingButton" onclick="toggleBuilding()" class="playbutton">Play</button>
    <img alt="" src="/assets/neural-reparam/building.png" width="95%" id="buildingImage" />
	<div class="thecap" style="text-align:left; width:90%;padding-left:22px"><b>Figure 11:</b> Optimizing a multistory building. In the first frame, optimization happens in the weight space of a CNN. In the next two frames it happens on a finite element grid. Structures 2 and 3 are 7% and 54% worse.</div>
</div>

<script language="javascript">
	function toggleBuilding() {

		path = document.getElementById("buildingImage").src
	    if (path.split('/').pop() == "building.png") 
	    {
	        document.getElementById("buildingImage").src = "/assets/neural-reparam/building.gif";
	        document.getElementById("buildingButton").textContent = "Reset";
	    }
	    else 
	    {
	        document.getElementById("buildingImage").src = "/assets/neural-reparam/building.png";
	        document.getElementById("buildingButton").textContent = "Play";
	    }
	}
</script>




## Closing thoughts

**Structural optimization.** This was a fun project because many of the results were beautiful and surprising. In fact, it convinced me that structural optimization is an undervalued tool for augmenting human creativity. With advances in 3D printing and fabrication, I hope it becomes more common in fields such as engineering and architecture.

**Parameterization.** A more general theme of this project is that _parameterization matters much more than you might expect._ We see this again and again. The most fundamental advances in deep learning -- convolutional filters, forget gates, residual connections, and self-attention -- should be thought of as advances in parameterization.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:70%">
	<img src="/assets/neural-reparam/elegans-connectome.png">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 12:</b> Parameterization is important in biological systems as well. What sorts of priors might the <a href="https://wormwiring.org/">C. elegans connectome</a> encode?</div>
</div>

This leads me to ask what other sorts of priors one could encode via parameterization. I’m particularly excited about a series of recent works that show how to encode complex, dataset-specific priors via network connectivity: "[Weight Agnostic Neural Networks](https://weightagnostic.github.io/)[^fn12]", "[Lottery Tickets](https://arxiv.org/abs/1803.03635)[^fn13]," and "[Interaction Networks](http://papers.nips.cc/paper/6417-interaction-networks-for-learning-about-objects-relations-and-physics)[^fn14]". There's evidence that nature hard codes priors in a similar way. For example, a baby antelope can walk just a few minutes after birth, suggesting that this skill is hard-wired into the connectivity structure of its brain.

**Takeaway.** Regardless of whether you care about physics, deep learning, or biological analogies, I hope this post helped you appreciate the pivotal role of parameterization.


## Related Work

[^fn1]: Ulyanov, Dmitry, Andrea Vedaldi, and Victor Lempitsky. [Deep Image Prior](https://dmitryulyanov.github.io/deep_image_prior). Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2018.
[^fn2]: Mordvintsev, Alexander, et al. [Differentiable Image Parameterizations](https://distill.pub/2018/differentiable-parameterizations/). Distill 3.7 (2018): e12.
[^fn3]: Azadi, S., Fisher, M., Kim, V. G., Wang, Z., Shechtman, E., and Darrell, T. [Multi-content GAN for few-shot font style transfer](https://arxiv.org/abs/1712.00516). In The IEEE Conference on Computer Vision and Pattern Recognition (CVPR), June 2018.
[^fn4]: Zhu, Y., Zabaras, N., Koutsourelakis, P.-S., and Perdikaris, P. [Physics-constrained deep learning for high-dimensional surrogate modeling and uncertainty quantification without labeled data](https://arxiv.org/abs/1901.06314). Journal of Computational Physics, 394:56–81, 2019.
[^fn5]: Dittmer, S., Kluth, T., Maass, P., and Baguer, D. O. [Regularization by architecture: A deep prior approach for inverse problems](https://arxiv.org/abs/1812.03889). Preprint, 2018.
[^fn6]: Andreassen, E., Clausen, A., Schevenels, M., Lazarov, B. S., and Sigmund, O. [Efficient topology optimization in MATLAB using 88 lines of code](https://link.springer.com/article/10.1007/s00158-010-0594-7). Structural and Multidisciplinary Optimization, 43(1):1–16, 2011.
[^fn7]: Griewank, A. and Faure, C. [Reduced functions, gradients and hessians from fixed-point iterations for state equations](https://link.springer.com/article/10.1023/A:1016051717120). Numerical Algorithms, 30(2):113–139, 2002.
[^fn8]: Valdez, S. I., Botello, S., Ochoa, M. A., Marroquín, J. L., and Cardoso, V. [Topology optimization benchmarks in 2D: Results for minimum compliance and minimum volume in planar stress problems](https://link.springer.com/article/10.1007/s11831-016-9190-3). Arch. Comput. Methods Eng., 24(4):803–839, November 2017.
[^fn9]: Sokol, T. [A 99 line code for discretized Michell truss optimization written in Mathematica](https://link.springer.com/article/10.1007/s00158-010-0557-z). Structural and Multidisciplinary Optimization, 43(2):181–190, 2011.
[^fn10]: Sigmund, O. and Petersson, J. [Numerical instabilities in topology optimization: A survey on procedures dealing with checkerboards, mesh-dependencies and local minima](https://link.springer.com/article/10.1007/BF01214002). Structural optimization, 16:68–75, 1998.
[^fn11]: Svanberg, K. [The method of moving asymptotes-a new method for structural optimization](https://onlinelibrary.wiley.com/doi/abs/10.1002/nme.1620240207). International Journal for Numerical Methods in Engineering, 24(2):359–373, 1987.
[^fn12]: Gaier, Adam, and David Ha. [Weight Agnostic Neural Networks](https://weightagnostic.github.io/). Neural Information Processing Systems (2019).
[^fn13]: Frankle, Jonathan, and Michael Carbin. "[The lottery ticket hypothesis: Finding sparse, trainable neural networks](https://arxiv.org/abs/1803.03635)." ICLR 2019.
[^fn14]: Battaglia, Peter, et al. "[Interaction networks for learning about objects, relations and physics](http://papers.nips.cc/paper/6417-interaction-networks-for-learning-about-objects-relations-and-physics)." Advances in neural information processing systems. 2016.


<script language="javascript">
	function toggleTasks1() {

		var x = document.getElementById("alltasks1");
		if (x.style.display === "none") {
			x.style.display = "block";
			document.getElementById("tasksButton1").textContent = "Hide tasks";
		} else {
			x.style.display = "none";
			document.getElementById("tasksButton1").textContent = "Show more tasks";
		}
	}
</script>

<script language="javascript">
	function toggleTasks2() {

		var x = document.getElementById("alltasks2");
		if (x.style.display === "none") {
			x.style.display = "block";
			document.getElementById("tasksButton2").textContent = "Hide tasks";
			document.getElementById("tasksButton1").textContent = "Hide all tasks";
		} else {
			x.style.display = "none";
			document.getElementById("tasksButton2").textContent = "Show even more tasks";
			document.getElementById("tasksButton1").textContent = "Hide tasks";
		}
	}
</script>

<script language="javascript">
	function toggleTasks3() {

		var x = document.getElementById("alltasks3");
		if (x.style.display === "none") {
			x.style.display = "block";
			document.getElementById("tasksButton3").textContent = "Hide tasks";
		} else {
			x.style.display = "none";
			document.getElementById("tasksButton3").textContent = "Show even more tasks";
		}
	}
</script>