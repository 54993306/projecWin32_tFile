import java.util.*;

public class Test {
    
    public static void main(String[] args){
       int[][] map=new int[][]{// ��ͼ����
                {1,1,1,1,1,1,1,1,1,1},
                {1,1,1,1,0,1,1,1,1,1},
                {1,1,1,1,0,1,1,1,1,1},
                {1,1,1,1,0,1,1,1,1,1},
                {1,1,1,1,0,1,1,1,1,1},
                {1,1,1,1,0,1,1,1,1,1}
        };
        AStar aStar=new AStar(map, 6, 10);
        int flag=aStar.search(3, 2, 3, 8);
        if(flag==-1){
            System.out.println("������������");
        }else if(flag==0){
            System.out.println("û�ҵ���");
        }else{          
            for(int x=0;x<6;x++){
                for(int y=0;y<10;y++){
                    if(map[x][y]==1){
                        System.out.print("��");
                    }else if(map[x][y]==0){
                        System.out.print("��");
                    }else if(map[x][y]==2){//�������·��
                        System.out.print("��");
                    }
                }
                System.out.println();
            }
        }
    }
}