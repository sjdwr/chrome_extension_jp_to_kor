function sleep(delay)
{
   var start = new Date().getTime();
   while (new Date().getTime() < start + delay);
}

function genRand(e)  
{
	// e 길이의 랜덤 문자 생성
	for (var a = "", t = 0; t < e; t++)
		a += String.fromCharCode(Math.floor(80 * Math.random() + 43));
	return a;
}

function afterAdd(e)
{
	// 문자열을 반으로 나누는 알파 값을 구합니다.(※추정)
	var a, t, o;
	
	a = t = e.length;
	--t;
	
    for (; t >= 0; t--) 
	{
        o = e.charCodeAt(t);
		  
		if (o > 127 && o <= 2047)
		{
			a++;
		}
		else if (o > 2047 && o <= 65535)
		{
			a += 2;
		}
	}
	
	a %= 6;
	
	// json 뒤에 여분의 문자를 붙이는 작업을 합니다.
	
	t = "";
	
	if (a > 0)
		t = genRand(6).substr(0, 6 - a);
		
	return t;
}

function stringTokChange(e, a) 
{
	/*
		e 에 들어가 있는 문자열을 a 번째 기준으로 반으로 나누어서 두 문자열을 Swap 합니다.
		ex) stringTokChange("12345678", 2) => "23456781"
	*/

    return e.substr(a) + e.substr(0, a);
}

function encodeString(e)
{
	// base64 위해 유니코드 문자를 인코딩 합니다.(※추정)
	
	var t = "";
	
	for (var n = 0, r; n < e.length; n++) 
	{
		r = e.charCodeAt(n);
		
		if (r < 128)
		{
			t += String.fromCharCode(r);
		}
		else if (r < 2048)
		{
			t += String.fromCharCode(192 | r >> 6) + 
				 String.fromCharCode(128 | 63 & r);
		}
		else if (r < 55296 || r >= 57344)
		{
			t += String.fromCharCode(224 | r >> 12) + 
				 String.fromCharCode(128 | r >> 6 & 63) + 
				 String.fromCharCode(128 | 63 & r);
		}
		else
		{
			r = 65536 + (1023 & r) << 10 | 1023 & e.charCodeAt(++n);
			
			t += String.fromCharCode(240 | r >> 18) + 
				 String.fromCharCode(128 | r >> 12 & 63) + 
				 String.fromCharCode(128 | r >> 6 & 63) + 
				 String.fromCharCode(128 | 63 & r);
		}
	}
	
	return t;
}

function changeAlphabet(e) 
{
	/*
		changeAlphabet('n') 	=> 'a'
		changeAlphabet('a') 	=> 'n'
		changeAlphabet('b') 	=> 'o'
		changeAlphabet('abc') 	=> 'nop'
		
		changeAlphabet 함수는 a부터 m까지 해당문자 아스키코드에 13을 더하고 n부터 z까지는 13을 뺍니다.
		ex) a 의 아스키 코드 97
			함수 결과값: 97+13 = 110(n)
	*/
	
     return e.replace(/([a-m])|([n-z])/gi, 
		function(e, a, t) 
		{
			return String.fromCharCode(a ? a.charCodeAt(0) + 13 : t ? t.charCodeAt(0) - 13 : 0) || e
		}
	)
}

function getRequest(url)
{
	var xhr = new XMLHttpRequest();
	var JS = null;
	
	xhr.open("GET", url, false);	// synchronize
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() 
	{
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200 && xhr.responseText)
		{
			JS = JSON.parse(xhr.responseText);
			
			if ( JS.code )
				JS = null;
		}
	}

	xhr.send();

	return JS;
}

function PapagoTranslate(src, dst, e)
{
	var json = '{"deviceId":"61ec832f-0b2d-433e-b92f-1a9a7c4e8fc1","dict":true,"dictDisplay":30,"honorific":false,"instant":false,"paging":false,"source":"' + src + '","target":"' + dst + '","text":"' + e + '"}';
	
	json = json + afterAdd(json);
	json = encodeString(json);
	json = btoa(json);			// base64 인코딩
	
	var ac = genRand(1);
	json = ac + stringTokChange(json, ac.charCodeAt(0) % (json.length - 2) + 1);	// Obfuscation
	json = changeAlphabet(json);		// Obfuscation
	json = encodeURIComponent(json); 
	
	/* 
		php 소스 (php를 쓰는 이유는 CORS 를 우회하기 위해)
		
		<?php
		header('Access-Control-Allow-Origin: *');
		?>

		<?php
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL,"https://papago.naver.com/apis/n2mt/translate");
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/x-www-form-urlencoded',
		));

		curl_setopt($ch, CURLOPT_POSTFIELDS, "data=".$_GET['d']);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$server_output = curl_exec($ch);
		curl_close ($ch);

		echo $server_output;
		?>
	*/
	
	var JS = null;
	
	for (var i = 0; !(JS = getRequest('http://spspwl.dothome.co.kr/b.php?d=' + json)) && i < 3; ++i);
	
	if (!JS.translatedText)
		return null;
	
	return JS.translatedText;
}

function PapagoPhoneticCharacters(lan, e)
{
	var ew = false;
	
	if (lan != "ja")	// 일본어만 해당되는 함수 입니다.
		return e;
	
	for (var i = 0, ds; i < e.length; ++i)
	{
		ds = e.charCodeAt(i);
			
		if ((ds < 12352 || ds > 12447) && 	// hira
			(ds < 12448 || ds > 12543) &&	// kata
			(ds < 12784 || ds > 12799))		// kata extend
		{
			ew = true;
			break;
		}
	}
	
	if (!ew) 
		return e;

	var json = '{"query":"' + e + '","index":0,"srcLang":"ja","tlitLang":"ja"}';
	
	json = json + afterAdd(json);
	json = encodeString(json);
	json = btoa(json);			// base64 인코딩
	
	var ac = genRand(1);
	json = ac + stringTokChange(json, ac.charCodeAt(0) % (json.length - 2) + 1);	// Obfuscation
	json = changeAlphabet(json);		// Obfuscation
	json = encodeURIComponent(json); 

	var JS = null;
	
	for (var i = 0; !(JS = getRequest('http://spspwl.dothome.co.kr/a.php?d=' + json)) && i < 3; ++i);
		
	if (!JS.tlitList)
		return e;
	
	var rubyTag = "";
	//var Onsen = "";
	
	var phObj;
	var prv = 0;

	for (var i = 0; i < JS.tlitList.length; ++i)
	{
		phObj = JS.tlitList[i];
					
		if (prv != phObj.s)
		{
			rubyTag += e.substring(prv, phObj.s);
			//Onsen += e.substring(prv, phObj.s);
		}
					
		rubyTag += 
			"<ruby>" + 
				e.substring(phObj.s, phObj.e) + 
				"<rt>" + 
					phObj.p + 
				"</rt>" +
			"</ruby>";
						
		//Onsen += phObj.p;
		prv = phObj.e;
	}
	
	if (prv != e.length)
	{
		rubyTag += e.substring(prv, e.length);
		//Onsen += e.substring(prv, e.length);
	}
	
	return rubyTag;// + "%^@eryjdnxw32es^@%" + Onsen;
}

//contentjs에서 보낸 메시지를 여기서 받음.
//papagoTranslate를 하고 return값을 contentjs로 다시 보냄.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.origin === 'content') {
        console.log("background: "+ message.subject);
        var translate = PapagoTranslate(message.to, message.from, message.body);
		sleep(500);
		var phonetic = PapagoPhoneticCharacters(message.to, message.body);
        sendResponse({
            trans: translate,
			ph: phonetic,
        })
    } 
});