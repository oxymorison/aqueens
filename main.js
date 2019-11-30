jQuery(document).ready(function ($) {
    var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    var safari = /safari/.test(navigator.userAgent.toLowerCase());
    var ff = /firefox/.test(navigator.userAgent.toLowerCase());
    if ((navigator.userAgent.indexOf('Windows') != -1)) {
        (chrome > 0) ? document.body.id = 'CrmWin' : false;
        (ff > 0) ? document.body.id = 'FfWin' : false;
    }
    (navigator.userAgent.indexOf('Macintosh') != -1) ? document.body.id = 'osx' : false;

	var val1 = 0;
	var posi = 0;	
	var site = 'milfshomealone';

	$('#join_now').css('cursor','pointer').click(function(e) { e.preventDefault(); $('#join_form').submit(); });

	$('#password').keypress(function (e) { if (e.which == 13) { e.preventDefault(); $("#pass_button").click(); } }); 
	$('#name').keypress(function (e) { if (e.which == 13) { e.preventDefault(); $("#name_button").click(); } }); 
	$('#email').keypress(function (e) { if (e.which == 13) { e.preventDefault(); $("#email_button").click(); } });

	$('#join_form').submit( function() {	

		var err_msg = '';
		var this_val = $('#zip').val();	

		if (!this_val) { err_msg += "Please enter a zipcode"; }		
		
	});

	$('.register .search').click( function(){
		this_val = $(this).parent().children('p').children('input').val();
		this_id = $(this).parent().children('p').children('input').attr('id');
		err_msg = '';

		//console.log(this_val+' | '+this_id);

		if (this_id == '') {

			if (!this_val) { err_msg += "Please enter a username\n";
			} else {
				handle_error = checkLength( this_val, "Username must be between 4-15 characters\n", 4, 15 );
				handle_error += checkRegexp ( this_val, /^[a-z]([0-9a-z_])+$/i, "Username must start with a letter and only allows a-z & 0-9\n" );
				handle_error += checkDigits ( this_val, "The name can contain no more than 4 numbers\n" );
				if (handle_error) { err_msg += handle_error; }	else  { err_msg += checkHandle( this_val ); if (err_msg == 'inuse') return false; }
			}

		} else if (this_id == '') {

			if (!this_val) { err_msg += "Please enter a password\n"; 
			} else {			
				err_msg += checkLength( this_val, "Password must be between 4-15 characters\n", 4, 15 );		
				err_msg += checkRegexp( this_val, /^([0-9a-zA-Z])+$/, "Password can only contain characters a-z & 0-9\n" );
			}

		} else if (this_id == '') {

			//if (!this_val) { err_msg += "Please enter a valid email address\n"; 
			//} else { err_msg += checkEmail( this_val ); } 

			sFlag = 0;
			$('#email').mailcheck({		    
				suggested: function(element, suggestion) {
				  if (confirm('did you mean '+suggestion.full+'?')) { $('#email').val(suggestion.full); } 
				  else { alert("That email domain is not accepted, we recommend gmail.com\n"); sFlag = 1; }
				}
			});
			if (sFlag) return false;
			
			if (!this_val) { err_msg += "Please enter a valid email address\n"; 
			} else { err_msg += checkEmail( this_val ); } 		

			if (err_msg) { alert(err_msg); return false; }
			
		} else if (this_id == 'zip') {

		}


		if (err_msg) { alert(err_msg); return false; }
		
		$('#leftCont div:visible').fadeOut().next().fadeIn();
		$(this).parent().fadeOut();
		$(this).parent().next().fadeIn('', function(){ $(this).find('.login_input').focus(); });
		//posi =$(this).parent().index()
		//posi = posi+1 
		//$('#mainSteps li span').removeClass('cur');
		//$('#mainSteps li.step'+posi+' span').addClass('cur');

		//$('#leftCont div:visible').fadeOut().next().fadeIn();
		//$(this).parent().fadeOut();
		//$(this).parent().next().fadeIn();
		posi =$(this).parent().index(); 
		posi = posi+2; 

		console.log(posi);
		
		$('#mainSlideNav li, #tmbSlide li ').removeClass('cur');
		$("#mainSlideNav li.nv"+posi+" , #tmbSlide li:eq("+(posi-1)+")").addClass('cur');

		return false


		//$(this).parent().parent().fadeOut();
		//$(this).parent().parent().next().fadeIn('', function(){ $(this).find('.login_input').focus(); });
		//return false	
	});


	function checkLength( o, n, min, max ) {
		if ( o.length > max || o.length < min ) { return n
		} else return '';
	}

	function checkRegexp( o, regexp, n ) {
		if ( !( regexp.test( o ) ) ) { return n
		} else return '';
	}

	function checkDigits( o, n ) {
		var resp = o.match(/\d/g);
		if (!resp) return ''; // console.log(resp);
		var len = resp.length; // console.log(len);
		if (len && (len > 4)) { return n;
		} else return '';
	}

	function checkEmail (o) {
		var resp = $.ajax({ url:'', type: "POST", async:false, data:'e='+o+"&s="+site }).responseText;
		resp = $.trim(resp);
		if (resp == 'aol') {
			return "That email domain is not accepted, we recommend gmail.com\n";
		} else if (resp == 'bad') {
			return "Unable to verify that address, please retry\n";
		} else if (resp == 'inuse')	{
			return "That email address is already in use\n";
		} else return "";
	}

	function checkHandle(o) {

		if(typeof(o) == "object") o = o.val();

		resp = $.ajax({ url:'scripts/uv.php?'+'h='+o+"&s="+site, type: "POST", async:false}).responseText;
		var response = '';

		hCheck = $.parseJSON(resp);
		if (hCheck.status == 'good') return '';

		var namepos = $('#name').position(); 
		var name_w = $('#name').outerWidth();
		var name_h = $('#name').outerHeight();
		$('#suggestions').css({
			top: (namepos.top+name_h-3)+"px", 
			left: namepos.left+"px",
			width: (name_w-2)+"px"
		});

		$('#suggestions').html('');
		hCheckString = hCheck.sugg.toString();
		hCheckArray = hCheckString.split(",");
		for(var i=0;i<hCheckArray.length;i++) { response += "<li class='ac_even'>"+hCheckArray[i]+"</li>"  }
		response = '<ul><li style="cursor:default;"><b>That username is in use, may we suggest one of these?</b></li><li class="ac_odd" >No thanks, I will try something else</li>'+response+'</ul>'
		$('#suggestions').html(response).slideDown().attr('tabindex','-1').focus();
		$('#suggestions').bind('blur click',function(e){ $('#suggestions').hide(); $('#suggestions').unbind('blur click'); });			


		return 'inuse';
		
	}

	$('#suggestions .ac_odd,#suggestions  .ac_even').live('mouseover',function() { $(this).addClass('ac_over'); }).live('mouseout',function() { $(this).removeClass('ac_over'); });
	$('#suggestions .ac_odd').live('click', function() { $('#name').val('').focus(); $('#suggestions').hide(); });
	$('#suggestions .ac_even').live('click', function() { $('#name').val($(this).text()); $('#suggestions').hide(); });


});

function thanks_redir(addr) {
	window.location.href = addr;
}

function post_pop(error) {
	error = error.replace(/(@@)/gm, "\n");
	alert(error);
	return false;
} 