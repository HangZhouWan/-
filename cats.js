// JavaScript Document
window.onload = function(){
	init();
	
}
// 解决事件绑定兼容性问题
var EventUtil = {
	addHandler : function(elem,type,handler){
		if(elem.addEventListener){
			elem.addEventListener(type,handler,false);
		}
		else if(elem.attachEvent){
			elem.attachEvent("on"+type,handler);
		}
		else{
			elem["on"+type] = null;
		}
	},
	removeHandler : function(elem,type,handler){
		if(elem.removeEventListener){
			elem.removeEventListener(type,handler,false);
		}
		else if(elem.detachEvent){
			elem.detachEvent("on"+type,handler);
		}
		else{
			elem["on"+type] = null;
		}
	}
}
		

var Map = new Array();   //随机数组来源（表格ID组成的数组）
var posList = [0,9,3];  //初始化随机数组
var countTime = null; //计算随机数intervalID
var gameTime = null;  //计算游戏时间intervalID
var readyTime = null;
var rotateBtnCW = null;
var rotateBtnACW = null;  //计算倒计时intervalID

//创建Btn对象
var Btn = {
	closeBtn : document.getElementById("closeBtn"),
	CW: function(){
		degree = parseInt(closeBtn.style.transform.replace(/[^0-9]/ig,"")),
	    degree += 1;
	    closeBtn.style.transform = "rotate("+degree+"deg)";
	    if(degree%180 == 0){
		    clearInterval(rotateBtnCW);
	     }
      },
	 ACW : function(){
		 degree = parseInt(closeBtn.style.transform.replace(/[^0-9]/ig,""));
		 if(degree == 0){
			  closeBtn.style.transform = "rotate("+180+"deg)";
		 }
		 degree -=1;
		 console.log(degree); 
		 closeBtn.style.transform = "rotate("+degree+"deg)";
		 if(degree%180 ==0 ){
			clearInterval(rotateBtnACW);
		 }
	 },
	 turnRight: function(){
		 clearInterval(rotateBtnCW);
		 clearInterval(rotateBtnACW);
		 rotateBtnCW = setInterval(Btn.CW,1);
	 },
	 turnLeft : function(){
		 clearInterval(rotateBtnCW);
		 rotateBtnACW = setInterval(Btn.ACW,1);
	 }		 
}


function init(){
	var btn = document.querySelector("button");
	EventUtil.addHandler(btn,"click",readyToStart);
	var closeBtn = document.getElementById("closeBtn");
	EventUtil.addHandler(closeBtn,"click",closeGame);
	closeBtn.style.transform = "rotate(0deg)";
	EventUtil.addHandler(closeBtn,"mouseover",Btn.turnRight);
	//EventUtil.addHandler(closeBtn,"mouseover",Btn.turnLeft);
	
}
//倒计时 结束之后清空屏幕，创造表格；
function readyToStart(){
	var counter = document.getElementById("counter").innerHTML.trim();
	var list = null;
	readyTime = setInterval(function(){
		counter --
		document.getElementById("counter").innerHTML = counter;
		if(counter == -1){
			clearInterval(readyTime);
			document.getElementById("container").innerHTML = "";
			var progress = document.createElement("div");
			renderTable();
			countTime = setInterval(posOut,400); //产生随机数 绘制猫猫
			gameTime = setInterval(gameProgress,200); //游戏计时
		}
	},1000);
	
}
//表格绘制，并将表格id加入Map数组
function renderTable(){
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	console.log(width,height);
	var cellWidth = 100,cellHeight = 100;
	var cols = Math.round((width-200)/cellWidth);
	var rows = Math.round((height-200)/cellHeight);
	var tbody = document.createElement("tbody");
	var table = document.createElement("table");
	for(var i = 0;i<rows;i++){
		var tr = document.createElement("tr");
		tbody.appendChild(tr);
		for(var j = 0 ;j<cols;j++){
			var td = document.createElement("td");
			td.style.cssText = 'width:'+cellWidth+'px;height:'+cellHeight+'px;position:relative;overflow:hidden';
			tr.appendChild(td);
		}
	}
	table.appendChild(tbody);
	document.getElementById("container").appendChild(table);
	// 为表格单元格添加Id 
	(function tableID(){
		var td = table.getElementsByTagName("td"),len = td.length;
		for(var i = 0;i<len;i++){
			td[i].id = i;
			Map.push(i);
		}
	})();
}

//随机计算产生猫猫的td单元格Id
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
	hole.style.cssText = "position:absolute;height:1px;width:10px; border-radius:100px/30px;bottom:0;background-color:black;opacity:0.1;";
	//数组去重 
	if(td[pos].firstChild==null){
		td[pos].appendChild(hole);
		hole.growUp = setInterval(holeGrowUp,10);
	}
	//猫洞产生
	function holeGrowUp(){
			var width = parseInt(hole.style.width);
			var height = parseInt(hole.style.height);
			var opacity = parseFloat(hole.style.opacity);
			width = width+3;
			height = height+1;
			opacity = (opacity*100 + 3)/100;
			hole.style.opacity = opacity;
			hole.style.width = width+"px";
			hole.style.height = height+"px";
			console.log(opacity);
			if(width == 100){
				clearInterval(hole.growUp);
				creatCat();
			}
	}
	//猫洞结束调用猫猫上升函数
	function creatCat(){
		cat.style.cssText = "position:absolute;bottom:-80px;left:20px;cursor:pointer;" 
		cat.src = "cat.png";
		td[pos].appendChild(cat);
		var flag = false;
		EventUtil.addHandler(cat,"click",catWait);//点击之后 猫猫下降；
		EventUtil.addHandler(cat,"click",win);// 绑定中奖函数；
		cat.grow = setInterval(growUpCat,2)
	}
	function growUpCat(){
		var bottom =parseInt(cat.style.bottom);
		bottom = bottom+1;
		cat.style.bottom = bottom+"px";
		if(bottom == 2){
			clearInterval(cat.grow);
			setTimeout(catWait,500);		
		}
	}
	//等待0.5s 执行猫猫下降函数
	function catWait(){
		clearInterval(cat.grow);
		if(cat.down){
			clearInterval(cat.down);
		}
		cat.down = setInterval(catsDown,2);
	}
	function catsDown(){
		var bottom =parseInt(cat.style.bottom);
		bottom = bottom -1;
		cat.style.bottom = bottom+"px";
		if(bottom == -100){
			clearInterval(cat.down);
			hole.down = setInterval(holesDown,10);
		}
	}
	//猫猫隐藏，执行猫洞收缩函数
	function holesDown(){
		var opacity = parseFloat(hole.style.opacity);
		var width = parseInt(hole.style.width);
		var height = parseInt(hole.style.height);
			width = width-3;
			height = height-1;
			opacity = (opacity*100 - 3)/100
			hole.style.width = width+"px";
			hole.style.height = height+"px";
			hole.style.opacity = opacity;
			if(width ==1){
				clearInterval(hole.down);
				td[pos].innerHTML = "";
				posList.splice(pos,1);
			}
	}
	//中奖函数 产生随机数1~100 若小于等于10，则中奖，绘制红包
	function win(){
		EventUtil.removeHandler(cat,"click",win); //移除绑定点击事件，每个猫猫只能点击一次；
		var rand = Math.round(Math.random()*100);
		if(rand<10){
			clearInterval(gameTime);
			clearInterval(countTime);
			var posX = (document.documentElement.clientWidth/2)-35;
			var posY = document.documentElement.clientHeight/2;
			var Coupon = document.createElement("img");
			Coupon.src = "Coupon.png";
			Coupon.style.cssText = "position:absolute;top:"+posY+"px;left:"+posX+"px;height:70px;width:70px;cursor:pointer;";
			document.body.appendChild(Coupon);
			function openCoupon(){
				Coupon.removeEventListener("click",openCoupon,false);
				Coupon.grow = setInterval(CouponCome,5)
			}
			var CouponWidth = parseInt(Coupon.style.width);
			var CouponHeight = parseInt(Coupon.style.height);
			var left = parseInt(Coupon.style.left);
			function CouponCome(){
				left = left - 1;
				CouponWidth = CouponWidth+2;
				CouponHeight = CouponHeight+2;
				Coupon.style.width = CouponWidth+"px";
				Coupon.style.height = CouponHeight+"px";
				Coupon.style.left = left+"px";
				if(CouponWidth==150){
					console.log("中奖了！");
	                clearInterval(Coupon.grow);
				} 
			}
			EventUtil.addHandler(Coupon,"click",openCoupon);//红包点击打开
			
		}
			
    }

	
}
//游戏时间控制和进度条显示
function gameProgress(){
	var time = parseInt(document.getElementsByClassName("progress-bar")[0].style.width);
	time = time-1 ;
	document.getElementsByClassName("progress-bar")[0].innerHTML = time;
	document.getElementsByClassName("progress-bar")[0].style.width = time+"%";
	if(time == 0){
		clearInterval(countTime);
		clearInterval(gameTime);
		console.log("很遗憾，没中奖");
	}
}


//游戏关闭按钮
function closeGame(){
	clearInterval(readyTime);
	clearInterval(countTime);
	clearInterval(gameTime);
	document.body.innerHTML = "";
}




	


		


