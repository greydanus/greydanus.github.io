---
layout: page
title: Interesting Papers
permalink: /papers/
---
<body onload="start()">
<p>This is a fairly random set of papers that have caught my eye. Updated weekly. Filter by subject using buttons below.</p>

<center>
	<div class="showmore" id="showphysicspapers" style="display:inline-block;">Physics</div> 
	<div class="showmore" id="showvisionpapers" style="display:inline-block;">Vision</div>
	<div class="showmore" id="showgenerativepapers" style="display:inline-block;">Generative</div>
</center>

<div class="container">
  <div id="timeline">

  	 <div id="visionpapers" class="timelineitem">
      <div class="tdate">August 2016</div>
      <div class="ttitle"><a href="https://arxiv.org/abs/1603.05279">XNOR-Net: ImageNet Classification Using Binary Convolutional Neural Networks</a></div>
      <div class="tauthor">Mohammad Rastegari, Vicente Ordonez, Joseph Redmon, Ali Farhadi</div>
      <div class="taffiliation">Allen Institute for AI</div>
      <div class="tcontent">
      	<div class="timg_border"><img class="timage" src="/assets/papers/karman.png"></div>
      	<div class="tdesc">
      		This will be a readable abstract of the paper and comments about why it is useful. First of all, it should be about twice as readable and half as technical as the original abstract. Second of all, I should comment on each one about why I think it is useful/interesting. Each of these abstracts should contribute to a picture of the field as a whole. With a little thought, someone with my level of education (undergraduate, strong in sciences, some basic background knowledge of the field) should be able to grasp all the information here.
      	</div>
      </div>
    </div>

    <div id="physicspapers" class="timelineitem">
      <div class="tdate">July 2016</div>
      <div class="ttitle"><a href="https://arxiv.org/abs/1607.03597v2">Accelerating Eulerian Fluid Simulation With Convolutional Networks</a></div>
      <div class="tauthor">Jonathan Tompson, Kristofer Schlachter, Pablo Sprechmann, Ken Perlin</div>
      <div class="taffiliation">Google, NYU</div>
      <div class="tcontent">
      	<div class="timg_border"><img class="timage" src="/assets/papers/karman.png"></div>
      	<div class="tdesc">
      		This will be a readable abstract of the paper and comments about why it is useful. First of all, it should be about twice as readable and half as technical as the original abstract. Second of all, I should comment on each one about why I think it is useful/interesting. Each of these abstracts should contribute to a picture of the field as a whole. With a little thought, someone with my level of education (undergraduate, strong in sciences, some basic background knowledge of the field) should be able to grasp all the information here.
      	</div>
      </div>
    </div>

    <div id="generativepapers" class="timelineitem">
      <div class="tdate">June 2014</div>
      <div class="ttitle"><a href="https://arxiv.org/abs/1308.0850">Generating Sequences With Recurrent Neural Networks</a></div>
      <div class="tauthor">Alex Graves</div>
      <div class="taffiliation">U Toronto</div>
      <div class="tcontent">
      	<div class="timg_border"><img class="timage" src="/assets/papers/karman.png"></div>
      	<div class="tdesc">
      		This will be a readable abstract of the paper and comments about why it is useful. First of all, it should be about twice as readable and half as technical as the original abstract. Second of all, I should comment on each one about why I think it is useful/interesting. Each of these abstracts should contribute to a picture of the field as a whole. With a little thought, someone with my level of education (undergraduate, strong in sciences, some basic background knowledge of the field) should be able to grasp all the information here.
      	</div>
      </div>
    </div>

  </div>


<script>
function start() {
	var show_physics_papers = true;
  $("#showphysicspapers").click(function() {
    if(!show_physics_papers) {
      $('[id=physicspapers]').each(function() {
      	$('[id=physicspapers]').slideDown('fast', function() {
      		$("#showphysicspapers").css('border', '2px solid #777');
      	})
      });
      show_physics_papers = true;
    } else {
      $('[id=physicspapers]').each(function() {
      	$('[id=physicspapers]').slideUp('fast', function() {
      		$("#showphysicspapers").css('border', '2px solid #CCC');
      	})
      });
      show_physics_papers = false;
    }
  });

	var show_vision_papers = true;
  $("#showvisionpapers").click(function() {
    if(!show_vision_papers) {
      $('[id=visionpapers]').each(function() {
      	$('[id=visionpapers]').slideDown('fast', function() {
      		$("#showvisionpapers").css('border', '2px solid #777');
      	})
      });
      show_vision_papers = true;
    } else {
      $('[id=visionpapers]').each(function() {
      	$('[id=visionpapers]').slideUp('fast', function() {
      		$("#showvisionpapers").css('border', '2px solid #CCC');
      	})
      });
      show_vision_papers = false;
    }
  });

  	var show_generative_papers = true;
  $("#showgenerativepapers").click(function() {
    if(!show_generative_papers) {
      $('[id=generativepapers]').each(function() {
      	$('[id=generativepapers]').slideDown('fast', function() {
      		$("#showgenerativepapers").css('border', '2px solid #777');
      	})
      });
      show_generative_papers = true;
    } else {
      $('[id=generativepapers]').each(function() {
      	$('[id=generativepapers]').slideUp('fast', function() {
      		$("#showgenerativepapers").css('border', '2px solid #CCC');
      	})
      });
      show_generative_papers = false;
    }
  });

}

</script>