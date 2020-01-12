---
layout: post
comments: true
title:  "Neural Reparameterization Improves Structural Optimization"
excerpt: "We propose using neural networks to reparameterize physics problems. This helps us design better bridges, skyscrapers, and cantilevers while enforcing hard physical constraints."
date:   2020-09-15 11:00:00
mathjax: true
thumbnail: /assets/neural-reparam/thumbnail.png
author: Sam Greydanus
---

<div>
	<style>
		#linkbutton:link, #linkbutton:visited {
		  background-color: rgba(180, 180, 180);
		  border-radius: 4px;
		  color: white;
		  padding: 6px 0px;
		  width: 200px;
		  text-align: center;
		  text-decoration: none;
		  display: inline-block;
		  text-transform: uppercase;
		  font-size: 13px;
		}

		#linkbutton:hover, #linkbutton:active {
		  background-color: rgba(160, 160, 160);
		}

		.playbutton {
		  background-color: rgba(0, 153, 51);
		  /*background-color: rgba(255, 130, 0);*/
		  border-radius: 4px;
		  color: white;
		  padding: 3px 8px;
		  margin-bottom: 10px;
		  /*width: 60px;*/
		  text-align: center;
		  text-decoration: none;
		  text-transform: uppercase;
		  font-size: 12px;
		  display: block;
		  /*margin-left: auto;*/
		  margin-right: auto;
		}
	</style>
</div>

We propose using neural networks to reparameterize physics problems. This helps us design better bridges, skyscrapers, and cantilevers while enforcing hard physical constraints.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:90%" >
    <button id="optimButton" onclick="toggleOptim()" class="playbutton">Play</button>
    <img alt="" src="/assets/neural-reparam/optimize.png" width="95%" id="optimImage" />
	<div class="thecap" style="text-align:left; width:75%;padding-left:22px"><b>Figure 1:</b> Optimizing a multistory building. In the first frame, optimization happens in the weight space of a ConvNet. In frames two and three, optimization happens on a finite element grid (aka pixel space). Structures 2 and 3 are 7% and 54% worse respectively.</div>
</div>

<script language="javascript">
	function toggleOptim() {

		path = document.getElementById("optimImage").src
	    if (path.split('/').pop() == "optimize.png") 
	    {
	        document.getElementById("optimImage").src = "/assets/neural-reparam/optimize.gif";
	        document.getElementById("optimButton").textContent = "Reset";
	    }
	    else 
	    {
	        document.getElementById("optimImage").src = "/assets/neural-reparam/optimize.png";
	        document.getElementById("optimButton").textContent = "Play";
	    }
	}
</script>

<div style="display: block; margin-left: auto; margin-right: auto; width:450px">
	<a href="https://arxiv.org/abs/1909.04240" id="linkbutton" target="_blank" style="margin-right: 10px;">Read the paper</a>
	<a href="https://github.com/google-research/neural-structural-optimization" id="linkbutton" target="_blank"  style="margin-left: 10px;">Get the code</a>
</div>

## A Philosophical Take on Parameterization

The word “parameterization” means different things in different fields of study. Taken independently, though, the word is simply a mathematical term for the quirks and biases of a specific view of reality. Consider the parameterization of some 3D surface:

First, we could use Cartesian coordinates which are well-suited for describing rectilinear surfaces. If our surface is cylindrical or spherical, we may be better off using polar or spherical coordinates. So we have three parameterizations, but each is capable of describing the same underlying reality. After all, a sphere will remain a sphere regardless of whether we write its equation in Cartesian or spherical coordinates.

**Reparameterization.** And yet, some parameterizations are better than others for solving particular types of problems. This is why reparameterization -- the process of switching between parameterizations -- is so fundamental to optimization. It lets us take advantage of the good properties of two different parameterizations at the same time. For example, when we are editing a photograph in Photoshop, we may edit specific objects while working in a pixel parameterization. Then we may switch to a Fourier parameterization in order to adjust lighting and saturation. Technically speaking, we’ve just taken advantage of reparameterization.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:50%">
	<img src="/assets/neural-reparam/photoshop.png">
</div>

**Physics examples.** Physicists use reparameterization or “change of basis” tricks all the time. Sometimes it is a matter of notation and others it is a matter of what question they are asking (eg position vs energy). Here are a few examples:
1. Spatial vs Fourier analysis of light and sound
2. [Angle vs area preserving projections](https://en.wikipedia.org/wiki/List_of_map_projections) for studying different properties of the Earth and space
3. [Spherical harmonics](https://en.wikipedia.org/wiki/Spherical_harmonics) vs Cartesian coordinates for describing the position and momentum of an electron
4. [Grids](https://en.wikipedia.org/wiki/Topology_optimization) vs [adaptive meshes](https://arxiv.org/abs/1910.05585) for structural optimization problems
5. [Canonical transformations](https://en.wikipedia.org/wiki/Canonical_transformation) for transforming between arbitrary coordinate systems

These are some of the simplest examples of reparameterization in physics, yet there are countless others. Many are specific to certain subfields of physics (eg. particle physics or cosmology). In this blog post, I’ll touch on an exciting new tool for reparameterizing physics: neural networks.



## Reparameterization and Neural Networks

Neural networks have all sorts of nice properties. They work well with high-dimensional data, they have great spatial and temporal priors, and they actually change their prior over functions as they learn from data. And yet, we are only just beginning to explore the implications of these properties. In this section, I’ll touch on two exciting ideas from the computer vision literature.

**The deep image prior.** The first insight is that _even untrained neural networks have fantastic image priors_. A 2017 paper about the [Deep Image Prior](https://dmitryulyanov.github.io/deep_image_prior) really hammers this point home by showing how to perform state-of-the-art denoising, super-resolution, inpainting, and image restoration on a _single_ image with an _untrained_ neural network. The authors hypothesize that the deep image prior of standard generator architectures comes from the inductive biases of weight sharing, spatially localized filters, and upsampling between layers.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:60%">
	<img src="/assets/neural-reparam/deep-prior.png">
</div>

**Differentiable image parameterizations.** The second paper, [Differentiable Image Parameterizations](https://distill.pub/2018/differentiable-parameterizations/), _highlights the relationship between image parameterizations and better optimization results_. In this work, the authors argue that parameterization matters for the following reasons:
1. Basins of Attraction: different parameterizations bias optimization towards different basins of attraction and thus influence the likely result.
2. Improved Optimization: parameterization is key to preconditioning an optimization problem well.
3. Additional Constraints: some parameterizations cover only a subset of possible inputs, providing a convenient way to enforce constraints.
4. Implicit Optimizing other Objects: a parameterization may internally use a different kind of object than the one it outputs and we optimize for (eg 2D vs 3D objects).

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:90%">
	<img src="/assets/neural-reparam/diff-params.png">
</div>


## Neural Reparameterization for Physics


**ML for Physics.** The traditional approach to ML for physics involves supervised learning of physics data via an unconstrained neural network. While this approach has shown some promising results, it is often criticized for being uninterpretable and providing no guarantees that the outputs of the neural network obey the laws of physics.

**Neural reparameterization for physics.** One field where these characteristics are important -- and where the deep image prior is under-explored -- is computational science and engineering. Here, neural-reparam is extremely important -- substituting one neural-reparam for another has a dramatic effect. Consider, for example, the task of designing a multi-story building via structural optimization. The goal is to distribute a certain quantity of building material over a two-dimensional grid in order to maximize the resilience of the structure. As Figure 1 shows, different optimization methods (LBFGS vs. MMA) and neural-reparams (pixels vs. neural net) have big consequences for the final design.

## Case Study: Structural Optimization

**What is structural optimization.**

**Our approach.**

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:70%">
	<img src="/assets/neural-reparam/our-approach.png">
</div>

**Technical challenges.**

## Bridges, Towers, and Trees

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:50%">
	<img src="/assets/neural-reparam/selected-designs.png">
	<div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:80%">Selected results.</div>
</div>

## Discussion

Choice of neural-reparam has a powerful effect on solution quality for tasks such as structural optimization, where solutions must be computed by numerical optimization. Motivated by the observation that untrained deep image models have good inductive biases for many tasks, we reparameterized structural optimization tasks in terms of the output of a convolutional neural network (CNN). Optimization then involved training the parameters of this CNN for each task. The resulting framework produced qualitatively and quantitatively better designs on a set of 116 tasks.

## Footnotes

[^fn1]: Any neuroscientist will tell you that this is an oversimplification. The brain has a myriad of mechanisms - synaptic, genetic, chemical, and so forth - that work together to promote learning. That being said, the vast majority of information that the brain learns gets stored in the relative strengths of synaptic connections, so one can say that they are it's _principal_ form of neural-reparam.