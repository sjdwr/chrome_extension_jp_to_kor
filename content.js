//클릭 이벤트 리스너.
//드래그후 때면 선택된 텍스트가 이 프로그램으로 보내짐.
//selection - > 선택된 텍스트
//서버로 보내기위해 selection을 background.js로 보냄

var prevName = null;
var prevContents = null;
var nowBlindName = null;
var ListBoxObject = null;
// var src_language = null; 
// var dst_language = null;

// window.onload = function()
// {
// 	chrome.storage.sync.get('srclangunage', function (r) {
// 		src_language = r['srclangunage'];
// 	});
	
// 	chrome.storage.sync.get('dstlangunage', function (r) {
// 		dst_language = r['dstlangunage'];
// 	});	
		
// 	if (src_language == null)
// 		src_language = "ko";
	
// 	if (dst_language == null)
// 		dst_language = "en";
// }

function generateRandomString(e) 
{
	var rs = '';
	var ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var chLen = ch.length;
	var i = 0;
   
	if ( e > 0 )
		i = (rs = ch.charAt(Math.floor(Math.random() * chLen - 10))) && 1;
   
	for ( ; i < e; ++i ) 
		rs += ch.charAt(Math.floor(Math.random() * chLen));
   
	return rs;
}

function getDst(){
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get('dstlangunage', r => {
			resolve(r.dstlangunage);
		});
	})
}

function getExecute(){
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get('execute', r => {
			resolve(r.execute);
		});
	})
}

function getLogging(){
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get('logging', r => {
			resolve(r.logging);
		});
	})
}
	
function getSrc(){
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get('srclangunage', r => {
			resolve(r.srclangunage);
		});
	})
}
	
async function getExecuteSync()
{
	return await getExecute();
}

window.onload = function()
{
	setTimeout(function()
	{
		if (!getExecuteSync())
			return;
		
		nowBlindName = generateRandomString(18);
		
		var hrdcode = 	// 번역 기록 모달 HTML 소스
		'<a href="#" class="cssLoader_ModalLayout" id="translaterecordopen" aria-hidden="true"></a>' +
		'<div class="cssLoader_ModalDialog">' +
		'	<div class="cssLoader_ModalHeader">' +
		'		<h2>번역 기록</h2>' +
		'		<a href="#" class="cssLoader_ModalButton_Close" aria-hidden="true">×</a>' +
		'	</div>' +
		'	<div class="cssLoader_ModalBody">' +
		'	</div>' +
		'	<div class="cssLoader_ModalFooter">' + 
		'		<a href="#" class="cssLoader_ModalButton">확인</a>' +
		'	</div>' +
		'</div>';

		var style = document.createElement("style");
		style.innerHTML = '.cssLoader_ModalButton{background:#428bca;border:darken(#428bca, 5%) solid 1px;border-radius:3px;color:#fff;display:inline-block;font-size:14px;padding:8px 15px;text-decoration:none;text-align:center;min-width:60px;position:relative;transition:color .1s ease}.cssLoader_ModalButton_Close{color:#aaa;font-size:30px;text-decoration:none;position:absolute;right:5px;top:0}.cssLoader_ModalButton_Close:hover{color:darken(#aaa,10%)}.cssLoader_ModalLayout:before{content:"";background:rgba(0,0,0,0);position:fixed;top:0;left:0;right:0;bottom:0;z-index:-1}.cssLoader_ModalLayout:target:before{-webkit-transition:-webkit-transform unquote("0.9s ease-out");-moz-transition:-moz-transform unquote("0.9s ease-out");-o-transition:-o-transform unquote("0.9s ease-out");transition:transform unquote("0.9s ease-out");z-index:100000000;background:rgba(0,0,0,.6)}.cssLoader_ModalLayout:target+.cssLoader_ModalDialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);top:20%}.cssLoader_ModalDialog{background:#fefefe;border:#333 solid 1px;border-radius:5px;margin-left:-200px;position:fixed;left:50%;top:-100%;z-index:100000001;width:360px;-webkit-transform:translate(0, -500%);-ms-transform:translate(0, -500%);transform:translate(0, -500%);-webkit-transition:-webkit-transform 0.3s ease-out;transition:transform 0.3s ease-out}.cssLoader_ModalDialog a{text-decoration:none;color:#fff}.cssLoader_ModalBody{padding:20px}.cssLoader_ModalHeader,.cssLoader_ModalFooter{padding:10px 20px}.cssLoader_ModalHeader{border-bottom:#eee solid 1px}.cssLoader_ModalHeader h2{font-size:20px}.cssLoader_ModalFooter{border-top:#eee solid 1px;text-align:right}'.replace(/cssLoader_Modal/g, nowBlindName); // 다음의 CSS 코드는 modal.css 를 압축시킨 코드 입니다.
		document.head.insertBefore(style, document.head.childNodes[0]);	// 모달 css를 웹 페이지 head 부분에 넣습니다.
		
		var sec = document.createElement("section"); 	//	section 생성
		sec.innerHTML = hrdcode.replace(/cssLoader_Modal/g, nowBlindName); // 태그 이름을 추적 불가능한 익명화에 가까운 작업을 합니다.
		document.body.insertBefore(sec, document.body.childNodes[0]);	// 모달 HTML 코드를 body 부분에 넣습니다.

		// 버그 발생해서 임시로 조치 (2020-07-04)
		setTimeout(
		function()
		{
			var ListBoxSpace = document.getElementsByClassName(nowBlindName + 'Body')[0];
			var Arguments = {							// ListBox Arguments
				Base: ListBoxSpace,
				Rows: 11,
				Width: 500,
				NormalItemColor: null,
				NormalItemBackColor: null,
				AlternateItemColor: null,
				AlternateItemBackColor: null,
				SelectedItemColor: null,
				SelectedIItemBackColor: null,
				HoverItemColor: null,
				HoverItemBackColor: null,
				HoverBorderdColor: null,
				ClickEventHandler: null//OnClick
			};
				
			ListBoxObject = new MakeRecordListBox(Arguments); 	// 디자인된 리스트 박스를 생성함.
		}, 500);
	}, 1000);
}

function putTranslateDB(str, transtr)
{
	// 임시 저장소에 번역을 기록함.
	
	var prd = window.localStorage;
	var _db = prd.getItem('jp_to_kor_65saveTranslate');
	var _dbs = [];
	
	if (_db)
		_dbs = _db.split('\n');
	else 
		_db = "";
	
	for (var i = 0; i < _dbs.length; i=i+2)
	{
		if (_dbs[i] == str)
			return;
	}
	
	prd.removeItem('jp_to_kor_65saveTranslate');
	prd.setItem('jp_to_kor_65saveTranslate', _db + str + '\n' + transtr + '\n');
}

function MakeRecordListBox(Arguments)
{
	//저작권 정보
	//MakeRecordListBox.js
	//Version: 1.0
	//This script is created by Samir Nigam. Do not remove, modify, or hide the author information. keep it intact.
	//Mail: nigam.samir@hotmail.com

    //Public property Version.
    this.Version = '1.0';
	
	//Local variables.
    var Ids = 0;
    var EventHandlers = new Array();
	
	var Base = Arguments.Base ? Arguments.Base : document.documentElement;
	var NormalItemColor = Arguments.NormalItemColor ? Arguments.NormalItemColor : 'Black';
	var NormalItemBackColor = Arguments.NormalItemBackColor ? Arguments.NormalItemBackColor : '#ffffff';
	var AlternateItemColor = Arguments.AlternateItemColor ? Arguments.AlternateItemColor : 'Black';
	var AlternateItemBackColor = Arguments.AlternateItemBackColor ? Arguments.AlternateItemBackColor : '#E0E0E0';
	var SelectedItemColor = Arguments.SelectedItemColor ? Arguments.SelectedItemColor : '#ffffff';
	var SelectedIItemBackColor = Arguments.SelectedIItemBackColor ? Arguments.SelectedIItemBackColor : '#E6A301';
	var HoverItemColor = Arguments.HoverItemColor ? Arguments.HoverItemColor : '#ffffff';
	var HoverItemBackColor = Arguments.HoverItemBackColor ? Arguments.HoverItemBackColor : '#2259D7';
	var HoverBorderdColor = Arguments.HoverBorderdColor ? Arguments.HoverBorderdColor : 'orange';
	var ClickEventHandler = Arguments.ClickEventHandler ? Arguments.ClickEventHandler : function(){ }; 
 
	//Create div for list box.
    var MakeRecordListBoxDiv = document.createElement('div');
	MakeRecordListBoxDiv.style.backgroundColor = '#ffffff';
    MakeRecordListBoxDiv.style.textAlign = 'left';
    MakeRecordListBoxDiv.style.verticalAlign = 'top';
    MakeRecordListBoxDiv.style.cursor = 'default';
    MakeRecordListBoxDiv.style.borderStyle = 'inset';
    MakeRecordListBoxDiv.style.overflow = 'auto';
    MakeRecordListBoxDiv.style.width = '100%';
	MakeRecordListBoxDiv.style.height = '200px';
	
    this.AddItem = function(_Text, _Value)
	{
        var Item = null;
		var CheckBox = null;        
        var Span = null;
		var Ptag = null;
		
        Item = document.createElement('div');        
        Item.style.backgroundColor = Ids % 2 == 0 ? NormalItemBackColor : AlternateItemBackColor;
        Item.style.color = Ids % 2 == 0 ? NormalItemColor : AlternateItemColor;
	    Item.style.fontWeight = 'normal';
	    Item.style.fontFamily = 'Verdana';
	    Item.style.fontSize = '10pt';
        Item.style.textAlign = 'left';
        Item.style.verticalAlign = 'middle'; 
        Item.style.cursor = 'default';
        Item.style.borderTop = Ids % 2 == 0 ? '1px solid ' + NormalItemBackColor : '1px solid ' + AlternateItemBackColor;
        Item.style.borderBottom = Ids % 2 == 0 ? '1px solid ' + NormalItemBackColor : '1px solid ' + AlternateItemBackColor;
        Item.style.overflow = 'hidden';
        Item.style.textOverflow = 'ellipsis';
		Item.style.height = '50px';
		Item.ItemIndex = Ids;
		
        CheckBox = document.createElement('input');
        CheckBox.type = 'checkbox';
        Item.appendChild(CheckBox);
			
        Span = document.createElement('span');
		Ptag = document.createElement('p');
		
        Span.innerHTML = _Text;   
        Span.title = _Text; 
		
		Ptag.innerHTML = _Value;   
        Ptag.title = _Value; 
		Ptag.setAttribute("style", "margin:0; padding:0; padding-top:3px; padding-left:5px;");
		
		Span.style.fontSize = '15pt';
		Ptag.style.fontSize = '9pt';
		
	    Item.appendChild(Span);
	    Item.appendChild(Ptag);
		
	    MakeRecordListBoxDiv.appendChild(Item);
		
	    //Register events.
	    WireUpEventHandler(Item, 'mouseover', function(){ OnMouseOver(CheckBox, Item); });
	    WireUpEventHandler(Item, 'mouseout', function(){ OnMouseOut(CheckBox, Item); });
	    WireUpEventHandler(Item, 'selectstart', function(){ return false; });
	    WireUpEventHandler(CheckBox, 'click', function(){ OnClick(CheckBox, Item); });
	    WireUpEventHandler(CheckBox, 'click', function(){ ClickEventHandler(CheckBox, { IsSelected: CheckBox.checked, Text: _Text, Value: _Value, ItemIndex: Item.ItemIndex }); });   
	    
	    //Ids++;
	}
	
    //Public method GetItems.
    this.GetItems = function()
	{
        var Items = new Array();
		
		var Divs = MakeRecordListBoxDiv.getElementsByTagName('div');
		
        for(var n = 0; n < Divs.length; ++n)    
			Items.push({IsSelected: Divs[n].childNodes[0].checked, Text: Divs[n].childNodes[1].innerHTML, Value: Divs[n].childNodes[1].value, ItemIndex: Divs[n].ItemIndex});  
       		
        return Items;
    }
	
    //Public method Dispose.
	this.Dispose = function()
	{
	    while(EventHandlers.length > 0)
	        DetachEventHandler(EventHandlers.pop());
			
	    Base.removeChild(MakeRecordListBoxDiv);
	}
	
	//Public method Contains.
	this.Contains = function(Index)
	{
		return typeof(Index) == 'number' && MakeRecordListBoxDiv.childNodes[Index] ? true : false;
	}
	
	//Public method GetItem.
	this.GetItem = function(Index)
	{	    
	    var Divs = MakeRecordListBoxDiv.getElementsByTagName('div');
		
	    return this.Contains(Index) ? { IsSelected: Divs[Index].childNodes[0].checked, Text: Divs[Index].childNodes[1].innerHTML, Value: Divs[Index].childNodes[1].value, ItemIndex: Index} : null;
	}
	
	//Public method DeleteItem.
	this.DeleteItem = function(Index)
	{
	    if(!this.Contains(Index)) return false;
	    
	    try
	    {
			MakeRecordListBoxDiv.removeChild(MakeRecordListBoxDiv.childNodes[Index]);
	    }
	    catch(err)
	    {
			return false;
	    }
	    
	    return true;
	}
	
	//Public method DeleteItems.
	this.DeleteItems = function()
	{
	    var ItemsRemoved = 0;
	    
	    for(var n = MakeRecordListBoxDiv.childNodes.length - 1; n >= 0; --n)   
	        try
	        {
				MakeRecordListBoxDiv.removeChild(MakeRecordListBoxDiv.childNodes[n]);
				ItemsRemoved++;
	        }
	        catch(err)
	        {
			    break;
	        }
	        
	   return ItemsRemoved;
	}
	
	//Public method GetTotalItems.
	this.GetTotalItems = function()
	{
	    return MakeRecordListBoxDiv.childNodes.length;
	}
	
    //Item mouseover event handler.
    var OnMouseOver = function(CheckBox, Item)
    {
        if(CheckBox.checked) return;
				
        Item.bgColor = Item.style.backgroundColor;
	    Item.fColor = Item.style.color;
	    Item.bColor = Item.style.borderTopColor;
        Item.style.backgroundColor = HoverItemBackColor;
		Item.style.color = HoverItemColor;
		Item.style.borderTopColor = Item.style.borderBottomColor = HoverBorderdColor;
		Item.style.fontWeight = 'bold';
    }
    
    //Item mouseout event handler.
    var OnMouseOut = function(CheckBox, Item)
    {
        if(CheckBox.checked) return;
				
		Item.style.backgroundColor = Item.bgColor;
	    Item.style.color = Item.fColor;
	    Item.style.borderTopColor = Item.style.borderBottomColor = Item.bColor;
		Item.style.fontWeight = 'normal';
    }
    
    //CheckBox click event handler.
	var OnClick = function(CheckBox, Item)
	{	
	    if(CheckBox.checked)
        {
			Item.style.backgroundColor = SelectedIItemBackColor;
			Item.style.color = SelectedItemColor;
			Item.style.borderTopColor = Item.style.borderBottomColor = SelectedIItemBackColor;
        }
        else
        {
            Item.style.backgroundColor = HoverItemBackColor;
		    Item.style.color = HoverItemColor;
			Item.style.borderTopColor = Item.style.borderBottomColor = HoverBorderdColor;
        }
	} 
	
    //Private anonymous method to wire up event handlers.
	var WireUpEventHandler = function(Target, Event, Listener)
	{
	    //Register event.
	    if(Target.addEventListener)	   
			Target.addEventListener(Event, Listener, false);	    
	    else if(Target.attachEvent)	   
			Target.attachEvent('on' + Event, Listener);
	    else 
	    {
			Event = 'on' + Event;
			Target.Event = Listener;	 
		}
		
	    //Collect event information through object literal.
	    var EVENT = { Target: Target, Event: Event, Listener: Listener }
	    EventHandlers.push(EVENT);
	}
	
	//Private anonymous  method to detach event handlers.
	var DetachEventHandler = function(EVENT)
	{
	    if(EVENT.Target.removeEventListener)	   
			EVENT.Target.removeEventListener(EVENT.Event, EVENT.Listener, false);	    
	    else if(EVENT.Target.detachEvent)	   
			EVENT.Target.detachEvent('on' + EVENT.Event, EVENT.Listener);
	    else 
		{
			EVENT.Event = 'on' + EVENT.Event;
			EVENT.Target.EVENT.Event = null;	 
	    }
	}
	 
	WireUpEventHandler(MakeRecordListBoxDiv, 'contextmenu', function(){ return false; });
    Base.appendChild(MakeRecordListBoxDiv);
}

document.addEventListener("click", async function (ev) 
{
	let src_language = await getSrc(); //src_language 긁어옴
	let dst_language = await getDst(); //dst_language 긁어옴
	let execute = await getExecute(); //execute 긁어옴
	let logging = await getLogging(); //logging 긁어옴
	
	var selection = window.getSelection().toString(); //선택한 텍스트 뽑음
	var obj;

	if ( prevName && (obj = document.getElementById(prevName)) )
	{
		if ( ev.toElement.offsetParent === obj ) // 번역 결과 팝업에서 드래그 이벤트가 일어났다면 중지한다.
			return;
		
		obj.parentNode.removeChild(obj); //div태그 삭제
	}
	
	var linkedList = ev.toElement;
	
	if (obj = document.getElementsByClassName(nowBlindName + "Dialog")[0])
	{
		// 드래그 할 시 부모를 좇아 번역 기록 창에서 드래그 한건지 알아내는 코드 입니다.
		while (linkedList = linkedList.offsetParent)
		{
			if (linkedList === obj)
				return;
		}
	}

	if (!execute || !selection)	// selection 내용이 null이거나 jp_to_kor 가 비활성화 되면 더 이상 실행시키지 않습니다.
		return;
	
	if ( function(e) 
	{
		// 유효성 검사 코드 입니다. 
		
		var sp = 0;
		
		switch (src_language)
		{
			case "ko":
			{
				// 한국어 유효성 검사
				for (var i = 0; i < selection.length; ++i)
				{
					obj = selection.charCodeAt(i);
					
					if ( (obj >= 4352 && obj <= 4607  ) ||	// hangul jamo
						 (obj >= 12592 && obj <= 12687) ||	// hangul compatibilty jamo
						 (obj >= 43360 && obj <= 43391) ||	// hangul jamo extended 1
						 (obj >= 44032 && obj <= 55215) ||	// hangul syllables
						 (obj >= 55216 && obj <= 55295)) 	// hangul jamo extended 2
						++sp;
				}
				
				break;
			}
			case "en":
			{
				// 영어 유효성 검사
				for (var i = 0; i < selection.length; ++i)
				{
					obj = selection.charCodeAt(i);
					
					if ( (obj >= 65 && obj <= 90) ||	// alphabet upper case
						 (obj >= 97 && obj <= 122) )	// alphabet lowcase
						++sp;
				}
				
				break;
			}
			case "ja":
			{
				// 일본어 유효성 검사
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
				
				break;
			}
		}
		
		return sp / selection.length;
	}(selection) < 0.5 )
		return;

	if( selection != '' && prevContents != selection )
	{
		prevContents = selection = selection.replace(/\n/g, "");	// 개행문자 제거

		var div = document.createElement("div"); //div태그 생성
		var tName = prevName = generateRandomString(18);

		div.setAttribute("id", tName);	//div태그에 id 부여
		document.body.insertBefore(div, document.body.childNodes[0]); //html의 body 태그 첫번째child로 div태그 주입
		
		div.setAttribute("style","position:absolute;z-index:16000;top:"+(window.scrollY+ev.clientY+100)+"px;left:"+ev.clientX+"px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-right:-50%;padding:0;transform:translate(-50%,-50%);-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;background-color:#fff;-webkit-box-shadow:0 0 18px 3px rgba(0,0,0,.07);-moz-box-shadow:0 0 18px 3px rgba(0,0,0,.07);box-shadow:0 0 18px 3px rgba(0,0,0,.07);padding:10px");
		div.innerHTML = "<p>번역 중 입니다..</p><div class='sjdwr_papago_jp_to_kor'></div>"; //생성한 div태그에 내용 주입

		chrome.runtime.sendMessage({	//body와 origin으로 구성된 메시지 backgroundjs로 보냄
			to: src_language,
			from: dst_language,
			body: selection,
			type: "translation"
		}, function (response) 
		{ 
			if (null == response)
				div.innerHTML = "<p>서버와 통신이 끊겼습니다.</p>";
			else
			{
				var _Encode = encodeURIComponent(response.trans); // 번역주소와 읽는주소(tts)가 다르기 때문에 번역결과와 다른 음성이 나올 수 있습니다. 똑같이 하고싶으면 dd[2] 를 쓰고 아닐경우 selection을 쓰시오.
				
				if (logging)	// 번역 기록 유무를 저장하는 변수
					putTranslateDB(selection, response.trans);	
				
				var _Sound;
				
				// 번역 언어에 따른 tts 주소 
				switch (dst_language)
				{
					case "ko":
					{
						_Sound = "https://ko.dict.naver.com/api/nvoice?speaker=kyuri&service=dictionary&speech_fmt=mp3&text=";
						break;
					}
					case "ja":
					{
						_Sound = "https://ja.dict.naver.com/api/nvoice?speaker=yuri&service=dictionary&speech_fmt=mp3&text=";
						break;
					}
					case "en":
					{
						_Sound = "https://en.dict.naver.com/api/nvoice?speaker=clara&service=dictionary&speech_fmt=mp3&text=";
						break;
					}
				}
				
				div.innerHTML = 
				"<p>"+
					(src_language == "ja" ? response.ph : response.origin) +
				"</p>" + 
				"<br>" +
				"<p style='font-size:25px'>" + 
					(dst_language == "ja" ? response.ph : response.trans) + "&nbsp;" + 
					"<audio id='sm'>" + 
						"<source src='" + _Sound + _Encode + "'>" + 
					"</audio>" + 
					"<a href='javascript:document.getElementById(\"sm\").play()'>" + 
					"<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX%2F%2F%2F8REREAAAB4eHinp6dwcHCKiooODg4ICAjt7e3w8PD39%2Ff7%2B%2Fvi4uIGBgbOzs7W1taXl5dVVVXExMRBQUFPT0%2Bzs7O5ubmBgYFoaGiRkZGjo6PAwMAoKCgaGhrKyspISEhpaWkhISHc3NwzMzOFhYVgYGAnJydbW1s7OzswMDB0dHRrTpXwAAAKgElEQVR4nO1daVfjOgxtTaE7bYEp%2BzKUYWD4%2F%2F%2Fvsc7kXtmK49iJH8f3a5oc39qWZEmWBoOCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgpSYLhd9DyEldj%2FNK%2B5O23xjdjoarWINKDY2xoyHw%2BErx%2BB5nD6ad1zGHFc0%2FDTDT5g%2FgZ9YmY9vjM1J1KFFweLuL8FXimdB31i%2Br4GPL%2FyIPL7WmN5XCL4OcBbykZPqn3QQe4jtsDZAcGi2QR%2BBT1xFH2ULXP1bXp%2FD%2BxXwlQ0wHJtp9HEG45IJDs1ewGdeaB08Rx9oKPbMkBGDYdhCSIEjSTCM4YY%2FZLJQ%2FfM%2FFoJhDNf8pbHJwARcGhvBMIagLT4%2B8zP2eBvj1kxsBAMZLqXEOo494oYYiSG1Yjg4les08ogb4pd1hbZgKMWyeYk75GY4dxIMZjh4FhTXUcfcBAshF2IwnPK6n1xHHXWToQwVguEM5Vbs66y4NocKwRYMK8fMD4zNPOK4vXHqEqLtGS6EFb8fceC%2BEPZVGMPtkTE3LyxKbsU63SWgoINN5DCG6%2BGbX2dizDk92GcL%2FC4FCQ0%2Fagn6MFz%2FNYfEMUms09s0RByY%2Fa4n6MGwut1YrbM8PQz1bAVhZze1GzO8qH6GPRa8Srr0aBw7TO3GDG%2Bq32GNsCSGHap96a8IZDgjj8URPmaLt7NJPPNZoV4MeZbYOUf%2F5OFDMk6AJ1%2BCjedQrNMR%2FwNdiNP5gzfBpvvw7Y1z9XkXOnE59ifYVJa%2Bv4JuJ9YY6Q2blW5qN2YozM%2FJPf7gmiYxtXW69RSi3gwt5icek654EoNCId4Qa6o9QyGY2Xf4myZxk4jbO%2FjMFoXh4J6FDfq4aSeOh2m4vQFCgxEZ7sQ6xVjMEDdGOs8ihQbjMRTrlN66JLvnMQk9X1M7iOFgwsckmEQWt4ncGSI0GJOhkJf4Gs2xGaUgeBkwgf4M5TEJVAIZr4cpAoqW0GBUhsIAx%2Bg9iTizjE7QFhoMY7jevLxsLO5rcvmQTiSFEV0l2kODIQyXJx%2BJQCdiEviMQXsNhUDsM5QjNBjA8CsRaGhkVJfOumSd0i7Rkxd2m739Jnjx81d4MKzEImSChZhE%2BA9WxFDx8C%2FvTFOEaAkrw8dqIpDIdWKVgGFf1JjKKZEzelKjyhBnyXDm4pQnEfQ6LWJnYH%2FWakICUGWIAlFGdc81vU7ZC06P1GO3M4gMyeUiEtaYxB08xblxpQTybk4PhaE8yj6j9wCFEUrTyY2doYg6JkeV4YoZcmh%2BqwnMKy99wf9ieoAsFYEWGiWdITB7dk4M7SnWPTNk612YdBROw2WMtqnD4O2ZIXtcxE4kpxT6vzEa64hg9M2QE9bMBQ2Qlik4h9mssR6D%2B2bIniyhE%2Fc0lUkMre793hkK45PkBS9TOGbRRrSeoHpnODhQtbpYppfud0XUPxOGc55EUhhodKFXDTXieJwnQ2FBb7QR4kaceoiaDBjSMNmpRP4adMjQEral8mXAkKOrvEyJBUgidMhZr3LkwPBY933iEQrPHyRqWJnmwpBn6QmfomWHnoBtvTDNgiHLGny6UkQNPpvY0oeyYMjWFwoMPkJULdepwj4nhqpWHwzGisCkNy3qIg%2BGaJzyVYpHRWA%2BwNnElrOQB0MUGOyPwDg6WgSoaWy2dx4MWavjYiOBCZkXZ7UKMQ%2BGum2yUtQFHoJtju9MGB5pU4EzjOGLrWIOZMXwl7LVBgtFJeDpwvbtTBhu1YEqKoFWsMWoyYQhDZRSSjHLC1T%2BTtmjWTGkrUbhzhPwfMP5CV88tFQjyIQhWmac40RyqCppZ%2BpfkxFD3GpsX5LJUw2U4l9jc5lmyZBPF3u%2BDMeW6EwuDIcNGFZNs4W6vHNieIMMMZ5LDKtpesRw8u0ZWvyJuTAcf%2FtVqkqal28gaTTTU3jbqvrwf6MtZupUkFd053xxYklRzIQhmpfs9n7%2BBlYbOoXZY3rvtryp%2BBCZ7BkxxGFwaoxxqxI6lFjKgWTCkNwt6IyYK2IIs2UyPgHT%2BQjjwHS0%2Bu0ef8ZeDPK1odvzVtmkF9rkZ8SQ89cWyhjxfTJ3LElDeTDEUXCARXNTkaq0VI%2FKg%2BGTKi%2BOlHkiF44lYz8PhrRI1Yu%2FFJnBN3ONzHAQGGeC73ZXWfxfomv76jhvlaf4zHpzJguGtAzp0iuFJiChhsSs7bpsDgw5TZa2IQkayEY4U8RsRgxPdHFBMwyXKVVbKBuGrO5%2F6I8h20a1hbJhyFcOaJFS6VI4HHNk1UIwA4biFh4tUrJa4HyEJwt7knD%2FDHkK6Uov55rADJOgsRbh650h39rmZAO%2BZwjWwAMKGutV2d4Z0l3QCXs8cYrRIcrza63a2jdDUcWD58EoL7O1Z73b1TNDvnUuSsvyIoXrW5iZ6Ljt3DNDUViA8yePtGmibWivnszX3tOjylBOIakKTnMGDwYfOuzX8ziPPD2qDI%2FrpnCj6Qq2Zx01XLhOX3Iot%2FPk%2BY4LJsEUo5i1xfA%2FJ7HFreUQaDcsWZCysERrgB46%2Bwm0uXkeAvcqlRUCuXAC7DSm7y75NXtsepW7SVkolSFKGnGZYKcuYq617yT4iun24qABLrQywY0YgraQZiXdUaZwBp0b45aoaXM9Gs2Syd8vGZFlIE4dYJPyHdmQthkK3OW6GzKcTj6mYmwm4hovnzowOMgTHLvel7PkekOGbwv1HfKuuTh1gJxhdR%2B%2F%2BYxnLc96hoPF8Wh0bDGaqQQPnTrqFE0EhGoZ3wo8XJaO4kpU7yxJUbpZWI0aX4Z0B5pUBV9CsYS3YyCozpAnQ3GPHU1WlkKt2p0pqK9tHcqQC5LQwVFUPUnDb%2BBRnzyUIVd8JXc2Xx4Or%2FNei7oa84EM2blBUygK0qXsA1HTJyCM4VzUy0BBSps0cSnh6U2zlerDkEUY34TiKYxssTHUfh1BDIXziBwUtQfn6FB6roQwZEEpqhDwFHbQwOugAcV6hrJnDoa9harsos9cg1rC9QyFmEH%2FhBCk1mIR0eHqXxXAkBcpixleMF118fA2xJtXnUdlJ8yZRCaphG9d9lqGHG%2BhkyOLtS67PvkZ4vX78E%2FVhuBq5aI8WKd9V72KttYzBHXHu%2ByaC0t127jLp8eFh8avNHPhBBI29bvbhZ%2FwKJ7swXD6JbXGnAMkjYH41XVrUF8A28vyPjL2FtVcIL2Plla1%2FYL8znK7i6e7%2FRGnGrLBOk7cM8CBmkL0LU6ronuetSBNB9ADdi0YcgfE%2FtpYqg0hwhnK3iX9da%2FWDPFghqJjbq9N1pXGLKEMF8K277c799TZXCeUoWhal7YzST3mojFqO4bikN1tTzkrHEHGMIaiuU4fzR0F7EHGMIbc5ao3VYiwBhmDGMr%2BSB11W6uDzbcRxFDswn7laAUWQzyIoeg%2FmtgH3ACza%2FHvhzDkVg%2BpegMFQfSLCVFj6CJ1lV%2FvC5zZY83krQH637o%2F9tYAPA%2BB%2F3%2FVw5bRJvxCNcgY2HFy%2Fk9kuZog9Ir1P8dLaDv06f3H32TLvMkBs69OLy1awG3eP3AXso07we7i%2FPGs5Yl1uVr30i6%2BoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgwI3%2FACjCkuZCQA2tAAAAAElFTkSuQmCC' width=15 height=15>" + 
					"</a>" + "&nbsp;" + 
					"<a href='https://papago.naver.com/?sk=" + src_language + "&tk=" + dst_language + "&st=" + selection + "' target='_blank'>" + 
						"<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABfVBMVEX%2F%2F%2F8AAAAe2mkAof8Aof8Aof8Aof8Aof8Aof8Aof8e2mke2mke2mkAof8e2mke2mke2mke2mkAof8Aof8e2mke2mke2mkAof8Aof8e2mke2mkAof8Aof8e2mkAof8Aof8e2mkAof8e2mkAof8e2mke2mkAof8e2mkAof8e2mke2mkAof8e2mkAof8e2mn%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQD%2FxQBysY0Aof%2B3u0gAof8Aof%2F%2FxQCRtW4Aof8Aof%2F9xQLBvD4mptkAof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8Aof8e2mkusv5awv4Eov9ryP7a8fz5%2FPwaq%2F%2FF6f0Vqf%2FX8Pyz4v1Gu%2F74%2B%2Fvi5efw8%2FSo3v2EhY9QUF9XV2bJy88Cov%2Fu%2BPzR1Nd1doEXqv%2Fb3uCAgYwosP%2BrrLNhYm92d4Pg4uUSp%2F%2F%2FxQDg8%2FyS1%2F0psP%2F2%2B%2FyE0f0Dov8Bof6U1%2F3h8%2FwBof8Wqf8rZExGAAAAUHRSTlMAAADhu5B4Y19QRDELq%2F3Mex0v%2BvqbFlv87VEzx3MFum%2BIQ%2F3hCrR8I%2BsHeprk0J0S6lq4IfZ1BLU19pEN%2BfbiQvL1%2Fvs0bX3yXKAe5bVzGjDxGd8AAAFDSURBVDjLrdFXV8IwGAZg4hYVFRfiFvfeW3HgXonrc6JY99aogOu3m4ZC07Rwo%2B9Vct7nZNps%2F5DklNS09IzMSOz2rGykh4McLIQQ4sjNy0%2FSwoGzwAhYCouKBYBKXDIgpNQtAFRWbgKEVAigskqrNzZ1QKp1UMPbre0dAAE4aqPA6VH73T0AAyB19RpoUPv9A5ABaYyAJr7BIZhBcwsHrWp%2FBOA%2FPpEAcXPArxAA%2F6lydi6BNg7aWX9xCVeKolxLoIMDdYEbgFsG7iRAYuCene%2Fh8ek5LngBLbSzC8nfzW%2F5GgW0u8cSvMUApb19FuA9qAPaPzBoAjgkAEqHhk0gHBDACPaMjkkAh0NBDYxPfLC5d1IC7ByfXwxMTc%2FwmW%2FWBDD%2B%2FmHRxnPIAgiZRwnBwiJKBFxLyygu8K2srq0bX%2FKP%2BQVZUcjUrfaRgQAAAABJRU5ErkJggg%3D%3D' width=15 height=15>" + 
					"</a>" + 
				"</p>"; //생성한 div태그에 내용 주입
				
				var lass = div.getBoundingClientRect();
				
				if ( lass.x < 1 )
					div.style.left = (ev.clientX + -lass.x) + "px";	// 번역결과 팝업창이 왼쪽 화면 밖을 벗어날 경우, 벗어난 만큼 오른쪽으로 이동
			}
		});
	}
	else prevContents = null;
});

chrome.runtime.onMessage.addListener((message, sender) => 
{
	switch (message.type)
	{
		case "opentransRecord":
		{
			// 번역 기록 모달 창을 여는 메세지 입니다.
			console.log("opentransRecord");

			if (!ListBoxObject)	// 정상적으로 모달 창 안의 리스트 박스 객체가 없으면 무효화 시킵니다.
				return;

			ListBoxObject.DeleteItems();	// 매 번 실행할 때 마다 리스트 박스 안의 내용을 지웁니다.
			
			var storageStr = window.localStorage.getItem('jp_to_kor_65saveTranslate');	// 임시 저장소에서 저장된 번역 기록을 가져옵니다.
			var db = [];
			
			if (ListBoxObject && storageStr && (db = storageStr.split('\n')))
			{
				for (var i = db.length - 2; i > 0; i = i - 2)
					ListBoxObject.AddItem(db[i - 1], db[i]);	// 내림차순으로 리스트 박스에 원문과 뜻을 추가시킵니다.
			}

			document.location.href = '#translaterecordopen';	// 링크 뒤에 해당 문자를 넣음으로써 css가 인지하고 모달창을 visible 합니다.
			break;
		}
		case "deletesaveTranslate":
		{
			// 이것은 번역기록을 담고 있는 임시저장소 안의 데이터를 삭제시키는 메세지 입니다.
			window.localStorage.removeItem('jp_to_kor_65saveTranslate'); // extension이 사용하는 것만 삭제한다.
			break;
		}
	}
});