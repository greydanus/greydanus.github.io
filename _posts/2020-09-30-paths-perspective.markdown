---
layout: post
comments: true
title:  "The Paths Perspective on Value Learning"
excerpt: "Do you formally know Monte-Carlo and TD learning, but don't intuitively understand the difference? I wrote a Distill paper for people like you."
date:   2020-09-30 11:00:00
mathjax: true
<!-- thumbnail: /assets/structural-optimization-cnns/optimize.png -->
author: Sam Greydanus
thumbnail: /assets/paths-perspective/thumbnail.png
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



<div class="imgcap_noborder" style="display: block; margin-left: auto; margin-right: auto; width:100%">
	<img src="/assets/paths-perspective/main.png">
	<div class="thecap"  style="text-align:left; display:block; margin-left: auto; margin-right: auto; width:80%">Hero image</div>
</div>

<div style="display: block; margin-left: auto; margin-right: auto; width:450px">
	<a href="https://distill.pub/2019/paths-perspective-on-value-learning/" id="linkbutton" target="_blank" style="margin-right: 10px;">Read the paper</a>
	<!-- <a href="/files/code-not-up.txt" id="linkbutton" target="_blank"  style="margin-left: 10px;">Get the code</a> -->
</div>

## Footnotes

[^fn1]: Rupp, M., Tkatchenko, A., Muller, K.R., and Von Lilienfeld, O. A. [Fast and accurate modeling of molecular atomization energies with machine learning](https://arxiv.org/abs/1109.2618). Physical review letters, 108(5): 058301, 2012.