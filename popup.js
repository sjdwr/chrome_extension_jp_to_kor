document.addEventListener('DOMContentLoaded', ()=>
{
	var src_ctrl = document.getElementById('src_language');  
	var dst_ctrl = document.getElementById('dst_language');  
	var op_excute_ctrl = document.getElementById('op_excute');  
	var alert_tag = document.getElementById('alert');  
	
	chrome.storage.sync.get('execute', function (r) {
		op_excute_ctrl.checked = r['execute'];
	});
	
	chrome.storage.sync.get('srclangunage', function (r) {
		src_ctrl.value = r['srclangunage'];
	});
	
	chrome.storage.sync.get('dstlangunage', function (r) {
		dst_ctrl.value = r['dstlangunage'];
	});		
	
	if (src_ctrl.value == dst_ctrl.value)
	{	
		src_ctrl.selectedIndex = 0;
		dst_ctrl.selectedIndex = 1;
	}
	
	// 옵션
	op_excute_ctrl.addEventListener("change", function(e)
	{
		chrome.storage.sync.set({'execute': op_excute_ctrl.checked});
	});
	
	// 번역할 언어 콤보박스 리스너
	src_ctrl.addEventListener("change", function(e)
	{
		alert_tag.innerHTML = "페이지를 새로고침 하십시오";
			
		if (src_ctrl.value == dst_ctrl.value)
		{
			src_ctrl.selectedIndex = dst_ctrl.selectedIndex;
			chrome.storage.local.get('tmp_src', function (r) {
				dst_ctrl.selectedIndex = r['tmp_src'];
				chrome.storage.sync.set({'dstlangunage': dst_ctrl.value});
			});
		}
		
		chrome.storage.local.set({'tmp_src': src_ctrl.selectedIndex});
		chrome.storage.sync.set({'srclangunage': src_ctrl.value});
	});
	
	// 번역결과 언어 콤보박스 리스너
	dst_ctrl.addEventListener("change", function(e)
	{
		alert_tag.innerHTML = "페이지를 새로고침 하십시오";
		
		if (dst_ctrl.value == src_ctrl.value)
		{
			dst_ctrl.selectedIndex = src_ctrl.selectedIndex;
			chrome.storage.local.get('tmp_dst', function (r) {
				src_ctrl.selectedIndex = r['tmp_dst'];
				chrome.storage.sync.set({'srclangunage': src_ctrl.value});
			});
		}
		
		chrome.storage.local.set({'tmp_dst': dst_ctrl.selectedIndex});
		chrome.storage.sync.set({'dstlangunage': dst_ctrl.value});
	});
});
