---
layout: post
comments: true
title:  "How Simulating the Universe Could Yield Quantum Mechanics"
excerpt: "We look at the logistics of simulating the universe and conclude that quantum mechanics may be a consequence of simulation code."
date:   2022-03-26 11:00:00
mathjax: true
thumbnail: /assets/how-simulating/thumbnail.png
---

## The universe as a simulation

Let's imagine the universe is being simulated. Based on what we know about physics, what can we say about how the simulation would be implemented? Well, it would probably have:

1. **Massive parallelism.** Taking advantage of the fact that, in physics, all interactions are local and limited by the speed of light, one could parallelize the simulation dramatically. Spatially adjacent regions could be run on the same cores and spatially distant regions could be run on separate cores. This is connected to the notion of [cellular automata as models of reality](https://plato.stanford.edu/entries/cellular-automata/#CAModeReal).
2. **Conservation laws enforced.** Physics is built on the idea that certain quantities are strictly conserved. Scalar quantities like [mass-energy](https://en.wikipedia.org/wiki/Conservation_law#Exact_laws) are conserved. So are vector quantities like [angular momentum](https://en.wikipedia.org/wiki/Conservation_law#Exact_laws) and, by extension, [polarization](https://www.nature.com/articles/s41467-019-10939-x).
3. **Binary logic.** Our computers use discrete, binary logic to represent and manipulate information. Non-discrete numbers are represented with sequences of discrete symbols (see [float32](https://en.wikipedia.org/wiki/Single-precision_floating-point_format)). Let's assume our simulation does the same thing.
4. **Adaptive computation.** To simulate the universe efficiently, we would want to spend most of our compute time on regions where a lot of matter and energy are concentrated: that's where the dynamics would be most complex. So we'd probably want to use a [particle-based (Lagrangian) simulation](https://en.wikipedia.org/wiki/Lagrangian_particle_tracking) of some sort.
5. **Isotropy.** Space would be [uniform in all directions](https://en.wikipedia.org/wiki/Isotropy); physics would be invariant under rotation.

We can check to see whether these are good assumptions by looking at whether they hold true for existing state-of-the-art physics simulations. It turns our that they hold true for the best [oceanography](https://www.myroms.org/), [meteorology](https://confluence.ecmwf.int/display/S2S/ECMWF+model+description), [plasma](https://arxiv.org/abs/0810.5757), [cosmology](https://en.wikipedia.org/wiki/NEMO_(Stellar_Dynamics_Toolbox)), and [computational fluid dynamics](https://en.wikipedia.org/wiki/Computational_fluid_dynamics) models. So, having laid out some basic assumptions about how our simulation would be implemented, let's look at their implications.

## Enforcing conservation laws in parallel

The first thing to see is that assumptions 1 and 2 are in tension with one another. In order to ensure that a quantity (eg mass-energy) is conserved, you need to sum that quantity across the entire simulation, determine whether a correction is needed, and then apply that correction to the system as a whole. Computationally, this requires a synchronous [reduction operation](https://en.wikipedia.org/wiki/Reduction_operator) and an element-wise divide at virtually every timestep. When you write a single-threaded physics simulation, this can account for about half of the computational cost (these [fluid](https://github.com/greydanus/optimize_wing/blob/3d661cae6ca6a320981fd5fc29848e1233d891cd/simulate.py#L57) and [topology](https://github.com/google-research/neural-structural-optimization/blob/1c11b8c6ef50274802a84cf1a244735c3ed9394d/neural_structural_optimization/topo_physics.py#L236) simulations are good examples).

As you parallelize your simulation more and more, you can expect the cost of enforcing conservation laws to grow higher in proportion. This is because simulating dynamics is pretty easy to do in parallel / asynchronously. But enforcing system-wide conservation laws requires transferring data between distant CPU cores and keeping them more or less in sync. As a result, enforcing conservation laws in this manner quickly grows to be a limiting factor on runtime. And so we find ourselves asking:

> Is there a more parallelizable approach to enforcing global conservation laws?

One option is to quantize the conserved quantity. For example, we could quantize energy and then only transfer it in the form of discrete packets.

To see why this would be a good idea, let's use financial markets as an analogy. Financial markets are massively parallel and keeping a proper accounting of the total amount of currency in circulation is very important. So they allow currency to function as a continuous quantity on a practical level, but they quantize it at a certain scale by making small measures of value (pennies) indivisible. We could enforce conservation of energy in the same way, for the same reasons.

## Conserving vector quantities

Quantization may work well for conserving scalar values like energy. But what about conserving vector quantities like angular momentum? In these cases, isotropy/rotational symmetry (assumption 5) makes things difficult. Isotropy says that our simulation will be invariant under rotation, but if we quantize our angular momentum vectors, we will be unable to represent all spatial directions equally. We'd get [rounding errors](https://en.wikipedia.org/wiki/Round-off_error) which would compound over time.

So how are we to implement exact conservation of vector quantities? One option is to require that one particle's vector quantities always be defined in reference to some other particle's vector quantities. This could be implemented by creating multiple [pointer references](https://en.wikipedia.org/wiki/Pointer_(computer_programming)) to a single variable and then giving each of those pointers to a different particle. As a concrete example, we might imagine an atom releasing energy in the form of two photons. The polarization angle of the first photon could be expressed as a pointer to variable ```x``` and the polarization of the second photon could be expressed as a 90\\(^\circ\\) rotation of a second pointer to variable ```x```. As we move our simulation forward, the polarization angles of the two photons would change over time and perhaps some small integration and rounding errors would accumulate. But even when that happens, we could still say with confidence that the net polarization of the two photons would be zero because they are written in terms of the same underlying variable ```x```.

We should recognize that this approach comes at a price. It demands that we sacrifice _locality_, the principle that an object is influenced directly only by its immediate surroundings. It's one of the most sacred principles in physics. This gets violated in the example of the two photons because a change in the polarization of the first photon will update the value of ``x``, implicitly changing the polarization of the second photon.

Interestingly, the mechanics of this nonlocal relationship would predict the violation of [Bell's inequality](https://www.youtube.com/watch?v=zcqZHYo7ONs&vl=en). Physicists agree that the violation of Bell's inequality implies that nature violates either _realism_, the principle that reality exists with definite properties even when not being observed, or locality. Since locality is seen as a more fundamental principle than realism, the modern consensus is that quantum mechanics violates realism: in other words, that entangled particles cannot be said to have deterministic states and instead exist in a state of superposition until they are measured. In our simulated universe, realism would be preserved whereas locality would be sacrificed. Entangled particles would have definite states but sometimes those states would change due to shared references to spatially distant "twins."

Physicists have certainly entertained the idea of using non-local theories to explain Bell's inequality. One of the reasons these theories are not more popular is that [Groblacher et al, 2007](https://drive.google.com/file/d/1RTlV08KhQ7lNwOukbNcMok0f6E42uMyI/view?usp=sharing) and others have reported experimental results that rule out most reasonable options. More specifically, they have ruled out all theories that say ____. However,...

## Explaining the double slit experiment

Our findings thusfar may lead us to ask if other quantum mechanical phenomena can be explained with the simulation _ansatz_. The double slit experiment is an interesting example. It cannot be explained using the arguments about conservation laws that we made above. And yet, there are is a good argument to be made that simulating the universe could lead to wave-particle duality.

The important idea here is filtering. [Filtering](https://en.wikipedia.org/wiki/Filter_(large_eddy_simulation)) is a common technique where a Gaussian or cone filter is convolved with a grid in order to smooth out the physics and eliminate grid-level pathologies. This step is essential in most simulations. For example, these [fluid](https://github.com/greydanus/optimize_wing/blob/3d661cae6ca6a320981fd5fc29848e1233d891cd/simulate.py#L83) and [topology](https://github.com/google-research/neural-structural-optimization/blob/1c11b8c6ef50274802a84cf1a244735c3ed9394d/neural_structural_optimization/topo_physics.py#L84) simulations do not work without filtering.

How would one implement filtering in a large-scale, particle-based simulation of the universe? Well, if the simulation were a particle-based instead of grid-based, we couldn't apply a Gaussian or cone filter. An alternative would be to simulate the dynamics of each particle using ensembles of virtual particles. One could initialize a group of these virtual particles with slightly different initial conditions and then simulate all of them through time. If you allowed these virtual particles to interact with other virtual particles in the ensemble, then the entire ensemble would collectively behave as though it were a wave.

You might notice that there is a tension between this spatially delocalized, wave-like behavior (a consequence of filtering, which is related to assumption 3) and the exact conservation -- and thus quantization -- of quantities like energy (assumption 2). The tension is this: when a wave interacts with an object, it transfers energy in a manner that is delocalized and in proportion to its amplitude at a given location. But we have decided to quantize energy in order to keep an exact accounting of it across our simulation. So when our ensemble of particles interacts with some matter, it must transfer exactly one quanta of energy and it must do so at one particular location.

The simplest way to implement this would be to choose one particle out of the ensemble and allow it to interact with other matter and transfer energy. The rest of the particles in the ensemble would be removed from the simulation upon coming into contact with other matter. The interesting thing about this approach is that it could help explain the wave-particle duality of subatomic particles such as photons. For example, it could be used to reproduce the empirical results of the double slit experiment in a fully deterministic manner.

## Testing this hypothesis

Suppose all of the ideas we have discussed are true. How would we be able to test them? One place to start would be to show that in quantum mechanics, realism is actually preserved whereas locality is not. To that end, here's a possible experiment:

_Set up the apparatus used to test Bell’s theorem. Entangled photons emerge from a source and head in opposite directions. Eventually they get their polarizations measured. On one side, you set up the double slit experiment. As photons pass through it, you will observe wavelike diffraction patterns, provided the photons are in non-homogeneous quantum states. BUT, if you measure the photons which are heading in the opposite direction of the double slit experiment first, then you would expect the photons entering the double slit experiment to have already collapsed into hetereogenous states. And so you might expect those photons to act like particles rather than waves when they pass through the double slit experiment. That would be a surprising result because such a setup would violate the locality assumption and could be used to transmit information faster than light!_

## Closing thoughts

To the followers of Plato, the world of the senses was akin to shadows dancing on the wall of a cave. The essential truths and realities of life were not to be found on the wall at all, but rather somewhere behind you in the form of real dancers and real flames. A meaningful life was to be spent seeking to understand those forms, elusive as they might seem.

This post, though it covers esoteric ideas like quantum mechanics and simulation theory, is aimed at exploring the unseen aspects of reality in the same way that Plato's followers did. At this point, we cannot say for sure whether we live in a simulation. We may never know. But in looking at the logistics of such a simulation, we have come across an interesting interpretation of quantum mechanics which may bear additional investigation. Perhaps there is experimental evidence that we are unaware of which invalidates this theory. But at the very least, it makes for a provocative and entertaining thought experiment.

