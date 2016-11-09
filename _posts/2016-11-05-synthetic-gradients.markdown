---
layout: post
comments: true
title:  "Learning to Accept Synthetic Gradients"
excerpt: "Synthetic gradients achieve the perfect balance of stupid and brilliant. In a 100-line Gist I'll introduce this exotic and powerful technique and use it to train a neural network."
date:   2016-11-05 11:00:00
mathjax: true
---

<div class="imgcap_noborder">
	<img src="/assets/papers/synthgrad.png" width="20%">
</div>

Synthetic gradients achieve the perfect balance of stupid and brilliant. In a 100-line Gist I'll introduce this exotic and powerful technique and use it to train a neural network.

## The Idea

Just introduce the basic idea and comment on its strengths and weaknesses. Talk about the findings in the paper

## The Model

<div class="imgcap">
	<img src="/assets/regularization/mnist.png" width="30%">
	<div class="thecap" style="text-align:center">MNIST training samples</div>
</div>

Just as in my [regularization post](https://greydanus.github.io/2016/09/05/regularization/), we'll be training an MNIST classifier. Take some code snippets from the Gist. 

```python
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets('MNIST_data', one_hot=True)

batch = mnist.train.next_batch(batch_size)
```

Use diagrams of the model 1) taken from the DeepMind blog post and 2) customized for my code. Write about differences between DeepMind version and my version


## Results

Include a graph of 1) regular model 2) stale gradients 3) synthetic gradients. Include a visual of gradients at a random time step, showing that the synthetic ones closely match the real ones

Talk about applications of synthetic gradients to various deep learning models. Multi agent systems


## Sloth or Croissant?

Closing thoughts go here. Just as with the sloth or croissant meme, it's hard to tell the different between stupid ideas and really creative/brilliant ideas. How can we tell the difference? Discussion about this