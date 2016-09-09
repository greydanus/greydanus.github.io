---
layout: page
title: Interesting Papers
permalink: /papers/
---
<body onload="start()">
<p>A fairly random set of papers that caught my eye. Updated weekly. Filter by subject using buttons below, click for details</p>

<center>
	<div class="showmore" id="showphysicspapers" style="display:inline-block;">Physics</div> 
  <div class="showmore" id="showneuropapers" style="display:inline-block;">Neuroscience</div>
  <div class="showmore" id="showmiscpapers" style="display:inline-block;">Misc</div>
	<div class="showmore" id="showpredictivepapers" style="display:inline-block;">Predictive DL</div>
  <div class="showmore" id="showgenerativepapers" style="display:inline-block;">Generative DL</div>
  <div class="showmore" id="showalgpapers" style="display:inline-block;">Algorithmic DL</div>
  <div class="showmore" id="showtheorypapers" style="display:inline-block;">DL Theory</div>
</center>

<div class="container">
  <div id="timeline">

    <div class="tyear">2016</div>

  	 <div id="predictivepapers" class="timelineitem">
      <div class="tdate">August 2016</div>
      <div id="ttitle" onClick="showDetails('xor_net')">
        XNOR-Net: ImageNet Classification Using Binary Convolutional Neural Networks</div>
      <div id="xor_net" style="display:none;">
        <div class="tauthor">Mohammad Rastegari, Vicente Ordonez, Joseph Redmon, Ali Farhadi</div>
        <div class="taffiliation">Allen Institute for AI</div>
        <div class="tcontent">
          <a href="https://arxiv.org/abs/1603.05279">
            <div class="timg_border"><img class="timage" src="/assets/papers/xor_net.png"></div>
          </a>
        </div>
        	<div class="tdesc">
            <p>
              Approximating parameters in deep networks with binary weights leads to 32x memory savings so there is a lot of interest in binarization. In this paper, researchers binarized a vision model and approximated convolutions with binary add and subtract operations, obtaining a 58x speedup for convolutions. Classification accuracy only dropped 2.9% on AlexNet. The paper's main idea was to train a set of scalar parameters with gradient descent as usual and then convert them to binary representations using the sign function during forward passes.</p>
            <p>
              One of the major drawbacks of running deep vision models on phones and personal computers is computation time. This paper is a big step towards solving this problem. Researchers might be able extend this work to other deep architectures (recurrent nets, for example) that are used for NLP/translation.</p>
        	</div>
        </div>
      </div>

     <div id="physicspapers" class="timelineitem">
      <div class="tdate">July 2016</div>
      <div id="ttitle" onClick="showDetails('eulerian_fluids')">
        Accelerating Eulerian Fluid Simulation With Convolutional Networks</div>
      <div id="eulerian_fluids" style="display:none;">
        <div class="tauthor">Jonathan Tompson, Kristofer Schlachter, Pablo Sprechmann, Ken Perlin</div>
        <div class="taffiliation">Google, NYU</div>
        <div class="tcontent">
          <a href="https://arxiv.org/abs/1607.03597v2">
            <div class="timg_border"><img class="timage" src="/assets/papers/eulerian_fluids.png"></div>
          </a>
        </div>
          <div class="tdesc">
            <p>
            Simulating fluit and smoke with physics-based methods requires a lot of compute time. In this paper, researchers trained a 3D ConvNet to approximate the mapping from geometry, pressure, and velocity to pressure in the next step of the simulation and used it to speed up the process.</p>
            <p>
              This paper is exciting for two reasons: 1) it's a really impressive example of training a 3D generative model with a ConvNet and 2) it captures the more general idea that deep learning can approximate arbitrarily complex functions from physics. They could just as easily have modeled a raindrop, a charged plasma, or an evolving quantum system. </p>
          </div>
        </div>
      </div>

    <div id="theorypapers" class="timelineitem">
      <div class="tdate">May 2016</div>
      <div id="ttitle" onClick="showDetails('kenji_minima')">
        Deep Learning without Poor Local Minima</div>
      <div id="kenji_minima" style="display:none;">
        <div class="tauthor">Kenji Kawaguchi</div>
        <div class="taffiliation">MIT</div>
        <div class="tcontent">
          <a href="https://arxiv.org/abs/1605.07110">
            <div class="timg_border"><img class="timage" src="/assets/papers/kenji_minima.png"></div>
          </a>
        </div>
          <div class="tdesc">
            <p>
              Really important theoretical result for deep learning. Oral presentation at NIPS 2016.
            </p>
          </div>
        </div>
      </div>

    <div id="neuropapers" class="timelineitem">
      <div class="tdate">April 2016</div>
      <div id="ttitle" onClick="showDetails('semantic_map')">
        Natural speech reveals the semantic maps that tile human cerebral cortex</div>
      <div id="semantic_map" style="display:none;">
        <div class="tauthor">Alexander G. Huth, Wendy A. de Heer, Thomas L. Griffiths,  Frédéric E. Theunissen, Jack L. Gallant</div>
        <div class="taffiliation">Berkeley</div>
        <div class="tcontent">
          <a href="http://gallantlab.org/index.php/publications/natural-speech-reveals-the-semantic-maps-that-tile-human-cerebral-cortex/">
            <div class="timg_border"><img class="timage" src="/assets/papers/semantic_map.png"></div>
          </a>
        </div>
          <div class="tdesc">
            <p>
              The Gallant lab is awesome. In this study, subjects listened to podcasts while their brain activity was recorded in an fMRI. Researchers then built a model to predict brain activations from transcripts of the podcasts. They found that the model was able to predict brain activity well in many areas of the cortex. To create the semantic map, they reduced the coefficients of the generative model with PCA and somehow mapped regions of the cortex to words that most consistently generated a response.</p>
            <p>
              Definitely check out the interactive 3D 'atlas' they <a href="http://gallantlab.org/huth2016/">released</a>. The result is interesting because it is one of the most detailed analyses of language in the brain and a really cool glimpse at how the brain organizes information about the world. I also like the paper because it represents a new wave of neuro research aimed at extracting more detailed/precise patterns from data using ML techniques.
            </p>
          </div>
        </div>
      </div>

    <div class="tyear">2015</div>

    <div id="miscpapers" class="timelineitem">
      <div class="tdate">May 2016</div>
      <div id="ttitle" onClick="showDetails('twin_heritability')">
        Meta-analysis of the heritability of human traits based on fifty years of twin studies</div>
      <div id="twin_heritability" style="display:none;">
        <div class="tauthor">Tinca J C Polderman, Beben Benyamin, Christiaan A de Leeuw,  Patrick F Sullivan, Arjen van Bochoven, Peter M Visscher, Danielle Posthuma</div>
        <div class="taffiliation">Large collaboration, mostly Dutch</div>
        <div class="tcontent">
          <a href="http://www.nature.com/ng/journal/v47/n7/full/ng.3285.html">
            <div class="timg_border"><img class="timage" src="/assets/papers/twin_heritability.png"></div>
          </a>
        </div>
          <div class="tdesc">
            <p>
              Very precise findings. Nature vs nurture?</p>
          </div>
        </div>
      </div>

    <div class="tyear">2014</div>

    <div id="algpapers" class="timelineitem">
      <div class="tdate">October 2014</div>
      <div id="ttitle" onClick="showDetails('graves_turing')">
        Neural Turing Machines</div>
      <div id="graves_turing" style="display:none;">
        <div class="tauthor">Alex Graves, Greg Wayne, Ivo Danihelka</div>
        <div class="taffiliation">Google DeepMind</div>
        <div class="tcontent">
          <a href="https://arxiv.org/abs/1410.5401">
            <div class="timg_border"><img class="timage" src="/assets/papers/placeholder.png"></div>
          </a>
        </div>
          <div class="tdesc">
            <p>
              Summary goes here
            </p>
          </div>
        </div>
      </div>

    <div id="generativepapers" class="timelineitem">
      <div class="tdate">June 2014</div>
      <div id="ttitle" onClick="showDetails('graves_handwriting')">
        Generating Sequences With Recurrent Neural Networks</div>
      <div id="graves_handwriting" style="display:none;">
        <div class="tauthor">Alex Graves</div>
        <div class="taffiliation">U Toronto</div>
        <div class="tcontent">
          <a href="https://arxiv.org/abs/1308.0850">
            <div class="timg_border"><img class="timage" src="/assets/papers/graves_handwriting.png"></div>
          </a>
        </div>
          <div class="tdesc">
            <p>
              Recurrent neural networks excel at generating complex sequences and this is one of the first major papers to explore their full potential. Graves found that LSTMs can generate text one character at a time and even handwriting one pen coordinate at a time. A note of interest is that Graves trained his models with adaptive weight noise, a form of regularization that is not very common and which I want to learn more about.</p>
            <p>
              The paper is significant because 1) it showcases the huge potential of RNNs and 2) it is one of the first good examples of the Lego Effect (see my <a href="https://greydanus.github.io/2016/08/21/handwriting/">blog post</a> inspired by this paper)
            </p>
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

    var show_neuro_papers = true;
  $("#showneuropapers").click(function() {
    if(!show_neuro_papers) {
      $('[id=neuropapers]').each(function() {
        $('[id=neuropapers]').slideDown('fast', function() {
          $("#showneuropapers").css('border', '2px solid #777');
        })
      });
      show_neuro_papers = true;
    } else {
      $('[id=neuropapers]').each(function() {
        $('[id=neuropapers]').slideUp('fast', function() {
          $("#showneuropapers").css('border', '2px solid #CCC');
        })
      });
      show_neuro_papers = false;
    }
  });

    var show_misc_papers = true;
  $("#showmiscpapers").click(function() {
    if(!show_misc_papers) {
      $('[id=miscpapers]').each(function() {
        $('[id=miscpapers]').slideDown('fast', function() {
          $("#showmiscpapers").css('border', '2px solid #777');
        })
      });
      show_misc_papers = true;
    } else {
      $('[id=miscpapers]').each(function() {
        $('[id=miscpapers]').slideUp('fast', function() {
          $("#showmiscpapers").css('border', '2px solid #CCC');
        })
      });
      show_misc_papers = false;
    }
  });

	var show_predictive_papers = true;
  $("#showpredictivepapers").click(function() {
    if(!show_predictive_papers) {
      $('[id=predictivepapers]').each(function() {
      	$('[id=predictivepapers]').slideDown('fast', function() {
      		$("#showpredictivepapers").css('border', '2px solid #777');
      	})
      });
      show_predictive_papers = true;
    } else {
      $('[id=predictivepapers]').each(function() {
      	$('[id=predictivepapers]').slideUp('fast', function() {
      		$("#showpredictivepapers").css('border', '2px solid #CCC');
      	})
      });
      show_predictive_papers = false;
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

    var show_alg_papers = true;
  $("#showalgpapers").click(function() {
    if(!show_alg_papers) {
      $('[id=algpapers]').each(function() {
        $('[id=algpapers]').slideDown('fast', function() {
          $("#showalgpapers").css('border', '2px solid #777');
        })
      });
      show_alg_papers = true;
    } else {
      $('[id=algpapers]').each(function() {
        $('[id=algpapers]').slideUp('fast', function() {
          $("#showalgpapers").css('border', '2px solid #CCC');
        })
      });
      show_alg_papers = false;
    }
  });

    var show_theory_papers = true;
  $("#showtheorypapers").click(function() {
    if(!show_theory_papers) {
      $('[id=theorypapers]').each(function() {
        $('[id=theorypapers]').slideDown('fast', function() {
          $("#showtheorypapers").css('border', '2px solid #777');
        })
      });
      show_theory_papers = true;
    } else {
      $('[id=theorypapers]').each(function() {
        $('[id=theorypapers]').slideUp('fast', function() {
          $("#showtheorypapers").css('border', '2px solid #CCC');
        })
      });
      show_theory_papers = false;
    }
  });

}

</script>

<script type="text/javascript">

function showDetails(name) {
    $('#' + name).toggle(); 
}

// $(function(){
//   $('#ttitle').click(function(){
//      $('#xor_details').toggle(); 
//   });
// });
</script>