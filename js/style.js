var mapmargin = 50;

	$('#map').css("height", ($(window).height() - mapmargin));
	$(window).on("resize", resize);
	resize();
	function resize(){
		$('#map').css("height", ($(window).height() - mapmargin));	
		if($(window).width()>=980){
			$('#map').css("margin-top",50);
		}else{
			$('#map').css("margin-top",-20);
		}

	}
	if($(window).width()>=980){
		$('#map').css("margin-top",50);
	}else{
		$('#map').css("margin-top",-20);
	}
