function ajax(json){
	var xhr = new XMLHttpRequest();
	xhr.open(json.type,json.url,true);
	xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
	xhr.send(json.data);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				json.success(xhr.responseText);
			}
		}
	}	
}