---
layout: post
comments: true
title:  "Piecewise-constant Neural ODEs"
excerpt: "We propose a timeseries model that can be integrated adaptively. It jumps over simulation steps that are predictable and spends more time on those that are not."
date:   2021-06-11 11:00:00
mathjax: true
author: Sam Greydanus, Stefan Lee, and Alan Fern
thumbnail: /assets/piecewise-nodes/thumbnail.png
---

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_sim" style="width:100%;min-width:250px;">
    	<source src="/assets/piecewise-nodes/video_simulator_2.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_sim_button" onclick="playPauseSim()">Play</button> 
    <div style="text-align: left;margin-left:10px;margin-right:10px;">Using model-based planning to play billiards. The goal is to impart the tan cue ball with an initial velocity so as to move the blue ball to the black target.</div>
  </div>
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_base" style="width:100%;min-width:250px;">
    	<source src="/assets/piecewise-nodes/video_base_2.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_base_button" onclick="playPauseBase()">Play</button> 
    <div style="text-align:left;margin-left:10px;margin-right:10px;">A baseline ODE-RNN trained on billiards dynamics can also be used for model-based planning. It's inefficient because it has to "tick" at a constant rate.</div>
  </div>
   <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;">
    <video id="video_ours" style="width:100%;min-width:250px;">
    	<source src="/assets/piecewise-nodes/video_ours_2.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_ours_button" onclick="playPauseOurs()">Play</button> 
    <div style="text-align:left;margin-left:10px;margin-right:10px;">By contrast, our model, trained on the same task, can perform planning in many fewer steps by jumping over spans of time where motion is predictable.</div>
  </div>
</div>

<script> 
function playPauseSim() { 
  var video = document.getElementById("video_sim"); 
  var button = document.getElementById("video_sim_button");
  if (video.paused) {
    video.play();
	button.textContent = "Pause";}
  else {
    video.pause(); 
	button.textContent = "Play";}
} 

function playPauseBase() { 
  var video = document.getElementById("video_base"); 
  var button = document.getElementById("video_base_button");
  if (video.paused) {
    video.play();
	button.textContent = "Pause";}
  else {
    video.pause(); 
	button.textContent = "Play";}
} 

function playPauseOurs() { 
  var video = document.getElementById("video_ours"); 
  var button = document.getElementById("video_ours_button");
  if (video.paused) {
    video.play();
	button.textContent = "Pause";}
  else {
    video.pause(); 
	button.textContent = "Play";}
} 
</script>

<div style="display: block; margin-left: auto; margin-right: auto; width:100%; text-align:center;">
	<a href="https://arxiv.org/abs/2106.06621" id="linkbutton" target="_blank">Read the paper</a>
	<a href="https://github.com/greydanus/piecewise_node#run-in-your-browser" id="linkbutton" target="_blank"><span class="colab-span">Run</span> in browser</a>
	<a href="https://github.com/greydanus/piecewise_node" id="linkbutton" target="_blank">Get the code</a>
</div>

## Change, it is said, happens slowly and then all at once...

Billiards balls move across a table before colliding and changing trajectories; water molecules cool slowly and then undergo a rapid phase transition into ice; and economic systems enjoy periods of stability interspersed with abrupt market downturns. That is to say, many time series exhibit periods of relatively homogeneous change divided by important events. Despite this, recurrent neural networks (RNNs), popular for time series modeling, treat time in uniform intervals -- potentially wasting prediction resources on long intervals of relatively constant change.

A recent family of models called [Neural ODEs](https://arxiv.org/abs/1806.07366) has attracted interest as a means of mitigating these problems. They parameterize the _time derivative_ of a hidden state with a neural network and then integrate it over arbitrary amounts of time. This allows them to treat time as a continuous variable. Integration can even be performed using adaptive integrators like [Runge-Kutta](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods), thus allocating more compute to difficult state transitions.

Adaptive integration is especially attractive in scenarios where "key events" are separated by variable amounts of time. In the game of billiards, these key events may consist of collisions between balls, walls, and pockets. Between these events, the balls simply undergo linear motion. That motion is not difficult to predict, but it is non-trivial for a model to learn to skip over it so as to focus on the more chaotic dynamics of collisions; this requires a model to employ some notion of [_temporal abstraction_](https://www.sciencedirect.com/science/article/pii/S0004370299000521). This problem is not unique to billiards. The same challenge occurs in robotics, where a robot arm occasionally interacts with external objects at varying intervals. It may also occur in financial markets, scientific timeseries, and other environments where change happens at a variable rate.

## Towards temporally-abstract hidden state dynamics

In this post, I am going to introduce a special case of Neural ODEs that my research group has been experimenting with recently. The core idea is to restrict the hidden state of a Neural ODE so that it has locally-linear dynamics. The benefit of such a model is that it can be integrated _exactly_ using Euler integration, and it can also be integrated _adaptively_ because we allow these locally-linear dynamics to extend over variable-sized durations of time. Like RNNS and Neural ODEs, our model uses a hidden state \\(h\\) to summarize knowledge about the world at a given point in time. Also, it performs updates on this hidden state using cell updates (eg. with vanilla, LSTM, or GRU cells). But our model differs from existing models in that the amount of simulation time that occurs between cell updates is not fixed. Rather, it changes according to the variable \\(\Delta t\\), which is itself predicted.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px">
  <img src="/assets/piecewise-nodes/hero.png" style="width:100%">
</div>

Our model also predicts a _hidden state velocity_, \\(\dot h\\), at each cell update; this enables us to evolve the hidden state dynamics continuously over time according to \\(h(t+\Delta t) = h + \dot h \Delta t\\). In other words, the hidden state velocity allows us to parameterize _the locally-linear dynamics of the hidden state_. Thus when our model needs to simulate long spans of homogeneous change (eg, a billiard ball undergoing linear motion), it can do so with a single cell update.

In order to compare our model to existing timeseries models (RNNs and Neural ODEs), we used both of them to model a series of simple physics problems including the collisions of two billiards balls. We found that our jumpy model was able to learn these dynamics at least as well as the baseline while using a fraction of the forward simulation steps. This makes it a great candidate for model-based planning because it can predict the outcome of taking an action much more quickly than a baseline model. And since the hidden-state dynamics are piecewise-linear over time, we can solve for the hidden state at arbitrary points along a trajectory. This allows us to simulate the dynamics _at a higher temporal resolution than the original training data_:

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
    <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_sim2" style="width:100%;min-width:250px;">
      <source src="/assets/piecewise-nodes/video_sim_2.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_sim2_button" onclick="playPauseSim2()">Play</button> 
    <div style="text-align: left;margin-left:10px;margin-right:10px;">This video will give you a sense of the underlying temporal resolution of the billiards dataset on which we trained the model.</div>
  </div>
  <div style="width:32%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;">
    <video id="video_interp" style="width:100%;min-width:250px;">
    	<source src="/assets/piecewise-nodes/video_interp_2.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_interp_button" onclick="playPauseInterp()">Play</button> 
    <div style="text-align:left;margin-left:10px;">This video shows how we can use our model to generate simulations at a higher temporal resolution than that of the original simulator. 
<!--     We can do this because the latent dynamics of the model are continuous and piecewise-linear in time. -->
  </div>
  </div>
</div>

<script> 
function playPauseSim2() { 
  var video = document.getElementById("video_sim2"); 
  var button = document.getElementById("video_sim2_button");
  if (video.paused) {
    video.play();
	button.textContent = "Pause";}
  else {
    video.pause(); 
	button.textContent = "Play";}
} 

function playPauseJumpy2() { 
  var video = document.getElementById("video_jumpy2"); 
  var button = document.getElementById("video_jumpy2_button");
  if (video.paused) {
    video.play();
	button.textContent = "Pause";}
  else {
    video.pause(); 
	button.textContent = "Play";}
} 

function playPauseInterp() { 
  var video = document.getElementById("video_interp"); 
  var button = document.getElementById("video_interp_button");
  if (video.paused) {
    video.play();
	button.textContent = "Pause";}
  else {
    video.pause(); 
	button.textContent = "Play";}
} 
</script>

I am going to give more specific examples of how our model improves over regular timeseries models later. But first we need to talk about what these timeseries models are good at and why they are worth improving in the first place.

## The value of timeseries models

Neural network-based timeseries models like RNNs and Neural ODEs are interesting because they can learn complex, long-range structure in time series data simply by predicting one point at a time. For example, if you train them on observations of a robot arm, you can use them to generate realistic paths that the arm might take.

One of the things that makes these models so flexible is that they use a hidden vector \\(h\\) to store memories of past observations. And they can _learn_ to read, write, and erase information from \\(h\\) in order to make accurate predictions about the future. RNNs do this in discrete steps whereas Neural ODEs permit hidden state dynamics to be continuous in time. Both models are Turing-complete and, unlike other models that are Turing-complete (eg. HMMs or FSMs), they can learn and operate on noisy, high-dimensional data. Here is an incomplete list of things people have trained these models (mostly RNNs) to do:
* [Translate text from one language to another](http://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-)
* [Control a robot hand in order to solve a Rubik’s Cube](https://openai.com/blog/solving-rubiks-cube/)
* [Defeat professional human gamers in StarCraft](https://rdcu.be/bVI7G)
* [Caption images](https://openaccess.thecvf.com/content_cvpr_2016/html/Johnson_DenseCap_Fully_Convolutional_CVPR_2016_paper.html)
* [Generate realistic handwriting](https://arxiv.org/abs/1308.0850)
* [Convert text to speech](https://www.isca-speech.org/archive/interspeech_2014/i14_1964.html)
* [Convert speech to text](http://www.jmlr.org/proceedings/papers/v48/amodei16.html)
* [Sketch simple images](https://arxiv.org/abs/1704.03477)
* [Learn the Enigma cipher](https://greydanus.github.io/2017/01/07/enigma-rnn/) [one of my first projects :D]
* [Predict patient ICU data such as aiastolic arterial blood pressure](https://arxiv.org/abs/1907.03907) [Neural ODEs]


## Limitations of these sequence models

Let's begin with the limitations of RNNs, use them to motivate Neural ODEs, and then discuss the contexts in which even Neural ODEs have shortcomings. The first and most serious limitation of RNNs is that they can only predict the future by way of discrete, uniform "ticks".

**Uniform ticks.** At each tick they make one observation of the world, perform one read-erase-write operation on their memory, and output one state vector. This seems too rigid. We wouldn’t divide our perception of the world into uniform segments of, say, ten minutes. This would be silly because the important events of our daily routines are not spaced equally apart.

Consider the game of billiards. When you prepare to strike the cue ball, you imagine how it will collide with other balls and eventually send one of them into a pocket. And when you do this, you do not think about the constant motion of the cue ball as it rolls across the table. Instead, you think about the near-instantaneous collisions between the cue ball, walls, and pockets. Since these collisions are separated by variable amounts of time, making this plan requires that you jump from one collision event to another without much regard for the intervening duration. This is something that RNNs cannot do.

<div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:99.9%">
    <div style="width:100%; min-width:250px; display: inline-block; vertical-align: top;text-align:center;padding-right:10px;">
    <video id="video_pool" style="width:100%;min-width:250px;">
      <source src="/assets/piecewise-nodes/pool_shot.mp4" type="video/mp4">
    </video>
    <button class="playbutton" id="video_pool_button" onclick="playPausePool()">Play</button> 
    <div style="text-align: left;">A professional pool player making a remarkable shot. We'll never know exactly what was going through his head when he did this, but we can say at the very least he was planning over a sequence of collisions. An RNN, by contrast, would focus most of its compute on simulating the linear motion of the ball in between collisions.</div>
  </div>
</div>

<script> 
function playPausePool() { 
  var video = document.getElementById("video_pool"); 
  var button = document.getElementById("video_pool_button");
  if (video.paused) {
    video.play();
  button.textContent = "Pause";}
  else {
    video.pause(); 
  button.textContent = "Play";}
} 
</script>

**Discrete time steps.** Another issue with RNNs is that they perceive time as a series of discrete “time steps” that connect neighboring states. Since time is actually a continuous variable -- it has a definite value even in between RNN ticks -- we really should use models that treat it as such. In other words, when we ask our model what the world looked like at time \\( t=1.42\\) seconds, it should not have to locate the two ticks that are nearest in time and then interpolate between them, as is the case with RNNs. Rather, it should be able to give a well-defined answer.

**Avoiding discrete, uniform timesteps with Neural ODEs.** These problems represent some of the core motivations for Neural ODEs. Neural ODEs parameterize the time derivative of the hidden state and, when combined with an ODE integrator, can be used to model dynamical systems where time is a continuous variable. These models represent a young and rapidly expanding area of machine learning research. One unresolved challenge with these models is getting them to run efficiently with adaptive ODE integrators...

The problem is that adaptive ODE integrators must perform several function evaluations in order to estimate local curvature when performing an integration step. The curvature information determines how far the integrator can step forward in time, subject to a constant error budget. This is a particularly serious issue in the context of neural networks, which may have very irregular local curvatures at initialization. A single Neural ODE training step can take up to five times longer to evaluate than a comparable RNN architecture, making it challenging to scale these models.[^fn7] The curvature problem has, in fact, already motivated some work on regularizing the curvature of Neural ODEs so as to train them more efficiently.[^fn6] But even with regularization, these models are more difficult to train than RNNs. Furthermore, there are many tasks where regularizing curvature is counterproductive, for example, modeling elastic collisions between two bodies.[^fn18]



## Our Results

Our work on piecewise-constant Neural ODEs was an attempt to fix these issues. Our model can jump over different durations of time and can tick more often when a lot is happening and less often otherwise. As I explained earlier, these models are different from regular RNNs in that they predict a hidden state velocity in addition to a hidden state. Taken together, these two quantities represent a linear dynamics function in the RNN’s latent space. A second modification is to have the model predict the duration of time \\(\Delta t\\) over which its dynamics functions are valid. In some cases, when change is happening at a constant rate, this value can be quite large.

**Learning linear motion.** To show this more clearly, we conducted a simple toy experiment. We created a toy dataset of perfectly linear motion and checked to see whether our model would learn to summarize the whole thing in one step. As the figure below shows, it learned to do exactly that. Meanwhile, the regular RNN had to summarize the same motion in a series of tiny steps.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px">
  <img src="/assets/piecewise-nodes/lines.png" style="width:100%">
</div>

**Learning a change of basis.** Physicists will tell you that the way a system changes over time is only linear with respect to a particular coordinate system. For example, an object undergoing constant circular motion has nonlinear dynamics when we use Cartesian coordinates, but linear dynamics when we use polar coordinates. That’s why physicists use different coordinates to describe different physical systems: <u><i>all else being equal, the best coordinates are those that are maximally linear with respect to the dynamics.</i></u>

Since our model forces dynamics to be linear in latent space, the encoder and decoder layers naturally learn to transform input data into a basis where the dynamics are linear. For example, when we train our model on a dataset of circular trajectories represented in Cartesian coordinates, it learns to summarize such trajectories in a single step. This implies that our model has learned a Cartesian-to-Polar change of basis.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px">
  <img src="/assets/piecewise-nodes/circles.png" style="width:100%">
</div>

**Learning from pixel videos.** Our model can learn more complicated change-of-basis functions as well. Later in the paper, we trained our model on pixel observations of two billiards balls. The pixel “coordinate system” is extremely nonlinear with respect to the linear motion of the two balls. And yet our model was able to predict the dynamics of the system far more effectively than the baseline model, while using three times fewer "ticks". The fact that our model could make jumpy predictions on this dataset implies that it found a basis where the billiards dynamics were linear for significant durations of time -- something that is strictly impossible in a pixel basis.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px">
  <img src="/assets/piecewise-nodes/pixel_billiards.png" style="width:100%">
</div>

In fact, we suspect that forcing dynamics to be linear in latent space actually biased our model to find linear dynamics. We hypothesize that the baseline model performed worse on this task because it had no such inductive bias. This is generally a good inductive bias to build into a model because most real-world dynamics can be approximated with piecewise-linear functions



## Planning

One of the reasons we originally set out to build this model was that we wanted to use it for planning. We were struck by the fact that many events one would want to plan over -- collisions, in the case of billiards -- are separated by variable durations of time. We suspected that a model that could jump through uneventful time intervals would be particularly effective at planning because it could plan over the events that really mattered (eg, collisions).

In order to test this hypothesis, we compared our model to RNN and ODE-RNN baselines on a simple planning task in the billiards environment. The goal was to impart one ball, the “cue ball” (visualized in tan) with an initial velocity such that it would collide with the second ball and the second ball would ultimately enter a target region (visualized in black). You can see videos of such plans at the beginning of this post.

We found that our model used at least half the wall time of the baselines and produced plans with a higher probability of success. These results are preliminary -- and part of ongoing work -- but they do support our initial hypothesis.

Simulator | Baseline RNN | Baseline ODE-RNN | Our model
:---: | :---: | :---:| :---:
85.2% | 55.6% | 17.0% | 61.6%

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%; min-width: 300px">
  <img src="/assets/piecewise-nodes/planning2d.png" style="width:45%">
</div>

<!-- Quite a few researchers have wrestled with the fact that RNNs tick through time at a uniform rate. So there are a number of recent projects that aim to make RNNs more temporally abstract. Our work is related, and hopefully complementary, to these approaches. -->

## Related work aside from RNNs and Neural ODEs

<!-- Quite a few researchers have wrestled with the same limitations of RNNs that we have. So there are a number of related works aimed at solving the same issues. Among the most relevant of these works is a family of models called Neural ODEs.

**Neural ODEs.** The past few years have seen a surge of interest in these models. The basic idea of a Neural ODE is to parameterize the derivative of some variable with a neural network and then integrate it. For example, if you wanted to obtain the continuous-time dynamics of a hidden state \\(h_t\\), you would start by setting \\(\frac{\partial h_t}{\partial t}=f_{NN}(h_t)\\) where \\(f_{NN}\\) is a neural network. Then you could integrate that function over time to get dynamics:

$$ h_{t_1} ~=~ h_{t_0} + \int_{t_0}^{t_1} f_{NN}(h_t) ~~ dt $$

One of the remarkable things about this approach is that you can literally integrate your model with an ODE integrator, eg. ``scipy.integrate.solve_ivp``. Likewise, you can backpropagate error signals to your model with a second call to the integrator.

**Connection to our work.** Neural ODEs can be integrated _adaptively_; in other words, the size of the integration step can be made proportional to the local curvature. So in theory, if one were to regularize a Neural ODE to have very low curvature, one might be able to see the same jumpy behavior that we document in Jumpy RNNs. In practice, figuring out how to properly regularize the curvature of these models remains an open question.[^fn6] And current versions of Neural ODEs tend to be _more_ computationally demanding to evaluate than regular RNN models. In a recent paper about modeling RNN hidden state dynamics with ODEs[^fn7], for example, the authors mention that the ODE forward passes took 60% -- 120% longer than standard RNNs since they had to be continuously solved even when no observations were occurring.

Jumpy RNNs resemble Neural ODEs in that they parameterize the derivative of a hidden state. But unlike Neural ODEs, Jumpy RNNs assume that the function being integrated is piecewise-linear and they do not require an ODE solver. The local linearity assumption makes our model extremely efficient to integrate over long spans of time -- much more efficient, for example, than a baseline RNN, and by extension, a Neural ODE.[^fn0]

**Other related works.**  -->

Quite a few researchers have wrestled with the same limitations of RNNs and Neural ODEs that we have in this post. For example, there are a number of other RNN-based models designed with temporal abstraction in mind: Koutnik et al. (2014)[^fn1] proposed dividing an RNN internal state into groups and only performing cell updates on the \\(i^{th}\\) group after \\(2^{i-1}\\) time steps. More recent works have aimed to make this hierarchical structure more adaptive, either by data-specific rules[^fn2] or by a learning  mechanism[^fn3]. But although these hierarchical recurrent models can model data at different timescales, they still must perform cell updates at every time step in a sequence and cannot jump over regions of homogeneous change.

For a discussion of these methods (and many others), check out [the full paper](https://arxiv.org/abs/2106.06621), which we link to at the top of this post.
<!-- Another relevant work from reinforcement learning is "Embed to Control"[^fn5]. This work is similar to ours in that it assumes that dynamics are linear in latent space. But unlike our work, the E2C model performs inference over discrete, uniform time steps and does not learn a jumpy behavior. -->


## Closing thoughts

Neural networks are already a widely used tool, but they still have fundamental limitations. In this post, we reckoned with the fact that they struggle at adaptive timestepping and the computational expense of integration. In order to make RNNs and Neural ODEs more useful in more contexts, it is essential to find solutions to such restrictions. With this in mind, we proposed a PC-ODE model which can skip over long durations of comparatively homogeneous change and focus on pivotal events as the need arises. We hope that this line of work will lead to models that can represent time more efficiently and flexibly.

## Footnotes

[^fn0]: A largely subjective observation was that Jumpy RNNs seemed easier to train and scale than Neural ODEs. With that said, one should note that Neural ODEs are improving at a rapid pace, and so this may change as time passes.
[^fn1]: Jan Koutnik, Klaus Greff, Faustino Gomez, and Juergen Schmidhuber. [A Clockwork RNN](https://arxiv.org/abs/1402.3511). _International Conference on Machine Learning_, pp. 1863–1871, 2014.
[^fn2]: Wang Ling, Isabel Trancoso, Chris Dyer, and Alan W Black. [Character-based neural machine translation](https://arxiv.org/abs/1511.04586). _Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics_, 2015.
[^fn3]: Junyoung Chung, Sungjin Ahn, and Yoshua Bengio. [Hierarchical multiscale recurrent neural networks](https://arxiv.org/abs/1609.01704). _5th International Conference on Learning Representations_, ICLR 2017.
[^fn4]: Karol Gregor, George Papamakarios, Frederic Besse, Lars Buesing, and Theophane Weber. [Temporal difference variational auto-encoder](https://arxiv.org/abs/1806.03107). _International Conference on Learning Representations_, 2018.
[^fn5]: Manuel Watter, Jost Springenberg, Joschka Boedecker, and Martin Riedmiller. [Embed to control: A locally linear latent dynamics model for control from raw images](https://arxiv.org/abs/1506.07365). _Advances in Neural Information Processing Systems_, pp. 2746–2754, 2015.
[^fn6]: Chris Finlay, Jörn-Henrik Jacobsen, Levon Nurbekyan, and Adam M Oberman. [How to train your neural ode: the world of jacobian and kinetic regularization](https://arxiv.org/abs/2002.02798). _International Conference on Machine Learning_, 2020.
[^fn7]: Yulia Rubanova, Ricky TQ Chen, and David Duvenaud. [Latent odes for irregularly-sampled time series](https://papers.nips.cc/paper/8773-latent-ordinary-differential-equations-for-irregularly-sampled-time-series). _Advances in Neural Information Processing Systems_, 2019.
[^fn8]: Sutskever, Ilya, Oriol Vinyals, and Quoc V. Le. [Sequence to sequence learning with neural networks](http://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-). _Advances in neural information processing systems_. 2014.
[^fn9]: OpenAI, Ilge Akkaya, Marcin Andrychowicz, Maciek Chociej, Mateusz Litwin, Bob McGrew, Arthur Petron, Alex Paino, Matthias Plappert, Glenn Powell, Raphael Ribas, Jonas Schneider, Nikolas Tezak, Jerry Tworek, Peter Welinder, Lilian Weng, Qiming Yuan, Wojciech Zaremba, Lei Zhang. [Solving a Rubik's cube with a robot hand](https://arxiv.org/abs/1910.07113). arXiv preprint arXiv:1910.07113 (2019).
[^fn10]: Vinyals, Oriol, et al. [Grandmaster level in StarCraft II using multi-agent reinforcement learning](https://rdcu.be/bVI7G). Nature 575.7782 (2019): 350-354.
[^fn11]: Johnson, Justin, Andrej Karpathy, and Li Fei-Fei. [Densecap: Fully convolutional localization networks for dense captioning](https://openaccess.thecvf.com/content_cvpr_2016/html/Johnson_DenseCap_Fully_Convolutional_CVPR_2016_paper.html). Proceedings of the IEEE conference on computer vision and pattern recognition. 2016.
[^fn12]: Graves, Alex. [Generating sequences with recurrent neural networks](https://arxiv.org/abs/1308.0850). arXiv preprint arXiv:1308.0850 (2013). Also, see [my own blog post](https://greydanus.github.io/2016/08/21/handwriting/) on this topic :)
[^fn13]: Graves, Alex, Abdel-rahman Mohamed, and Geoffrey Hinton. [Speech recognition with deep recurrent neural networks](https://ieeexplore.ieee.org/abstract/document/6638947/). 2013 IEEE international conference on acoustics, speech and signal processing. IEEE, 2013.
[^fn14]: Amodei, Dario, et al. [Deep speech 2: End-to-end speech recognition in english and mandarin.](http://www.jmlr.org/proceedings/papers/v48/amodei16.html) International conference on machine learning. 2016.
[^fn15]: Fan, Y., Qian, Y., Xie, F. L., & Soong, F. K. [TTS synthesis with bidirectional LSTM based recurrent neural networks](https://www.isca-speech.org/archive/interspeech_2014/i14_1964.html). Fifteenth Annual Conference of the International Speech Communication Association. 2014.
[^fn16]: Ha, David, and Douglas Eck. [A neural representation of sketch drawings](https://arxiv.org/abs/1704.03477). _International Conference on Machine Learning_, 2018.
[^fn17]: This was my contribution! I wrote a blog post about it [here](https://greydanus.github.io/2017/01/07/enigma-rnn/).
[^fn18]: Jia, Junteng, and Austin R. Benson. [Neural jump stochastic differential equations](https://papers.nips.cc/paper/2019/hash/59b1deff341edb0b76ace57820cef237-Abstract.html). Neural Information Processing Systems, 2019

