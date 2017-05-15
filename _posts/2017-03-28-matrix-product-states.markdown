---
layout: post
comments: true
title:  "Befriending Quantum Entanglement"
excerpt: "I introduce Matrix Product States (MPS), a method for compressing slightly entangled systems."
date:   2017-03-28 11:00:00
mathjax: true
---

<div class="imgcap_noborder">
    <img src="/assets/mps/stern-gerlach.png" width="40%">
    <div class="thecap" style="text-align:center">Silver plates used in the classic <a href="https://phet.colorado.edu/en/simulation/stern-gerlach">Stern-Gerlch experiment.</a></div>
</div>

I introduce Matrix Product States (MPS), a method for compressing slightly entangled systems.

## Entanglement

**Definition.** Entanglement happens when you can't describe one thing without describing something else. We must describe the dynamics of the entire _system_ in order to understand the behavior of just one of its components.

**Examples.** A classical analogue of entanglement is the red-blue stick. Imagine two people, Alice and Bob, and a stick which is red on one end and blue on the other. Without looking at the stick, you break it in two and give a half to each of them. Now the colors of these sticks are "entangled" with one another. If we know the color of one stick, we can infer the color of the other. Even if Bob were to take his stick to another country, we could still infer its color by observing Alice's half. Entanglement is independent of distance.

The simplest physical example of entanglement is a system of two spin-\\(\frac{1}{2}\\) particles, say, electrons. Since each electron can have a spin of either +\\(\frac{1}{2}\\) (\\(\uparrow\\)) or -\\(\frac{1}{2}\\) (\\(\downarrow\\)), the possible states of the entire system are {\\(\uparrow \uparrow, \uparrow \downarrow, \downarrow \uparrow, \downarrow \downarrow \\)}.

There's one catch. According to quantum mechanics, these

Solving for total angular momentum using the rules of quantum mechanics gives us a triplet state and a singlet state

$$
\begin{align}
& \quad \rvert 1, 1 \rangle = \uparrow \uparrow & \text{triplet} \\
& \quad \rvert 1, 0 \rangle = (\uparrow \downarrow + \downarrow \uparrow) \frac{\sqrt{2}}{2} & \text{triplet} \\
& \quad \rvert 1,-1 \rangle = \downarrow \downarrow & \text{triplet}\\
\\
& \quad  \rvert 0, 0 \rangle = (\uparrow \downarrow - \downarrow \uparrow) \frac{\sqrt{2}}{2} & \text{singlet} \\
\end{align}
$$

In the system above, only the second and fourth lines represent entangled systems; the others are pure states (all up or all down), so knowing one particle's state tells us nothing new about the second.

**Tensor Products.** What about systems with an arbitrary number of sites (e.g. particles), each with an arbitrary number of states (e.g. spins)? In order to describe entanglement in the general case, we need to introduce a powerful operation called the _tensor product_. The tensor product is denoted by the \\(\otimes\\) symbol and operates on two tensors to produce a third. Matrices are two dimensional tensors.

$$
A^{m \times n} \otimes B^{p \times q} = C^{mp \times nq}
$$

Now suppose

$$
\begin{align}
& A^{m \times n} = \left(\begin{array}{cc} A_{11} & A_{12} \\ A_{21} & A_{22} \end{array}\right)
& B^{p \times q} = \left(\begin{array}{cc} B_{11} & B_{12} \\ B_{21} & B_{22} \end{array}\right)
\end{align}
$$

Then the tensor product looks like

$$
\begin{align}
A^{m \times n} \otimes B^{p \times q} &= C^{mp \times nq} \\
&= \left(\begin{array}{cc} 
A_{11} \left(\begin{array}{cc} B_{11} & B_{12} \\ B_{21} & B_{22} \end{array}\right) &
A_{12} \left(\begin{array}{cc} B_{11} & B_{12} \\ B_{21} & B_{22} \end{array}\right) \\
A_{21} \left(\begin{array}{cc} B_{11} & B_{12} \\ B_{21} & B_{22} \end{array}\right) &
A_{22} \left(\begin{array}{cc} B_{11} & B_{12} \\ B_{21} & B_{22} \end{array}\right)
\end{array}\right) \\

&= \left(\begin{array}{cc}
A_{11}B_{11} & A_{11}B_{12} & A_{12}B_{11} & A_{12}B_{12} \\
A_{11}B_{21} & A_{11}B_{22} & A_{12}B_{21} & A_{12}B_{22} \\
A_{21}B_{11} & A_{21}B_{12} & A_{22}B_{11} & A_{22}B_{12} \\
A_{21}B_{21} & A_{21}B_{22} & A_{22}B_{21} & A_{22}B_{22} \\
\end{array}\right)

\end{align}
$$

The tensor product extends naturally to other higher dimensions. Now let's use the tensor product to describe the spin-\\(\frac{1}{2}\\) system. From basic quantum mechanics, we know that each of these particles has a wave function, \\(\rvert \psi_1 \rangle\\) and \\(\rvert \psi_2 \rangle\\) and each wave function exists in an _n_-dimensional Hilbert space. In this case, \\(n=2\\) for both. Now we can use the tensor product to find \\(\rvert \psi_{system} \rangle\\), the wavefunction of the full two-particle system.

$$
\begin{align}
\rvert \psi_{sys} \rangle &= \rvert \psi_1 \rangle \rvert \psi_2 \rangle \\
&= \rvert \psi_1 \rangle \otimes \rvert \psi_2 \rangle \\
&=  \left(\begin{array}{cc} \uparrow \\ \downarrow \\ \end{array}\right)
	\otimes
	\left(\begin{array}{cc} \uparrow \\ \downarrow \\ \end{array}\right) \\
&=  \left(\begin{array}{cc}
	\uparrow \uparrow \\
	\uparrow \downarrow + \downarrow \uparrow \\
	\uparrow \downarrow - \downarrow \uparrow \\
	\downarrow \downarrow\\
	\end{array}\right)

\end{align}
$$

**General case.** For a system with _s_ sites and _d_ states, 


**Uses**



**The curse of dimensionality.**

<script src="//repl.it/embed/Gktq/3.js"></script>