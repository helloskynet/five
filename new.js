/*
4   4   4		data[i-4][j-4]    data[i-4][j]    data[i-4][j+4]
 3  3  3
  2 2 2  
   111
432101234
   111 
  2 2 2
 3  3  3
4   4   4 
chess[i][j]		//记录棋盘当前样子
701
6 2
543

首先是一系列定义：
连五：纵、横、斜线同色五子的紧连。	930400000     1 1 1 1 0
活四：两端都可形成连五的四。		44200000		0 1 1 1 0
冲四：仅一端能形成连五的四。
活三：指可形成活四的三。
休三：指因禁手点无法形成活四的三。
眠三：仅能形成冲四的三。
四四：又称双四，一子出现两条或以上活四或冲四。
三三：又称双活三，一子出现两条或以上活三。
长连：纵、横、斜线同色形成超过五子的连线。
禁手：黑子禁止下出双活三、双四、长连，下出则判败
先五为胜：黑棋五连与禁手同时形成，禁手失效，黑方胜。

*/
var fen = [];

var chessboard = [];	//记录棋盘当前样子
var chess = []; 		//记录每个棋子8个方向的情况
var pingfen = [];		//记录每个空格的权值
						//0代表空 1 代表黑 2代表白 3 棋盘外
var i = 0,j = 0,k = 0,l = 0,x = 0,y = 0;	//循环用临时变量

 	//fen[0] = [10000000,3000000,500000,4000000,3000000,200000];
	//fen[1] = [10000000,3000000,500000,,4000000,2000000,200000]; 	
	fen[0] = [10000000,3000000,500000,1000000,9000000,2000000,200000,1000000]; 
	fen[1] = [18267021440000,41225760000,93040000,210000,867797120000,1958480000,4420000,10000];
for(i = 0;i<15;i++){
	chess[i] = [];
	for(j = 0;j < 15;j++){
		chess[i][j] = [];
		for(k = 0; k < 8;k ++){
			chess[i][j][k] = [];
			for(l = 0;l < 5;l++){
				chess[i][j][k][l] = 0;
			}
		}
	}
}
for(i = 0;i < 15;i ++){
	chessboard[i] = [];
	pingfen[i] = [];
	for(j = 0;j< 15;j++){
		chessboard[i][j] = 0;
		pingfen[i][j] = [];
		for(k = 0;k < 3; k++){
			pingfen[i][j][k] = 0;
		}
	}
}
 //边界问题
for(i=0;i<15;i++)//边界问题的赋值
{    
		chess[0][i][7][0]=3;    
		chess[0][i][0][0]=3;  
	    chess[0][i][1][0]=3;//第一行
		
	    chess[14][i][3][0]=3;  
	    chess[14][i][4][0]=3;     
		chess[14][i][5][0]=3;//第十五行 
		
		chess[i][0][7][0]=3;   
		chess[i][0][6][0]=3; 
		chess[i][0][5][0]=3;//第一列
		
		chess[i][14][1][0]=3;  
		chess[i][14][2][0]=3; 
		chess[i][14][3][0]=3;//第十五列
}
function initialize(){			//将棋盘信息送给chess[][][][]
	for( i = 0; i < 15; i++)  //0方向检查   
		for( j = 0; j<15; j++)  
			if( chessboard[i][j] == 0)  
				for( k = 0, x = i, y = j; k<5&&x>0; k++, x--)  
					chess[i][j][0][k] = chessboard[x-1][y];
	
	for( i = 0; i < 15; i++)   //4 方向检查
	    for( j = 0; j < 15; j++)   
			if( chessboard[i][j] == 0)   
				for( k = 0, x = i, y = j;k<5&&x<14;k++, x++)
					chess[i][j][4][k] = chessboard[x+1][y]; 
	
    for( i = 0; i < 15; i++)    // 1 方向检查
		for( j = 0; j <15;j++)  
			if(chessboard[i][j] == 0)      
				for( k = 0, x = i, y = j; k<5&&x>0&&y<14; k++, x--, y++)        
					chess[i][j][1][k] = chessboard[x-1][y+1];  
					
    for( i = 0; i <15; i++) // 5 方向检查
		for( j=0; j<15; j++)   
			if(chessboard[i][j] == 0)  
				for( k = 0, x = i, y = j; k<5&&x<14&&y>0; k++, x++, y--) 
			chess[i][j][5][k] = chessboard[x+1][y-1];  

    for( i = 0; i < 15; i++)// 2 方向检查     
		for( j = 0; j < 15; j++)   
			if( chessboard[i][j] == 0)   
				for( k = 0, x = i, y = j; k<5&&y<14; k++, y++)   
					chess[i][j][2][k] = chessboard[x][y+1];  

    for( i = 0; i < 15; i++)//6 方向检查
		for( j = 0; j <15; j++)   
			if( chessboard[i][j] == 0)   
				for( k = 0, x = i, y = j; k<5&&y>0; k++,y--)
					chess[i][j][6][k] = chessboard[x][y-1];    
			
    for(i=0;i<15;i++)// 3 方向检查
		for(j=0;j<15;j++)   
			if( chessboard[i][j] == 0)      
				for( k = 0, x = i, y = j; k<5&&y<14&&x<14; k++, x++, y++)      
				chess[i][j][3][k] = chessboard[x+1][y+1]; 
				
	for(i=0;i<15;i++)// 7 方向检查
		for(j=0;j<15;j++)   
			if(chessboard[i][j] == 0)   
				for( k = 0, x = i, y = j; k<5&&x>0&&y>0; k++, x--, y--)
	 chess[i][j][7][k] = chessboard[x-1][y-1];
}

function pingfe(){
	for(i = 0;i < 15;i++)
		for(j = 0;j< 15;j++){
			for(k = 1;k < 3; k++){
				pingfen[i][j][k] = 0;
			}
		} 
var m =0,n = 0;
var player1 = 1,player2 = 2;
	for( i=0;i<15;i++)
		for( j=0;j<15;j++)
			if(chessboard[i][j] == 0){
				for(k=0;k<8;k++){		
				if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==player1&&chess[i][j][k][3]==player1) // 0 0 0 0 1
					pingfen[i][j][player1] += fen[rank][0];
				}
				for(k=0;k<4;k++){     
					if(chess[i][j][k][0]==player1&&chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==player1)   //  0 1 0 0 0      
						pingfen[i][j][player1]+=fen[rank][0];
					if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==player1&&chess[i][j][k+4][0]==player1)               //  0 0 0 1 0
						pingfen[i][j][player1]+=fen[rank][0];      
					 if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1)   			// 0 0 1 0 0  
						pingfen[i][j][player1]+=fen[rank][0];     
				} //电脑可以形成成五
				for(k=0;k<4;k++){
					if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==player1&&chess[i][j][k][3]==0&&chess[i][j][k+4][0]==0) // 6 0 0 0 1 6
						pingfen[i][j][player1]+=fen[rank][1];
					if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==player1&&chess[i][j][k+4][3]==0&&chess[i][j][k][0]==0)	//6 1 0 0 0 6
						pingfen[i][j][player1]+=fen[rank][1]; 
					if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==0&&chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==0)     // 6 0 0 1 0 6
						pingfen[i][j][player1]+=fen[rank][1];
					if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==0&&chess[i][j][k][0]==player1&&chess[i][j][k][1]==0)  //6 0 1 0 0 6  
						pingfen[i][j][player1]+=fen[rank][1];
				 }//电脑可以形成活四
				 
			for(k=0;k<4;k++){     
				if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==player1&&((chess[i][j][k][3]==player2&&chess[i][j][k+4][0]==0)||(chess[i][j][k][3]==0&&chess[i][j][k+4][0]==player2))){	// 2 0 0 0 1 6 / 6 0 0 0 1 2 
					pingfen[i][j][player1]+=5000;      
					n++;      
				}      
				if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==player1&&((chess[i][j][k+4][3]==player2&&chess[i][j][k][0]==0)||(chess[i][j][k+4][3]==0&&chess[i][j][k][0]==player2))){// 6 1 0 0 0 2 / 2 1 0 0 0 6       
					pingfen[i][j][player1]+=5000;      
					n++;     
				} 
				if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k+4][0]==player1&&((chess[i][j][k][3]==player2&&chess[i][j][k+4][1]==0)||(chess[i][j][k][3]==0&&chess[i][j][k+4][1]==player2))){ // 2 0 0 1 0 6 / 6 0 0 1 0 2     
					pingfen[i][j][player1]+=5000;    
					n++;      
				}     
				if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k][0]==player1&&(chess[i][j][k+4][3]==player2&&chess[i][j][k][1]==0||chess[i][j][k+4][3]==0&&chess[i][j][k][1]==player2)){// 6 0 1 0 0 2 / 2 0 1 0 0 6    
					pingfen[i][j][player1]+=5000;      
					n++;     
				}       
				}
				//电脑可以成冲四
		for(k=0;k<4;k++){             
			 if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==0&&chess[i][j][k+4][0]==0){// 6 0 0 1 6      
				pingfen[i][j][player1]+=fen[rank][3];  
				m++;       
			 }     
			 if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==0&&chess[i][j][k][0]==0){ //   6 1 0 0 6  
				 pingfen[i][j][player1]+=fen[rank][3];    
				 m++;       
			 }      
			 if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==0&&chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==0){	// 6 0 1 0 6     
				pingfen[i][j][player1]+=fen[rank][3];   
				m++; 
			 } 
		}//电脑可以成双活三
		if(m>1){
			pingfen[i][j][player1]+=fen[rank][2];
		}//电脑可以成三三
		if(m>0&&n>0){
			pingfen[i][j][player1]+=fen[rank][2];
		}//电脑可以成冲四双活三	
		
		for(k=0;k<4;k++){   
			if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&((chess[i][j][k][2]==player2&&chess[i][j][k+4][0]==0)||(chess[i][j][k][2]==0&&chess[i][j][k+4][0]==player2)))// 2 0 0 1 6 / 6 0 0 1 2    
				pingfen[i][j][player1]+=500;     
			if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&((chess[i][j][k+4][2]==player2&&chess[i][j][k][0]==0)||(chess[i][j][k+4][2]==0&&chess[i][j][k][0]==player2))) // 6 1 0 0 2 / 2 1 0 0 6 
				pingfen[i][j][player1]+=500;  
			if(chess[i][j][k][0]==player1&&chess[i][j][k+4][0]==player1&&((chess[i][j][k+4][1]==0&&chess[i][j][k][1]==player2)||(chess[i][j][k+4][1]==player2&&chess[i][j][k][1]==0))) // 2 0 1 0 6  / 6 0 1 0 2   
				pingfen[i][j][player1]+=500;  
		}//电脑可以成单活三 
		for(k=0;k<4;k++){ 
			if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==player1&&chess[i][j][k][3]==player2&&chess[i][j][k+4][0]==player2) 		// 2 0 0 0 1 2       
				pingfen[i][j][player1]+=10;   
			if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==player1&&chess[i][j][k+4][3]==player2&&chess[i][j][k][0]==player2)     // 2 1 0 0 0 2
				pingfen[i][j][player1]+=10;       
			if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k+4][0]==player1&&chess[i][j][k][2]==player2&&chess[i][j][k+4][1]==player2)  		// 2 0 0 1 0 2
				pingfen[i][j][player1]+=10;   
			if(chess[i][j][k][0]==player1&&chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==player2&&chess[i][j][k][1]==player2)   		//  2 0 1 0 0 2  
				pingfen[i][j][player1]+=10;              
				}//电脑可以形成死四
     for(k=0;k<4;k++){   
		if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player1&&chess[i][j][k][2]==player2&&chess[i][j][k+4][0]==player2) // 2 0 0 1 2  
			pingfen[i][j][player1]+=5;       
		if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player1&&chess[i][j][k+4][2]==player2&&chess[i][j][k][0]==player2)  // 2 1 0 0 2
			pingfen[i][j][player1]+=5;      
		if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player2&&chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player2)    // 2 0 1 0 2  
			pingfen[i][j][player1]+=5;     
	 }//电脑成死三 
		for(k=0;k<4;k++){  
			if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==0&&chess[i][j][k+4][0]==0)// 6 0 1 6  
				pingfen[i][j][player1]+=100;  
			if(chess[i][j][k][0]==0&&chess[i][j][k+4][1]==0&&chess[i][j][k+4][0]==player1) //  6 1 0 6    
				pingfen[i][j][player1]+=100;    
			}//电脑成双活二
		for(k=0;k<4;k++){       
			if(chess[i][j][k][0]==player1&&((chess[i][j][k][1]==player2&&chess[i][j][k+4][0]==0)||(chess[i][j][k][1]==0&&chess[i][j][k+4][0]==player2))) 			//  2 0 1 6/ 6 0 1 2        
				pingfen[i][j][player1]+=50; 
			if(chess[i][j][k+4][0]==player1&&((chess[i][j][k+4][1]==player2&&chess[i][j][k][0]==0)||(chess[i][j][k+4][1]==0&&chess[i][j][k][0]==player2)))				// 6 1 0 2 / 2 1 0 6  
				pingfen[i][j][player1]+=50;   
			}//电脑成活二  
        for(k=0;k<4;k++){   
			if(chess[i][j][k][0]==player1&&chess[i][j][k][1]==player2&&chess[i][j][k+4][0]==player2) // 2 0 1 2  
				pingfen[i][j][player1]+=3;   
			if(chess[i][j][k+4][0]==player1&&chess[i][j][k+4][1]==player2&&chess[i][j][k][0]==player2)  
				pingfen[i][j][player1]+=3;  //2 1 0 2
			}//电脑成死二
		}	
		
		m = 0;
		n = 0;
		///////////////////////////////////////
	for( i=0;i<15;i++)
		for( j=0;j<15;j++)
			if(chessboard[i][j] == 0){
				for(k=0;k<8;k++){
				if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==player2&&chess[i][j][k][3]==player2) 
					pingfen[i][j][player2] +=fen[rank][4];
				}
				for(k=0;k<4;k++){      
					if(chess[i][j][k][0]==player2&&chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==player2)      
						pingfen[i][j][player2]+=fen[rank][4];
					if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2)       
						pingfen[i][j][player2]+=fen[rank][4];      
					 if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==player2&&chess[i][j][k+4][0]==player2)     
						pingfen[i][j][player2]+=fen[rank][4];     
				} //人可以形成成五
				
				for(k=0;k<4;k++){
					if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==player2&&chess[i][j][k][3]==0&&chess[i][j][k+4][0]==0) 
						pingfen[i][j][player2]+=fen[rank][5];
					if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==player2&&chess[i][j][k+4][3]==0&&chess[i][j][k][0]==0)
						pingfen[i][j][player2]+=fen[rank][5]; 
					if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==0&&chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==0)     
						pingfen[i][j][player2]+=fen[rank][5];
					if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==0&&chess[i][j][k][0]==player2&&chess[i][j][k][1]==0)    
						pingfen[i][j][player2]+=fen[rank][5];
				 }//人可以形成活四
				 
			for(k=0;k<4;k++){     
				if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==player2&&((chess[i][j][k][3]==player1&&chess[i][j][k+4][0]==0)||(chess[i][j][k][3]==0&&chess[i][j][k+4][0]==player1))){
					pingfen[i][j][player2]+=5000;      
					n++;      
				}      
				if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==player2&&((chess[i][j][k+4][3]==player1&&chess[i][j][k][0]==0)||(chess[i][j][k+4][3]==0&&chess[i][j][k][0]==player1)))  
				{         
					pingfen[i][j][player2]+=5000;      
					n++;     
				} 
				if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k+4][0]==player2&&((chess[i][j][k][3]==player1&&chess[i][j][k+4][1]==0)||(chess[i][j][k][3]==0&&chess[i][j][k+4][1]==player1)))      
				{      
					pingfen[i][j][player2]+=5000;    
					n++;      
				}     
				if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k][0]==player2&&(chess[i][j][k+4][3]==player1&&chess[i][j][k][1]==0||chess[i][j][k+4][3]==0&&chess[i][j][k][1]==player1))   
				{    
					pingfen[i][j][player2]+=5000;      
					n++;     
				}       
				}
					
			//人可以成冲四 
		for(k=0;k<4;k++){  
			 //j=0;            
			 if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==0&&chess[i][j][k+4][0]==0)
			 {        
				pingfen[i][j][player2]+=fen[rank][7];  
				m++;       
			 }     
			 if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==0&&chess[i][j][k][0]==0)
			 {   
				 pingfen[i][j][player2]+=fen[rank][7];    
				 m++;       
			 }      
			 if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==0&&chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==0) 
			 {     
				pingfen[i][j][player2]+=fen[rank][7];   
				m++; 
			 } 
		}	//人可以成双活三
		if(m>1){
			pingfen[i][j][player2]+=fen[rank][6];
		}//人可以成三三
		if(m>0&&n>0){
			pingfen[i][j][player2]+=fen[rank][6];
		}//人d可以成冲四双活三
		for(k=0;k<4;k++){   
			if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&(chess[i][j][k][2]==player1&&chess[i][j][k+4][0]==0||chess[i][j][k][2]==0&&chess[i][j][k+4][0]==player1))    
				pingfen[i][j][player2]+=500;     
			if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&(chess[i][j][k+4][2]==player1&&chess[i][j][k][0]==0||chess[i][j][k+4][2]==0&&chess[i][j][k][0]==player1))    
				pingfen[i][j][player2]+=500;  
			if(chess[i][j][k][0]==player2&&chess[i][j][k+4][0]==player2&&(chess[i][j][k+4][1]==0&&chess[i][j][k][1]==player1||chess[i][j][k+4][1]==player1&&chess[i][j][k][1]==0))       
				pingfen[i][j][player2]+=500;  
		}//人可以成单活三
		for(k=0;k<4;k++){ 
			if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==player2&&chess[i][j][k][3]==player1&&chess[i][j][k+4][0]==player1)       
				pingfen[i][j][player2]+=10;   
			if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==player2&&chess[i][j][k+4][3]==player1&&chess[i][j][k][0]==player1)       
				pingfen[i][j][player2]+=10;       
			if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k+4][0]==player2&&chess[i][j][k][2]==player1&&chess[i][j][k+4][1]==player1)  
				pingfen[i][j][player2]+=10;   
				if(chess[i][j][k][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][0]==player2&&chess[i][j][k+4][2]==player1&&chess[i][j][k][1]==player1)     
				pingfen[i][j][player2]+=10;              

				}//人可以形成死四
     for(k=0;k<4;k++){   
		if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player2&&chess[i][j][k][2]==player1&&chess[i][j][k+4][0]==player1)   
			pingfen[i][j][player2]+=5;       
		if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player2&&chess[i][j][k+4][2]==player1&&chess[i][j][k][0]==player1)  
			pingfen[i][j][player2]+=5;      
		if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player1&&chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player1)      
			pingfen[i][j][player2]+=5;     
	 }//人成死三 
		for(k=0;k<4;k++){  
			if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==0&&chess[i][j][k+4][0]==0)  
				pingfen[i][j][player2]+=100;  
			if(chess[i][j][k][0]==0&&chess[i][j][k+4][1]==0&&chess[i][j][k+4][0]==player2)     
				pingfen[i][j][player2]+=100;    
			}//人成双活二
		for(k=0;k<4;k++){       
			if(chess[i][j][k][0]==player2&&(chess[i][j][k][1]==player1&&chess[i][j][k+4][0]==0||chess[i][j][k][1]==0&&chess[i][j][k+4][0]==player1))      
				pingfen[i][j][player2]+=30; 
			if(chess[i][j][k+4][0]==player2&&(chess[i][j][k+4][1]==player1&&chess[i][j][k][0]==0||chess[i][j][k+4][1]==0&&chess[i][j][k][0]==player1))  
				pingfen[i][j][player2]+=30;   
			}//人成活二  
        for(k=0;k<4;k++){   
			if(chess[i][j][k][0]==player2&&chess[i][j][k][1]==player1&&chess[i][j][k+4][0]==player1)   
				pingfen[i][j][player2]+=3;   
			if(chess[i][j][k+4][0]==player2&&chess[i][j][k+4][1]==player1&&chess[i][j][k][0]==player1)  
				pingfen[i][j][player2]+=3;  
			}//人成死二
		}	
} 
function add_chessman(ad,chang){
	chessboard[ad.x][ad.y] = chang;
	pingfen[ad.x][ad.y][0] = chang;
}
function check(){
	for(i = 0;i < 15;i++){		//逐行检查//换行清空 
	k = 0;
	l = 0;	//k 表示黑棋连续个数  l表示白棋
		for(j = 0;j < 15;j++){
			if(chessboard[i][j] == 0){
				k = 0;
				l = 0;
			}else if(chessboard[i][j] == 1){
				l = 0;
				k++;
			}else{
				k = 0;
				l++;
			}
			if(k == 5){
				blink(i,j,0);
				return 1;
			}
			if(l == 5){
				blink(i,j,0);
				return 2;
			}
		}
	}
	
	for(j = 0;j < 15;j++){		//逐列检查 
	k = 0;
	l = 0;	//k 表示黑棋连续个数  l表示白棋
		for(i = 0;i < 15;i++){
			if(chessboard[i][j] == 0){
				k = 0;
				l = 0;
			}else if(chessboard[i][j] == 1){
				l = 0;
				k++;
			}else{
				k = 0;
				l++;
			}
			if(k == 5){
				blink(i,j,1);
				return 1;
			}
			if(l == 5){
				blink(i,j,1);
				return 2;
			}
		}
	}
	
	for(i = 4;i<15;i++){	//右下向右上方向检查
		k = 0;
		l = 0;
		var s = 0;
		for(j = 0;j<11;j++){
			if(chessboard[i][j] == 0){
				k = 0;
				l = 0;
			}else if(chessboard[i][j] == 1){
				l = 0;
				k++;
				for(s = 1;s < 5; s++){
					if(chessboard[i-s][j+s] == 1){
						k++;
					}else{
						k = 0;
						break;
					}
				}
				if(k == 5){
				blink(i,j,2);
					return 1;	
				}				
			}else{
			k = 0;
				l++;
				for(s = 1;s < 5; s++){
					if(chessboard[i-s][j+s] == 2){
						l++;
					}else{
						l = 0;
						break;
					}
				}
				if( l == 5){
				blink(i,j,2);
					return 2;
				}
			}
		}
	}
	for(i = 4;i<15;i++){	//右下向左上方向检查
		k = 0;
		l = 0;
		var s = 0;
		for(j = 4;j<15;j++){
			if(chessboard[i][j] == 0){
				k = 0;
				l = 0;
			}else if(chessboard[i][j] == 1){
			l=0;
			k++;
				for(s = 1;s < 5; s++){
					if(chessboard[i-s][j-s] == 1){
						k++;
					}else{
						k = 0;
						break;
					}
				}	
				if(k == 5){
				blink(i,j,3);
					return 1;
				}
			}else{
			k=0;
			l++;
				for(s = 1;s < 5; s++){
					if(chessboard[i-s][j-s] == 2){
						l++;
					}else{
						l = 0;
						break;
					}
				}
				if(l == 5){
					blink(i,j,3);
					return 2;
				}
			}
		}
	}
return 0;	
}

function sosuo(tu){
	var max = [];
	for(i = 0;i < 3;i++){		//记录电脑评分最大值位置
		max[i] = 0;
	} 
	var max2 = [];
	for(i = 0;i < 3;i++){
		max2[i] = 0;
	} 
	for(i=0;i<15;i++)
		for(j=0;j<15;j++)
			if(pingfen[i][j][0] == 0 && max[0] < pingfen[i][j][1]){
				max[1] = i;
				max[2] = j;
				max[0] = pingfen[i][j][1];
			
			}
			
 	for(i=0;i<15;i++)
		for(j=0;j<15;j++)
			if(pingfen[i][j][0] == 0 && max2[0] < pingfen[i][j][2]){
				max2[1] = i;
				max2[2] = j;
				max2[0] = pingfen[i][j][2];
			} 
			
			if(tu == 1){
				if(max[0] >= max2[0]){
					return {"x":max[1],"y":max[2]};
				}else{
					return {"x":max2[1],"y":max2[2]};
				}
			}else{
				if(max2[0] > max[0]){
					return {"x":max2[1],"y":max2[2]};
				}else{
					return {"x":max[1],"y":max[2]};
				}
			}
}