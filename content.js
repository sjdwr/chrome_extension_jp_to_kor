//클릭 이벤트 리스너.
//드래그후 때면 선택된 텍스트가 이 프로그램으로 보내짐.
//selection - > 선택된 텍스트
//서버로 보내기위해 selection을 background.js로 보냄

var prevName = null;
var prevContents = null;

document.addEventListener("click", function (ev) 
{
	var selection = window.getSelection().toString(); //선택한 텍스트 뽑음
	var obj;

	if( prevName && (obj = document.getElementById(prevName)) )
	{
		if ( ev.toElement.offsetParent === obj ) 
			return;
		
		obj.parentNode.removeChild(obj); //div태그 삭제
	}

	if ( function(e) {
		// 일본어인지 검사
		var sp = 0;
		
		for (var i = 0; i < selection.length; ++i)
		{
			obj = selection.charCodeAt(i);
			
			if ( (obj >= 12352 && obj <= 12447) ||	// hira
				 (obj >= 12448 && obj <= 12543) ||	// kata
				 (obj >= 12784 && obj <= 12799) ||	// kata extend
				 (obj >= 11904 && obj <= 12031) ||	// hanja1
				 (obj >= 13312 && obj <= 19903) ||  // hanja2
				 (obj >= 19968 && obj <= 40895) ||  // hanja3
				 (obj >= 63744 && obj <= 64255)) 	// hanja4
				++sp;
		}
		
		return sp / selection.length;
	}(selection) < 0.5 )
		return;

	if( selection != '' && prevContents != selection )
	{
		prevContents = selection = selection.replace(/\n/g, "");	// 개행문자 제거
		
		var div = document.createElement("div"); //div태그 생성
		var tName = prevName = function(e) {
			for (var a = "", t = 0; t < e; t++)
				a += String.fromCharCode(Math.floor(80 * Math.random() + 43));
			return a;
		}(18);

		div.setAttribute("id", tName);	//div태그에 id 부여
		document.body.insertBefore(div, document.body.childNodes[0]); //html의 body 태그 첫번째child로 div태그 주입
		
		div.setAttribute("style","position:absolute;z-index:16000;top:"+(window.scrollY+ev.clientY+100)+"px;left:"+ev.clientX+"px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-right:-50%;padding:0;transform:translate(-50%,-50%);-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;background-color:#fff;-webkit-box-shadow:0 0 18px 3px rgba(0,0,0,.07);-moz-box-shadow:0 0 18px 3px rgba(0,0,0,.07);box-shadow:0 0 18px 3px rgba(0,0,0,.07);padding:10px");
		div.innerHTML = "<p>번역 중 입니다..</p>"; //생성한 div태그에 내용 주입

		chrome.runtime.sendMessage({	//body와 origin으로 구성된 메시지 backgroundjs로 보냄
			body: selection,
			origin: "content"
		}, function (response) 
		{ 
			if (null == response)
				div.innerHTML = "<p>서버와 통신이 끊겼습니다.</p>";
			else
			{
				var dd = response.body.split("%^@eryjdnxw32es^@%");
				var _Encode = encodeURIComponent(selection); // 번역주소와 읽는주소(tts)가 다르기 때문에 번역결과와 다른 음성이 나올 수 있습니다. 똑같이 하고싶으면 dd[2] 를 쓰고 아닐경우 selection을 쓰시오.
				
				div.innerHTML = 
				"<p>"+
					dd[0]+
				"</p>" + 
				"<br>" +
				"<p style='font-size:25px'>" + 
					dd[1] + "&nbsp;" + 
					"<audio id='sm'>" + 
						"<source src='https://ja.dict.naver.com/api/nvoice?speaker=yuri&service=dictionary&speech_fmt=mp3&text=" + _Encode + "'>" + 
					"</audio>" + 
					"<a href='javascript:document.getElementById(\"sm\").play()'>" + 
					(dd[2] != "" ? "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX%2F%2F%2F8REREAAAB4eHinp6dwcHCKiooODg4ICAjt7e3w8PD39%2Ff7%2B%2Fvi4uIGBgbOzs7W1taXl5dVVVXExMRBQUFPT0%2Bzs7O5ubmBgYFoaGiRkZGjo6PAwMAoKCgaGhrKyspISEhpaWkhISHc3NwzMzOFhYVgYGAnJydbW1s7OzswMDB0dHRrTpXwAAAKgElEQVR4nO1daVfjOgxtTaE7bYEp%2BzKUYWD4%2F%2F%2Fvsc7kXtmK49iJH8f3a5oc39qWZEmWBoOCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgpSYLhd9DyEldj%2FNK%2B5O23xjdjoarWINKDY2xoyHw%2BErx%2BB5nD6ad1zGHFc0%2FDTDT5g%2FgZ9YmY9vjM1J1KFFweLuL8FXimdB31i%2Br4GPL%2FyIPL7WmN5XCL4OcBbykZPqn3QQe4jtsDZAcGi2QR%2BBT1xFH2ULXP1bXp%2FD%2BxXwlQ0wHJtp9HEG45IJDs1ewGdeaB08Rx9oKPbMkBGDYdhCSIEjSTCM4YY%2FZLJQ%2FfM%2FFoJhDNf8pbHJwARcGhvBMIagLT4%2B8zP2eBvj1kxsBAMZLqXEOo494oYYiSG1Yjg4les08ogb4pd1hbZgKMWyeYk75GY4dxIMZjh4FhTXUcfcBAshF2IwnPK6n1xHHXWToQwVguEM5Vbs66y4NocKwRYMK8fMD4zNPOK4vXHqEqLtGS6EFb8fceC%2BEPZVGMPtkTE3LyxKbsU63SWgoINN5DCG6%2BGbX2dizDk92GcL%2FC4FCQ0%2Fagn6MFz%2FNYfEMUms09s0RByY%2Fa4n6MGwut1YrbM8PQz1bAVhZze1GzO8qH6GPRa8Srr0aBw7TO3GDG%2Bq32GNsCSGHap96a8IZDgjj8URPmaLt7NJPPNZoV4MeZbYOUf%2F5OFDMk6AJ1%2BCjedQrNMR%2FwNdiNP5gzfBpvvw7Y1z9XkXOnE59ifYVJa%2Bv4JuJ9YY6Q2blW5qN2YozM%2FJPf7gmiYxtXW69RSi3gwt5icek654EoNCId4Qa6o9QyGY2Xf4myZxk4jbO%2FjMFoXh4J6FDfq4aSeOh2m4vQFCgxEZ7sQ6xVjMEDdGOs8ihQbjMRTrlN66JLvnMQk9X1M7iOFgwsckmEQWt4ncGSI0GJOhkJf4Gs2xGaUgeBkwgf4M5TEJVAIZr4cpAoqW0GBUhsIAx%2Bg9iTizjE7QFhoMY7jevLxsLO5rcvmQTiSFEV0l2kODIQyXJx%2BJQCdiEviMQXsNhUDsM5QjNBjA8CsRaGhkVJfOumSd0i7Rkxd2m739Jnjx81d4MKzEImSChZhE%2BA9WxFDx8C%2FvTFOEaAkrw8dqIpDIdWKVgGFf1JjKKZEzelKjyhBnyXDm4pQnEfQ6LWJnYH%2FWakICUGWIAlFGdc81vU7ZC06P1GO3M4gMyeUiEtaYxB08xblxpQTybk4PhaE8yj6j9wCFEUrTyY2doYg6JkeV4YoZcmh%2BqwnMKy99wf9ieoAsFYEWGiWdITB7dk4M7SnWPTNk612YdBROw2WMtqnD4O2ZIXtcxE4kpxT6vzEa64hg9M2QE9bMBQ2Qlik4h9mssR6D%2B2bIniyhE%2Fc0lUkMre793hkK45PkBS9TOGbRRrSeoHpnODhQtbpYppfud0XUPxOGc55EUhhodKFXDTXieJwnQ2FBb7QR4kaceoiaDBjSMNmpRP4adMjQEral8mXAkKOrvEyJBUgidMhZr3LkwPBY933iEQrPHyRqWJnmwpBn6QmfomWHnoBtvTDNgiHLGny6UkQNPpvY0oeyYMjWFwoMPkJULdepwj4nhqpWHwzGisCkNy3qIg%2BGaJzyVYpHRWA%2BwNnElrOQB0MUGOyPwDg6WgSoaWy2dx4MWavjYiOBCZkXZ7UKMQ%2BGum2yUtQFHoJtju9MGB5pU4EzjOGLrWIOZMXwl7LVBgtFJeDpwvbtTBhu1YEqKoFWsMWoyYQhDZRSSjHLC1T%2BTtmjWTGkrUbhzhPwfMP5CV88tFQjyIQhWmac40RyqCppZ%2BpfkxFD3GpsX5LJUw2U4l9jc5lmyZBPF3u%2BDMeW6EwuDIcNGFZNs4W6vHNieIMMMZ5LDKtpesRw8u0ZWvyJuTAcf%2FtVqkqal28gaTTTU3jbqvrwf6MtZupUkFd053xxYklRzIQhmpfs9n7%2BBlYbOoXZY3rvtryp%2BBCZ7BkxxGFwaoxxqxI6lFjKgWTCkNwt6IyYK2IIs2UyPgHT%2BQjjwHS0%2Bu0ef8ZeDPK1odvzVtmkF9rkZ8SQ89cWyhjxfTJ3LElDeTDEUXCARXNTkaq0VI%2FKg%2BGTKi%2BOlHkiF44lYz8PhrRI1Yu%2FFJnBN3ONzHAQGGeC73ZXWfxfomv76jhvlaf4zHpzJguGtAzp0iuFJiChhsSs7bpsDgw5TZa2IQkayEY4U8RsRgxPdHFBMwyXKVVbKBuGrO5%2F6I8h20a1hbJhyFcOaJFS6VI4HHNk1UIwA4biFh4tUrJa4HyEJwt7knD%2FDHkK6Uov55rADJOgsRbh650h39rmZAO%2BZwjWwAMKGutV2d4Z0l3QCXs8cYrRIcrza63a2jdDUcWD58EoL7O1Z73b1TNDvnUuSsvyIoXrW5iZ6Ljt3DNDUViA8yePtGmibWivnszX3tOjylBOIakKTnMGDwYfOuzX8ziPPD2qDI%2FrpnCj6Qq2Zx01XLhOX3Iot%2FPk%2BY4LJsEUo5i1xfA%2FJ7HFreUQaDcsWZCysERrgB46%2Bwm0uXkeAvcqlRUCuXAC7DSm7y75NXtsepW7SVkolSFKGnGZYKcuYq617yT4iun24qABLrQywY0YgraQZiXdUaZwBp0b45aoaXM9Gs2Syd8vGZFlIE4dYJPyHdmQthkK3OW6GzKcTj6mYmwm4hovnzowOMgTHLvel7PkekOGbwv1HfKuuTh1gJxhdR%2B%2F%2BYxnLc96hoPF8Wh0bDGaqQQPnTrqFE0EhGoZ3wo8XJaO4kpU7yxJUbpZWI0aX4Z0B5pUBV9CsYS3YyCozpAnQ3GPHU1WlkKt2p0pqK9tHcqQC5LQwVFUPUnDb%2BBRnzyUIVd8JXc2Xx4Or%2FNei7oa84EM2blBUygK0qXsA1HTJyCM4VzUy0BBSps0cSnh6U2zlerDkEUY34TiKYxssTHUfh1BDIXziBwUtQfn6FB6roQwZEEpqhDwFHbQwOugAcV6hrJnDoa9harsos9cg1rC9QyFmEH%2FhBCk1mIR0eHqXxXAkBcpixleMF118fA2xJtXnUdlJ8yZRCaphG9d9lqGHG%2BhkyOLtS67PvkZ4vX78E%2FVhuBq5aI8WKd9V72KttYzBHXHu%2ByaC0t127jLp8eFh8avNHPhBBI29bvbhZ%2FwKJ7swXD6JbXGnAMkjYH41XVrUF8A28vyPjL2FtVcIL2Plla1%2FYL8znK7i6e7%2FRGnGrLBOk7cM8CBmkL0LU6ronuetSBNB9ADdi0YcgfE%2FtpYqg0hwhnK3iX9da%2FWDPFghqJjbq9N1pXGLKEMF8K277c799TZXCeUoWhal7YzST3mojFqO4bikN1tTzkrHEHGMIaiuU4fzR0F7EHGMIbc5ao3VYiwBhmDGMr%2BSB11W6uDzbcRxFDswn7laAUWQzyIoeg%2FmtgH3ACza%2FHvhzDkVg%2BpegMFQfSLCVFj6CJ1lV%2FvC5zZY83krQH637o%2F9tYAPA%2BB%2F3%2FVw5bRJvxCNcgY2HFy%2Fk9kuZog9Ir1P8dLaDv06f3H32TLvMkBs69OLy1awG3eP3AXso07we7i%2FPGs5Yl1uVr30i6%2BoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgwI3%2FACjCkuZCQA2tAAAAAElFTkSuQmCC' width=15 height=15>" : "") + 
					"</a>" + "&nbsp;" + 
					"<a href='https://papago.naver.com/?sk=ja&tk=ko&st=" + _Encode + "' target='_blank'>" + 
						"<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABfVBMVEX%2F%2F%2F8AAAAe2mkAof8Aof8Aof8Aof8Aof8Aof8Aof8e2mke2mke2mkAof8e2mke2mke2mke2mkAof8Aof8e2mke2mke2mkAof8Aof8e2mke2mkAof8Aof8e2mkAof8Aof8e2mkAof8e2mkAof8e2mke2mkAof8e2mkAof8e2mke2mkAof8e2mkAof8e2mn%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQBysY0Aof%2B3u0gAof8Aof%2F%2FxQCRtW4Aof8Aof%2F9xQLBvD4mptkAof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8e2mkusv5awv4Eov9ryP7a8fz5%2FPwaq%2F%2FF6f0Vqf%2FX8Pyz4v1Gu%2F74%2B%2Fvi5efw8%2FSo3v2EhY9QUF9XV2bJy88Cov%2Fu%2BPzR1Nd1doEXqv%2Fb3uCAgYwosP%2BrrLNhYm92d4Pg4uUSp%2F%2F%2FxQDg8%2FyS1%2F0psP%2F2%2B%2FyE0f0Dov8Bof6U1%2F3h8%2FwBof8Wqf8rZExGAAAAUHRSTlMAAADhu5B4Y19QRDELq%2F3Mex0v%2BvqbFlv87VEzx3MFum%2BIQ%2F3hCrR8I%2BsHeprk0J0S6lq4IfZ1BLU19pEN%2BfbiQvL1%2Fvs0bX3yXKAe5bVzGjDxGd8AAAFDSURBVDjLrdFXV8IwGAZg4hYVFRfiFvfeW3HgXonrc6JY99aogOu3m4ZC07Rwo%2B9Vct7nZNps%2F5DklNS09IzMSOz2rGykh4McLIQQ4sjNy0%2FSwoGzwAhYCouKBYBKXDIgpNQtAFRWbgKEVAigskqrNzZ1QKp1UMPbre0dAAE4aqPA6VH73T0AAyB19RpoUPv9A5ABaYyAJr7BIZhBcwsHrWp%2FBOA%2FPpEAcXPArxAA%2F6lydi6BNg7aWX9xCVeKolxLoIMDdYEbgFsG7iRAYuCene%2Fh8ek5LngBLbSzC8nfzW%2F5GgW0u8cSvMUApb19FuA9qAPaPzBoAjgkAEqHhk0gHBDACPaMjkkAh0NBDYxPfLC5d1IC7ByfXwxMTc%2FwmW%2FWBDD%2B%2FmHRxnPIAgiZRwnBwiJKBFxLyygu8K2srq0bX%2FKP%2BQVZUcjUrfaRgQAAAABJRU5ErkJggg%3D%3D' width=15 height=15>" + 
					"</a>" + 
				"</p>"; //생성한 div태그에 내용 주입
				
				var lass = div.getBoundingClientRect();
				
				if ( lass.x < 1 )
					div.style.left = (ev.clientX + -lass.x) + "px";
			}
		});
	}
	else prevContents = null;
});


