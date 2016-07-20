var started = 0;
var xianshou = 1;
var win_times = [];
win_times[0]=0;
win_times[1]=0;
var rank = 0;    //游戏级别
var turn = 1;	//当前下子的一方
var step = 0;	//记录下了多少步
function first(){		//先手选择
	started = 0;
	chushihua();
	var start = document.getElementById("start");
		start.value = "开  始";
	var first = document.getElementById("first");
	if(xianshou == 1){
		first.value = "人 先 手";
		xianshou = 2;
		turn = 2;
	}else{
		first.value = "电脑先手";
		xianshou = 1;
		turn = 1;
	}
}
function start(){
	if(step > 0){
		win_times[0]++;
	}
		score.innerHTML="电脑胜利："+win_times[0]+"<br/>人胜利：<br/>"+win_times[1];
	temp2 = 0;
	chushihua();
	started = 1;
	if(xianshou == 1){		//电脑先手
		chessboard[8][8] = 1;
		pingfen[8][8][0] = 1;
		circle(8*weight+8,8*weight+8,14,"#000");
	}
	turn = 2;
	var start = document.getElementById("start");
		start.value = "重新开始";
}
function geta(){
	var ss = document.getElementById("sele");
	rank = ss.value;
	started = 0;
	chushihua();
	var start = document.getElementById("start");
		start.value = "开  始";
	var first = document.getElementById("first");
		first.value = "电脑先手";
		xianshou = 1;
		turn = 1;
}
function chushihua(){
	paint_chess();
	step = 0;
	for(i = 0;i<15;i++){
		for(j = 0;j < 15;j++){
			chessboard[i][j] = 0;
			for(k = 0;k < 3; k++){
				pingfen[i][j][k] = 0;
			}
			for(k = 0; k < 8;k ++){
				for(l = 0;l < 5;l++){
					chess[i][j][k][l] = 0;
				}	//初始化各个记录
			}
		}
	}
}