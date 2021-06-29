---
layout: post
comments: true
title:  "The Paths Perspective on Value Learning"
excerpt: "I recently published a Distill article about value learning. This post includes a link to the article and some commentary on the Distill format."
date:   2020-01-27 11:00:00
mathjax: true
thumbnail: /assets/paths-perspective/thumbnail.png
author: Sam Greydanus
---

I recently published a Distill article about value learning. This post includes a link to the article and some commentary on the Distill format.

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<a href="https://distill.pub/2019/paths-perspective-on-value-learning/" id="featuredlink" target="_blank" style="margin-right: 10px;">Read this article on Distill</a>
</div>

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<a href="https://distill.pub/2019/paths-perspective-on-value-learning/" target="_blank">
		<img src="/assets/paths-perspective/screenshot.png">
	</a>
</div>

## Thoughts on Distill

I've admired Distill since its inception. Early on I could tell by the clean diagrams, interactive demos, and digestible prose that the authors knew a lot about their craft. On top of that, I was excited because Distill filled two important niches.

**Niche 1: Repaying research debt.** Our field has a rapid publication cycle and most researchers write more than one paper per year. The unintended consequence is that many of these papers are poorly written, quickly outdated, or even flat-out incorrect. Distill's solution has been to collect the most important ideas and insights of machine learning in one place, without all the noise. In my experience this works well; I often learn as much from reading one Distill paper as I would from ten conference papers.

<!-- <div class="imgcap" style="display: block; margin-left: auto; margin-right: auto; width:53%">
	<img src="/assets/paths-perspective/arxiv-papers.jpeg">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 2.</b> The number of ML papers on arXiv is rapidly increasing (plot credit: <a href="https://t.co/6tjdLocleT?amp=1">Jeff Dean</a>). With this flood of new papers, much more "publication noise" has entered our field. Distill is one promising medium for separating the signal from the noise.</div>
</div> -->

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:60%">
	<!-- <img src="/assets/paths-perspective/research-debt.jpg"> -->
	<img src="/assets/paths-perspective/arxiv-papers.jpeg">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 1.</b> The number of ML papers uploaded to ArXiv has increased exponentially in recent years. Distill aims to <a href="https://distill.pub/2017/research-debt/">reduce publication noise</a> by summarizing key research ideas in a low-volume, peer-reviewed setting.</div>
</div>

**Niche 2: Highlighting qualitative results.** These days, it can be difficult to publish a deep learning paper [without a nice table showing that your approach achieves state-of-the-art results](https://twitter.com/TacoCohen/status/1073902391270014976). These tables are certainly important, but a qualitative understanding of _what_ the model is doing and _why_ is just as important. Distill prioritizes these "science of deep learning" questions as Chris Olah told me, "because there is so much more to a neural network than its test loss."

<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:43%">
	<img src="/assets/paths-perspective/flowers.jpeg" style="width:85%">
	<div class="thecap" style="text-align:left; width:100%"><b>Figure 2.</b> Distill advocates <a href="https://distill.pub/2017/feature-visualization/">visualization</a> <a href="https://distill.pub/2018/differentiable-parameterizations/">techniques</a> that help researchers answer qualitative questions about their models.</div>
</div>

## My experience with Distill

Writing a Distill article is Type 2 fun. It's not easy and it's not comfortable but it will make you a better researcher. My experience involved a lot of background research (re-reading Sutton's RL textbook and watching David Silver's lectures on YouTube) and a lot of work at a whiteboard. During the drafting process I had to delete everything and start from scratch a couple times. At times the process was frustrating and painful, but I sincerely believe that most of it was "growing pains" because I was pushing myself to create something really excellent.

Writing a Distill article is not an individual pursuit. I was fortunate enough to work with Chris Olah and others from the editorial team. The editors have high standards but they make a sincere effort to get new people involved. They spent a lot of time teaching me the skills and thought processes I needed in order to make the article shine.

**Advice.** My main advice is that _writing a Distill article is not like writing a conference paper_. If you approach it with the same expectations, you will be sad. If you approach it with different expectations, you will be happy. A few key differences:

<ul style="list-style-type:disc;">
	<li><u>Audience</u>. Your audience is no longer your reviewers plus a smattering of people who study what you study. Now your audience is anyone who cares about ML research. When I write a conference paper, I imagine I'm explaining my results to one of my professors. When I write a Distill article, I imagine I'm explaining my results to a smart undergraduate.</li>
	<li><u>The story you tell</u>. Many conference papers target a shortcoming of previous work and propose a better solution. Distill articles read more like natural science articles: the author collects data, analyzes it, and then reports what they found. A good example is <a href="https://distill.pub/2019/activation-atlas/">Activation Atlases</a> where the authors <i>observe</i> the features of a vision model, <i>hypothesize</i> about what they are doing, and then <i>verify</i> the hypothesis. Some articles such as <a href="https://distill.pub/2016/misread-tsne/">How to Use T-SNE Effectively</a> don't even report new knowledge and instead focus on explaining a known concept really well.</li>
	<li><u>Diagrams and demos</u>. Distill puts a premium on clarity. This doesn't mean that you <i>need</i> to have fancy diagrams or demos in your article (some strong Distill articles do not), but if they are the best way to explain something, then use them! I got a lot of satisfaction from making my diagrams in Illustrator, coding my demos in JavaScript, and putting lots of time and thought into making things beautiful.</li>
	<li><u>Time to submission</u>. From the initial idea to the final draft, you'll need about twice as much time as you'd need for a conference paper.</li>
	<li><u>Time of review process</u>. Plan on the review process also taking about twice as long.</li>
	<li><u>Sense of wonder</u>. The very best modes of science communication have a way of inspiring wonder and excitement in their audience. Distill is no exception. Its articles help young researchers see the beauty and promise of the field in a way that conference papers, textbooks, and boring lectures cannot. An implicit part of writing a Distill article involves channeling your "sense of wonder" so that your readers can experience it too.</li>
</ul>

**Takeaway.** I had a good experience working with Distill and would recommend it to others. I'm happy to answer specific questions about the process over email.

