var weight = 31;	//棋盘间距
var bianx = 8;
function paint_chess(){			//画棋盘
	var canvas=document.getElementById('myCanvas');
	var ctx=canvas.getContext('2d');
	
	ctx.fillStyle='#DDB844';
	ctx.fillRect(0,0,450,450);
	
		var startx = bianx;
		var starty = bianx;	
		var endx = bianx;
		var endy = 450-bianx;
		
		ctx.lineWidth=2;
		for(var i = 1;i<=15;i++ ){
			
			ctx.beginPath();
			ctx.moveTo(startx,starty);
			ctx.lineTo(endx,endy);
			ctx.stroke();
			
			startx =  weight*i+bianx;
			endx =  weight*i+bianx;
		}	
		startx = bianx;
		starty = bianx;
		endx = 450 - bianx;
		endy = bianx;
		for(var i = 1;i<=15;i++ ){
			ctx.beginPath();
			ctx.moveTo(startx,starty);
			ctx.lineTo(endx,endy);
			ctx.stroke();
			starty =  weight*i+bianx;
			endy =  weight*i+bianx;
		}
	circle(3*weight+bianx,3*weight+bianx,4,'#000');		
	circle(3*weight+bianx,11*weight+bianx,4,'#000');		
	circle(11*weight+bianx,3*weight+bianx,4,'#000');		
	circle(11*weight+bianx,11*weight+bianx,4,'#000');		
	circle(7*weight+bianx,7*weight+bianx,5,'#000');		
}
//画圆形
function circle(x,y,radius,color){
	
	var canvas=document.getElementById('myCanvas');
	
	var ctx=canvas.getContext('2d');
	
	ctx.fillStyle=color;
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}
//获得鼠标位置 并转换成棋盘坐标
function getMousePos(event) {
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;
			y = y - 40;
			 
			x = x - (document.body.scrollWidth - 450)/2;
			x = Math.floor(x/30);
			y = Math.floor(y/30);
			
            //
            return { 'x': x, 'y': y };
   }

function blink(x,y,d){
	switch(d){
		case 0:for(i = 0;i<5;i++)		//行
			circle(x*weight+bianx,(y-i)*weight+bianx,10,'#f00');
			break;
		case 1:for(i = 0;i<5;i++)		//列
			circle((x-i)*weight+bianx,y*weight+bianx,10,'#f00');
			break;
		case 2:for(i = 0;i<5;i++)		//左下向右上方向检查
			circle((x-i)*weight+bianx,(y+i)*weight+bianx,10,'#f00');
			break;
		case 3:for(i = 0;i<5;i++)		//右下向左上方向检查
			circle((x-i)*weight+bianx,(y-i)*weight+bianx,10,'#f00');
			break;
		default:break;
	}
}