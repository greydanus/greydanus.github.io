---
layout: post
comments: true
title:  "Taming Wave Functions with Neural Networks"
excerpt: "The wave function psi is essential to most calculations in quantum mechanics, and yet it's a difficult beast to tame. Can neural networks help?"
date:   2017-08-28 11:00:00
mathjax: true
---


<div class="imgcap">
    <img src="/assets/quantum-nn/he-protec-psi.png" width="40%">
</div>

## The wave function in the wild

> "\\(\psi\\) is a monolithic mathematical quantity that contains all the information on a quantum state, be it a single particle or a complex molecule." -- Carleo and Troyer, [Science](http://science.sciencemag.org/content/355/6325/602.full)

**A mixed blessing.** Carleo and Troyer were correct, but the wave function, $$\psi$$, is a mixed blessing. Most newcomers to quantum mechanics encounter it as the Schrodinger's cat paradox -- a devious violation of classical intuitions. It also has a mind-bending property called _nonlocality_, which says that entangled states can "collapse" into pure states instantaneously over large distances. This "spooky action at a distance" frustrated Einstein and eventually led to Bell's theorem, which was difficult to [verify without loopholes](https://phys.org/news/2017-02-physicists-loophole-bell-inequality-year-old.html).

Worst of all, \\(\psi\\) grows exponentially with the number of particles in a system. For a system of four particles, \\(\psi\\) is a vector of length 16. For a system of 100 particles, it has length 10\\(^{30}\\). This is a huge problem: we couldn't even _write_ this wave function to a computer's memory, much less perform operations on it. And yet, if we want to get quantum computers to work, we need to be comfortable with wave functions for well over 100 particles.

**Redeeming qualities.** Despite its flaws, we (a couple of luckless physicists) love \\(\psi\\)! Manipulating wave functions can give us [ultra-precise timekeeping](https://www.nature.com/news/2010/100331/full/news.2010.163.html), [secure encryption](http://physicsworld.com/cws/article/news/2017/jul/11/quantum-satellites-demonstrate-teleportation-and-encryption), and [polynomial-time factoring of integers](https://quantumfrontiers.com/2013/03/17/post-quantum-cryptography/) (read: break RSA). Harnessing quantum effects can also produce [better machine learning](https://www.technologyreview.com/s/544421/googles-quantum-dream-machine/), [better physics simulations](https://phys.org/news/2013-10-feynman-wasnt-quantum-dynamics-ground.html), and even [quantum teleportation](https://quantumfrontiers.com/2012/09/17/how-to-build-a-teleportation-machine-teleportation-protocol/).

## Taming the beast

**The general idea.** Though \\(\psi\\) grows exponentially with the number of particles in a system, most _physical_ wave functions can be described with a lot less information. In other words, we can write down compressed versions of most wave functions. Obtaining these compressed versions in practice, though, is something of a challenge. Two main approaches are the Density Matrix Renormalization Group (DMRG) and Quantum Monte Carlo (QMC). I'll give a brief intuition of both.

<div class="imgcap">
    <img src="/assets/quantum-nn/bonsai.png" width="40%">
</div>

**DMRG: it's like a Bonsai tree.** Imagine we want to learn about trees, but studying a full-grown, 50-foot tall tree is too unwieldy. Any good physicist would tell you to solve a simpler problem: start with a seedling and prune its branches and roots so that it matures, but never grows more than a few feet high. Now it has all the important attributes of a regular tree: branches, leaves, and even a bunch of miniature rings in its trunk (one for each year) -- and it's very easy to study inside a laboratory. In this metaphor, the regular tree is the wave function, the Bonsai process is DMRG, and the Bonsai tree itself is a Matrix Product State (MPS).

This approach is great because it makes the wave function much more manageable while retaining its most important characteristics. The weakness of MPS is that it doesn't work for _all_ wave functions. For example, systems that interact in 2D and 3D require different techniques such as [Projected Entangled Pairs (PEPS)](https://arxiv.org/abs/0907.2796).

<div class="imgcap">
    <img src="/assets/quantum-nn/leaf.jpg" width="15%">
    <img src="/assets/quantum-nn/acorn.jpg" width="15%">
    <img src="/assets/quantum-nn/bark.jpg" width="15%">
</div>

**QMC: collect some specimens.** Another way to study the concept of a "tree" in a lab (bear with me on this improbable metaphor) would be to study a bunch of leaves, seeds, and bark samples from the tree. Obtaining these samples is much easier than obtaining the tree itself and it still gives us a pretty good idea of the tree's appearance, age, climate, and so forth. Most QMC algorithms do this. They take "specimens" of a wave function by using it to sample a distribution of pure states. Then, from the properties of these states (e.g. energy expectation values), they piece togethe a picture of the wave function as a whole.

This approach is effective because, unlike DMRG, it works for pretty much any quantum system. Its weakness (or perhaps strength?) is that it treats the wave function as a black box. This makes interpreting QMC results is difficult. We might ask, "how does flipping the spin of the third electron affect the total energy?" and QMC wouldn't have a great answer.

## Brains $$\gg$$ Brawn

<div class="imgcap_noborder">
    <img src="/assets/quantum-nn/nqs.jpg" width="40%">
    <div class="thecap" style="text-align:center">Figure 1. A schema of the Neural Quantum State (NQS) model introduced By Carleo and Troyer. The model has a Restricted Boltzman Machine (RBM) architecture -- increasing the number of units in the hidden layer increases accuracy.</div>
</div>

**NQS: smart Monte Carlo.** Some state spaces are far too large for even Monte Carlo to sample adequately. Extending our tree analogy, suppose we're studying a forest full of different species of trees. We want to study all the species, but one or two types of tree vastly outnumber the others. Randomly sampling branches, bark, etc. from the entire forest just isn't efficient. Somehow, we need to make our sampling process "smarter". Last year, Google DeepMind used a technique called deep reinforcement learning to do just that - and achieved great fame for defeating the world champion human player in Go.

In a recent [Science paper](http://science.sciencemag.org/content/355/6325/602.full), Carleo and Troyer used the same technique to approximate many-body wave functions with neural networks. Their called their approach "Neural Quantum States (NQS)". It worked really well, producing several state-of-the art results.

<div class="imgcap_noborder">
    <img src="/assets/quantum-nn/mps-learn-schema.png" width="100%">
    <div class="thecap" style="text-align:center">Figure 2: A schema of the neural network model I used to obtain MPS coefficients. The Hamiltonian I'm using is a Heisenberg Hamiltonain plus extra coupling terms (see <a href="https://github.com/greydanus/psi0nn/blob/master/static/greydanus-dartmouth-thesis.pdf">my thesis</a> for details.).</div>
</div>

**My thesis.** My undergraduate thesis, which I conducted under fearless [Professor James Whitfield](http://jdwhitfield.com/) of Dartmoth College, centered upon much the same idea. In fact, I had to abandon a fair bit of my initial work after reading the NQS paper. I then centered my research around using machine learning techniques to obtain MPS coefficients. Like Carleo and Troyer, I used neural networks to approximate \\(\psi\\). Unlike Carleo and Troyer, my model produced a set of MPS coefficients which had some physical meaning (MPS coefficients always correspond to a certain state and site, e.g. "spin up, electron number 3").

$$
  \label{eqn:mps-definition}
  \lvert \psi_{mps} \rangle=\sum_{s_1,\dots,s_N=1}^d Tr(A[1]^{s_1}, \dots A[N]^{s_N}) \lvert s_1, \dots s_N \rangle
$$

**A word about MPS.** I should quickly explain what, exactly, a Matrix Product State _is_. Check out the equation above, which is the definition of MPS. The idea is to multiply a set of matrices, $$A$$ together and take the trace of the result. Each $$A$$ matrix corresponds to a particular site, $$A[n]$$, (e.g. "electron 3") and a particular state, $$A^{s_i}$$ (e.g. "spin $$\frac{1}{2}$$"). Each of the values obtained from the trace operation becomes a single coefficient of $$\psi$$, corresponding to a particular state $$\lvert s_1, \dots s_N \rangle$$.

## Cool -- but does it work?

**Yes -- for small systems.** In my thesis, I considered a toy system of 4 spin-$$\frac{1}{2}$$ particles interacting via the Heisenberg Hamiltonian. Solving this system, even via exact diagonalization, is pretty trivial. That's why I chose it -- it was easy to observe all the moving parts. Sure enough, I my model was able to find the ground state energy of the system with arbitrary precision.

**Achievements.** Not only could my model obtain good estimates of quantum ground states, it recovered approximate Matrix Product State (MPS) coefficients automatically. Shown below, for example, is a visualization of my model's MPS coefficients for the [GHZ state](https://en.wikipedia.org/wiki/Greenberger%E2%80%93Horne%E2%80%93Zeilinger_state), compared to one taken from the [MPS literature](http://www2.mpq.mpg.de/Theorygroup/CIRAC/wiki/images/9/9f/Eckholt_Diplom.pdf).

<div class="imgcap_noborder">
    <img src="/assets/quantum-nn/ghz-literature.png" width="46%">
    <img src="/assets/quantum-nn/ghz-mps-learn.png" width="46%">
    <img src="/assets/quantum-nn/ghz-colorscale.png" width="7%">
    <div class="thecap" style="text-align:center">Visual comparison of a 4-site Matrix Product State for the GHZ state a) listed in the literature b) obtained from my neural network model.</div>
</div>

**Limitations.** The careful reader might point out that, according to Figure 2, I still have to write out the full wave function. In order to scale up my approach, I needed to solve the same problem without ever explicitly writing \\(\psi\\). There were two options:

* 
1. _Evaluate energy locally_: there's a formula in [this paper](http://www2.mpq.mpg.de/Theorygroup/CIRAC/wiki/images/9/9f/Eckholt_Diplom.pdf). I tried to implement it but, well, there's only so much a clueless undergrad can get to work.
2. _Train variationally_: This is what the NQS paper did, and the approach I'm currently working on. Results are decent, but the training itself has been pretty unstable so far.

I'm still working on this project, but it should be finished soon -- look out for a paper soon!

## Outside the ivory tower

<div class="imgcap_noborder">
    <img src="/assets/quantum-nn/qcomputer.jpg" width="40%">
    <div class="thecap" style="text-align:center">A quantum computer developed by Joint Quantum Institute, U. Maryland (photo taken from <a href="https://www.nature.com/news/quantum-computers-ready-to-leap-out-of-the-lab-in-2017-1.21239">this</a> Nature article).</div>
</div>

Quantum computing is a research field that's poised to take on [commercial relevance](https://www.nature.com/news/quantum-computers-ready-to-leap-out-of-the-lab-in-2017-1.21239). Taming the wave function is one of the big hurdles we need to clear before this can happen. Hopefully, my findings will have a small role to play in making this happen.

Thanks for reading. If you found this post interesting, I encourage you to check out my [personal research blog](http://greydanus.github.io/about.html) or get in touch with me directly (sam dot 17 at dartmouth dot edu).