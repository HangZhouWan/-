// JavaScript Document
window.onload = function(){
	BtnHandle();
	
}

var Map = new Array();
var posList = [0,9,3];


function BtnHandle(){
	var btn = document.querySelector("button");
	btn.onclick = readyToStart;
}
//倒计时 结束之后清空屏幕，创造表格；
function readyToStart(){
	var counter = document.getElementById("counter").innerHTML.trim();
	var list = null;
	var timmer = setInterval(function(){
		counter --
		document.getElementById("counter").innerHTML = counter;
		if(counter == -1){
			clearInterval(timmer);
			document.body.innerHTML = "";
			renderTable();
			setInterval(posOut,500)
		}
	},1000);
	
}
//表格处理
function renderTable(){
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	var cellWidth = 100,cellHight = 200;
	var cols = Math.round((width-200)/cellWidth);
	var rows = Math.round((height-200)/cellHight);
	var tbody = document.createElement("tbody");
	var table = document.createElement("table");
	table.style.cssText = "margin-top:100px;border-spacing:10px;border:2px solid white";
	for(var i = 0;i<rows;i++){
		var tr = document.createElement("tr");
		tbody.appendChild(tr);
		for(var j = 0 ;j<cols;j++){
			var td = document.createElement("td");
			td.style.cssText = 'width:100px;height:200px;position:relative;overflow:hidden';
			tr.appendChild(td);
		}
	}
	table.appendChild(tbody);
	document.body.appendChild(table);
	// 为表格添加Id 
	(function tableID(){
		var td = table.getElementsByTagName("td"),len = td.length;
		for(var i = 0;i<len;i++){
			td[i].id = i;
			Map.push(i);
		}
	})();
}


function posOut(){
	var randomNum = Math.round(Math.random()*(Map.length-1));
	var condition = posList.indexOf(randomNum);
	if(condition==-1){
		posList.push(randomNum);
	}
	var pos = posList.shift();
	var td = document.getElementsByTagName("td");
	var hole = document.createElement("div");
	var cat = document.createElement("img");
	hole.style.cssText = "position:absolute;height:1px;width:10px; border-radius:100px/30px;bottom:0;background-color:black;"; 
	if(td[pos].firstChild==null){
		td[pos].appendChild(hole);
		hole.growUp = setInterval(holeGrowUp,15);
	}
	//猫洞产生
	function holeGrowUp(){
			var width = parseInt(hole.style.width);
			var height = parseInt(hole.style.height);
			width = width+3;
			height = height+1;
			hole.style.width = width+"px";
			hole.style.height = height+"px";
			if(width == 100){
				clearInterval(hole.growUp);
				creatCat();
			}
	}
	//猫洞结束调用猫猫上升函数
	function creatCat(){
		cat.style.cssText = "position:absolute;bottom:-80px;left:20px" 
		cat.src = "cat.png";
		td[pos].appendChild(cat);
		cat.grow = setInterval(growUpCat,2)
	}
	function growUpCat(){
		var bottom =parseInt(cat.style.bottom);
		bottom = bottom+1;
		cat.style.bottom = bottom+"px";
		if(bottom == 2){
			clearInterval(cat.grow);
			setTimeout(Interval,500);		
		}
	}
	//等待0.5s 执行猫猫下降函数
	function Interval(){
		cat.down = setInterval(catsDown,2);
	}
	function catsDown(){
		var bottom =parseInt(cat.style.bottom);
		bottom = bottom -1;
		cat.style.bottom = bottom+"px";
		if(bottom == -100){
			clearInterval(cat.down);
			hole.down = setInterval(holesDown,15);
		}
	}
	//猫猫隐藏，执行猫洞收缩函数
	function holesDown(){
		var width = parseInt(hole.style.width);
		var height = parseInt(hole.style.height);
			width = width-3;
			height = height-1;
			hole.style.width = width+"px";
			hole.style.height = height+"px";
			if(width ==1){
				clearInterval(hole.down);
				console.log(pos);
				td[pos].innerHTML = "";
				posList.splice(pos,1);
			}
	}
	
	
}


		


