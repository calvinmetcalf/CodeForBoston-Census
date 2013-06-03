var mapmargin = 50;

	$('#map').css("height", ($(window).height() - mapmargin));
	$(window).on("resize", resize);
	resize();
	function resize(){
		
		if($(window).width()>=980){
            $('#map').css("height", ($(window).height() - mapmargin));    
			$('#map').css("margin-top",50);
		}else{
            $('#map').css("height", ($(window).height() - (mapmargin+12)));    
			$('#map').css("margin-top",-21);
		}

	}

