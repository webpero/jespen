/****************************** For alle sider ******************************/
function pageInit()
{
}

/********************** FORSIDE: Karusell og velkomstmelding *****************/
function placeWelcome()
{
	// Setter størrelse og plassering av velkommen-melding etter container for karusellen
	$("#velkommen").css("max-width", (parseInt($("#slider").css("width"))-58) + "px" );
	$("#velkommen").css("top", "30px" );
	$("#velkommen").css("left", ((parseInt($("#slider").css("width")) - parseInt($("#velkommen").css("width"))) / 2)+15 + "px" );
	
	if ( parseInt($(".slick-slide").css("height")) >= 350 )
	{
		//Tre kolonner: Sett høyde på spillesliten til den samme som karusellen
		$("#music-container").css( "height", $("#slider").css("height") );
	}
}
function sliderInit()
{
	$('#slider').slick({
		adaptiveHeight: true,
		dots: true,
		infinite: true,
		speed: 250,
		autoplay: true,
		autoplaySpeed: 30000,
	});
}

/******************************* SISTE PÅ JESPENPOP **************************/
function sisteInit()
{
	//Håndtering av klikk på valg for visning i siste-listen
	$("input[name='valg-siste']").click( function() {
		//Sett filtrering basert på valg
		if ( $(this).val() === "alle" ) {
			if ( $(this).prop("checked") ) {
				//Velg alle kategorier
				$("input[name='valg-siste']").prop("checked", true);
				$("#liste-publisert .dato-liste tr:not(.ny-dato)").removeClass('skjul');
			}
			else
			{
				//Velg bort alle kategorier
				$("input[name='valg-siste']").prop("checked", false);
				$("#liste-publisert .dato-liste tr:not(.ny-dato)").addClass('skjul');
			}
		} 
		else 
		{	
			// Velg/velg bort aktuell kategori
			$("." + $(this).val()).toggleClass("skjul");
			
			if ( !$(this).prop("checked") ) {
				$("#alle").prop( "checked", false );
			}
	
		}
	});
}

/******************************* MUSIKK **************************/
function stopPlaying(list)
{
	//Stopper både audio og video og setter alle ikoner tilbake til normaltilstand
	$(list).find("span").removeClass("glyphicon-stop");
	$(list + " .playing .play-video").addClass("glyphicon-play");
	$(list + " .playing .play-audio").addClass("glyphicon-volume-up");
	$(list).removeClass('active playing');
	$("#video-player")[0].pause();
	$("#audio-player")[0].pause();
}
function playInit()
{
	let videoOK = videoInit();
	let audioOK = audioInit();
	let selection = ".musikk-liste li";
	
	// Legg til play-knapper for audio og video på slutten av hver linje i spillelistene (og hold disse samlet)
	if( videoOK || audioOK )
	{
		$(selection).prepend(
			"<span class='nowrap'>" +
			( videoOK ? "<span class='play-video glyphicon glyphicon-play' aria-hidden='true'></span>" : "" ) +
			( audioOK ? "<span class='play-audio glyphicon glyphicon-volume-up' aria-hidden='true'></span>": "" ) +
			"</span>"
		);
	}
	
	if( videoOK )
	{
		//Klikk på element i musikk-liste: Video
		$(selection + " .play-video").on( 'click', function() {
			var el = $(this).closest("li");
			var txt = $(el).text();
			if ( $(el).hasClass('playing') )
			{
				//Bruker har klikket på låt som spilles av nå: sett på pause
				stopPlaying(selection);
			}
			else
			{
				//Bruker har klikket på en ny låt: stopp enhver avspilling og nullstill ikoner 
				stopPlaying(selection);
				
				//Skjul audio og vis video
				$("#audio-container").hide();
				if ( $("#video-container").length ) {
					$("#video-container").show();
				}
				if ( $("#video-window").length ) {
					$("#video-window").show();
					/*$("#video-window")[0].scrollIntoView();*/
					window.location.href = "#video-window";
				}			
				
				//Sett videonavn 
				$("#sound-name").text(txt);

				//Start avspilling av ny video */
				$("#video-player > source").attr("src",$(el).data("vid"));
				$("#video-player")[0].load();
				$("#video-player")[0].play();

				//Sett status til avspilling
				$(el).addClass('playing');
				$(this).addClass("glyphicon-stop");
			}
			// Sett denne linjen til aktiv
			$(el).addClass('active');
		});
		//Lukk av videospiller i vindu
		$("#video-window button.lukk").click( function() {
			stopPlaying(selection);
			$("#video-window").hide();
		});
		$("#video-player").on('ended', function() {
			stopPlaying(selection);
			if ( $("#video-window").length ) {
				$("#video-window").hide();
			}
		});
	}

	if( audioOK )
	{	
		//Klikk på element i musikk-liste: Audio
		$(selection + " .play-audio").on( 'click', function() {
			var el = $(this).closest("li");
			var txt = $(el).text();
			if ( $(el).hasClass('playing') )
			{
				//Bruker har klikket på låt som spilles av nå: sett på pause
				stopPlaying(selection);
			}
			else
			{
				//Bruker har klikket på en ny låt: stopp enhver avspilling og nullstill ikoner 
				stopPlaying(selection);
				
				//Skjul video og vis audio
				if ( $("#video-container").length ) {
					$("#video-container").hide();
				}
				if ( $("#video-window").length ) {
					$("#video-window").hide();
				}
				$("#audio-container").show();
				
				//Sett audio-navn
				$("#sound-name").text(txt);

				//Start avspilling av ny låt
				$("#audio-player").attr("src",$(el).data("src"));
				$("#audio-player")[0].play();

				//Sett status til avspilling
				$(el).addClass('playing');
				$(this).addClass("glyphicon-stop");		
			}
			// Sett denne linjen til aktiv
			$(el).addClass('active');
		});
	
		//Legg til endring av status når en lydfil eller video er ferdig
		$("#audio-player").on('ended', function() {
			stopPlaying(selection);
		});
	}
}

function videoInit()
{
	var vid = $("#video-player")[0];
	if ( window.HTMLVideoElement && vid !== undefined && vid !== null )	{
		return true;
	} else {
		$("#sound-name").text("--Ingen støtte for video--");
		return false;
	}
}
function audioInit()
{
	var audio = $("#audio-player")[0];
	//Sjekk etter støtte for lydavspilling
	if ( window.HTMLAudioElement && audio !== undefined && audio !== null )	{
		return true;
	} else {
		$("#sound-name").text("--Ingen støtte for audio--");
		return false;
	} 
}

/******************************* FANBLOGG **************************/
function bloggInit()
{
	$('#bloggModal').on('show.bs.modal', function (ev) {
		var source = $(ev.relatedTarget) 	
		var modal = $(this);
		modal.find('.modal-title').text(source.find(".blogginfo").text());
		modal.find('img').attr("src",source.find("img").attr("src"));
		modal.find('.modal-body .blogginnlegg').text(source.find(".blogginnlegg").text());
	});
}

/******************************* BILDER **************************/
function bilderInit()
{
	$('#bildeModal').on('show.bs.modal', function (ev) {
		var source = $(ev.relatedTarget) 	
		var modal = $(this);
		modal.find('.modal-title').text(source.attr("title"));
		modal.find('img').attr("src",source.find("img").attr("src"));
		modal.find('.modal-body .bildetekst').text(source.parent().find(".bildetekst").text());
	});
}

/******************************* NYHETER **************************/
function nyheterInit()
{
	// Håndtering av modaldialog for visning av hele nyhetsmeldingen
	$('#nyheterModal').on('show.bs.modal', function (ev) {
		var source = $(ev.relatedTarget) 
		var modal = $(this);
		modal.find('.modal-title').text(source.find("h3").text());
		modal.find('img').attr("src",source.find("img").attr("src"));
		modal.find('.modal-body .nyhet').text(source.find(".nyhet").text());
	});
	// Vise at det er mer å lese når nyheten er lenger enn det er plass til å vise
	$('#liste-nyheter .nyhet').each( function() {
		if ( $(this)[0].scrollHeight > $(this).innerHeight() ) {
			$(this).parent().append("<p class='lesmer-bg'><span class='lesmer'>Les mer...</span></p>");
		}
	});
	// Håndtere hover for les mer
	$('#liste-nyheter article').hover( 
		function() {
			$(this).find(".lesmer-bg").css("background", "rgba(255,255,255,0)" );
		}, 
		function() {
			$(this).find(".lesmer-bg").css("background", "linear-gradient( to right, rgba(255,255,255,0.5), rgba(255,255,255,1)");
	});
}

/******************************* BUTIKK **************************/
function butikkInit()
{
	//Klær er standard-valg i butikken
	$("#butikk .klar").addClass('vis');
	
	//Håndtering av klikk på menyvalg for butikken
	$("#butikk-nav li").on( 'click', function() {
		var selection = "#butikk ." + $(this).data('class');
		//Sett valgt menyvalg til aktivt
		$("#butikk-nav li").removeClass('active');
		$(this).addClass('active');
		//Fjern filtrering i listen og sett på nytt etter brukers valg
		$("#butikk li").removeClass('vis');
		$(selection).addClass("vis");
		//Vis undervalg for klær
		if( $(this).data('class') === 'klar' ) {
			$("#butikk-klar-nav").show();
			$("input:radio[name='klar-kategori'][value='alle']").click();	//Alle er default
		} else {
			$("#butikk-klar-nav").hide();
		}
	});
	//Vise at menyen er klikkbar
	$("#butikk-nav li").hover( function() {
		$(this).css('cursor','pointer');
	});
	//Håndtering av klikk på undervalg for klær
	$("#butikk-klar-nav input#alle").next().css("font-weight","bold");
	$("input[name='klar-kategori']").change( function() {
		//Sett aktiv i menyen
		$("input[name='klar-kategori']").next().css("font-weight","normal");
		$(this).next().css("font-weight","bold");
		//Sett filtrering basert på valg
		if ( $("input[name='klar-kategori']:checked").val() === "alle" ) {
			$("#butikk .klar").addClass('vis');
		} else {
			var selection = "#butikk ." + $("input[name='klar-kategori']:checked").val();
			$("#butikk .klar").removeClass('vis');
			$(selection).addClass("vis");
		}
	});
}