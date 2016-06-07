

var oy = oy || {};


oy.COST_STRAIGHT = 10;  // 垂直方向或水平方向移动的路径评分
oy.COST_DIAGONAL = 14;  // 斜方向移动的路径评分

//节点类
oy.ANode = cc.Class.extend({
    m_x: 0,     // X坐标 行
    m_y: 0,     // Y坐标 列
    m_g: 0,     // 当前点到起点的移动耗费
    m_h: 0,     // 当前点到终点的移动耗费，即曼哈顿距离|x1-x2|+|y1-y2|(忽略障碍物)
    m_f: 0,     // f = g + h
    m_parentNode: null,  //父类节点

    /**
     * 制定行列位置及其父节点
     * @param row
     * @param col
     * @param parentNode
     */
    ctor: function (row, col, parentNode){
        //this._super();
        this.m_x = row;
        this.m_y = col;
        this.m_parentNode = parentNode;
    },

    release: function (){
        //console.log("ANode release: " + this.m_x + "," + this.m_x);
        this.m_x = null;
        this.m_y = null;
        this.m_g = null;
        this.m_h = null;
        this.m_f = null;
        this.m_parentNode = null;
    },

    getX: function() {
        return this.m_x;
    },
    setX: function (x) {
        this.m_x = x;
    },
    getY: function () {
        return this.m_y;
    },
    setY: function (y) {
        this.m_y = y;
    },
    getParentNode: function () {
        return this.m_parentNode;
    },
    setParentNode: function (parentNode) {
        this.m_parentNode = parentNode;
    },
    getG: function () {
        return this.m_g;
    },
    setG: function (g) {
        this.m_g = g;
    },
    getH: function () {
        return this.m_h;
    },
    setH: function (h) {
        this.m_h = h;
    },
    getF: function () {
        return this.m_f;
    },
    setF: function (f) {
        this.m_f = f;
    },
    toString: function (){
        return "(" + this.m_x +"," + this.m_y + "," + this.m_f + ")";
    }
});


oy.AStart = cc.Class.extend({
    m_map: null,       // 地图(1可通过 0不可通过)
    m_row: 0,           // 行数  行列都从零开始, 左上角为起始点
    m_column:0,         // 列数
    m_openList: null,  // 开启列表
    m_closeList: null, // 关闭列表

    ctor: function (map, row, column) {
        //this._super();

        this.m_map = map;
        this.m_row = row;
        this.m_column = column;
        this.m_openList  = new Array();
        this.m_closeList = new Array();
    },

    release: function (){
        //console.log("AStart release");

        this.m_row = null;
        this.m_column = null;

        oy.safe_deleteArray(this.m_openList, function (node) {
            node.release();
        });
        this.m_openList = null;

        oy.safe_deleteArray(this.m_closeList, function (node) {
            node.release();
        });
        this.m_closeList = null;

        oy.safe_deleteArray(this.m_map, function (elem) {
            oy.safe_deleteArray(elem);
        });
        this.m_map = null;
    },

    reset: function () {
        oy.safe_deleteArray(this.m_openList, function (node) {
            node.release();
        });

        oy.safe_deleteArray(this.m_closeList, function (node) {
            node.release();
        });
    },

    //查找坐标（-1：错误，0：没找到，1：找到了）
    search: function (row1, col1, row2, col2){
        if ( row1 < 0 || row1 >= this.m_row || row2 < 0|| row2 >= this.m_row
            || col1 < 0|| col1 >= this.m_column || col2 < 0|| col2 >= this.m_column ) {
            //
            console.log("传输数据有误！");
            // return -1;
            return null;
        }

        if ( this.m_map[row1][col1] == 0 || this.m_map[row2][col2] == 0) {
            console.log("传输数据有误！");
            return null;
        }

        var sNode = new oy.ANode(row1, col1, null);
        var eNode = new oy.ANode(row2, col2, null);
        this.m_openList.push(sNode);


        var resultList = this.searchNode(sNode, eNode);
        if ( resultList.length == 0 ) {
            console.log("没有找到路径！");
            // return 0;
            return null;
        }

        this.reset(); // 方便连续查找

        return resultList;

        /*
        for (var i=0; i < resultList.length; i++){
            var node = resultList[i];
            this.m_map[node.getX()][node.getY()] = 2;
        }

        oy.safe_deleteArray(resultList);
        resultList = null;

        return 1;
        */
    },

    //查找核心算法
    searchNode: function(sNode, eNode) {
        var resultList = new Array();
        var isFind = false;
        var node = null;

        while(  this.m_openList.length > 0 ) {
            //System.out.println(openList);
            //取出开启列表中最低F值，即第一个存储的值的F为最低的
            node = this.m_openList[0];

            //判断是否找到目标点
            if ( node.getX() == eNode.getX() && node.getY() == eNode.getY() ){
                isFind = true;
                break;
            }

            //上
            if ( (node.getY() - 1) >= 0 ){
                this.checkPath(node.getX(),node.getY()-1,node, eNode, oy.COST_STRAIGHT);
            }
            //下
            if ( (node.getY()+1) < this.m_column ){
                this.checkPath(node.getX(),node.getY()+1,node, eNode, oy.COST_STRAIGHT);
            }
            //左
            if( (node.getX() - 1) >= 0 ){
                this.checkPath(node.getX()-1,node.getY(),node, eNode, oy.COST_STRAIGHT);
            }
            //右
            if ( (node.getX() + 1) < this.m_row ){
                this.checkPath(node.getX() + 1, node.getY(), node, eNode, oy.COST_STRAIGHT);
            }
            //左上
            if ( (node.getX() - 1) >= 0 && (node.getY() - 1) >= 0 ){
                this.checkPath(node.getX() - 1, node.getY() - 1, node, eNode, oy.COST_DIAGONAL);
            }
            //左下
            if ( (node.getX() - 1) >= 0 && (node.getY() + 1) < this.m_column){
                this.checkPath(node.getX() - 1, node.getY() + 1, node, eNode, oy.COST_DIAGONAL);
            }
            //右上
            if ( (node.getX() + 1) < this.m_row && (node.getY() - 1) >= 0){
                this.checkPath(node.getX() + 1, node.getY() - 1, node, eNode, oy.COST_DIAGONAL);
            }
            //右下
            if ( (node.getX() + 1) < this.m_row && (node.getY() + 1) < this.m_column ){
                this.checkPath(node.getX() + 1, node.getY() + 1, node, eNode, oy.COST_DIAGONAL);
            }

            //从开启列表中删除, 添加到关闭列表中
            this.m_closeList.push(this.m_openList.shift());

            //开启列表中排序，把F值最低的放到最底端
            this.m_openList.sort(function(node1, node2) {
                return node1.getF()- node2.getF();
            });

            //System.out.println(openList);
        }

        if (isFind){
            this.getPath(resultList, node);
        }

        return resultList;
    },

    //查询此路是否能走通
    checkPath: function (x, y, parentNode, eNode, cost){
        var node = new oy.ANode(x, y, parentNode);
        // 查找地图中是否能通过
        if (this.m_map[x][y] == 0){
            this.m_closeList.push(node);
            return false;
        }
        //查找关闭列表中是否存在
        if ( this.isListContains(this.m_closeList, x, y) != -1 ){
            return false;
        }

        //查找开启列表中是否存在
        var index = -1;
        index = this.isListContains(this.m_openList, x, y);

        if (index !=-1){
            //G值是否更小，即是否更新G，F值
            if( (parentNode.getG() + cost) < this.m_openList[index].getG() ){
                node.setParentNode(parentNode);
                this.countG(node, eNode, cost);
                this.countF(node);

                this.m_openList.insert(index, node);
            }
        }else{
            //添加到开启列表中
            node.setParentNode(parentNode);
            this.count(node, eNode, cost);
            this.m_openList.push(node);
        }
        return true;
    },

    //集合中是否包含某个元素(-1：没有找到，否则返回所在的索引)
    isListContains: function (list, x, y){
        for(var i = 0; i < list.length; i++){
            var node = list[i];
            if(node.getX() == x && node.getY() == y){
                return i;
            }
        }
        return -1;
    },

    //从终点往返回到起点
    getPath: function (resultList, node){
        if (node.getParentNode() != null) {
            this.getPath(resultList, node.getParentNode());
        }
        //resultList.push(node);
        resultList.push(cc.p(node.getX(), node.getY()));
    },

    //计算G,H,F值
    count: function (node, eNode, cost){
        this.countG(node, eNode, cost);
        this.countH(node, eNode);
        this.countF(node);
    },

    //计算G值
    countG: function (node, eNode, cost){
        if ( node.getParentNode() == null ){
            node.setG(cost);
        }else{
            node.setG(node.getParentNode().getG() + cost);
        }
    },

    //计算H值
    countH: function (node, eNode){
        node.setF(( Math.abs(node.getX() - eNode.getX()) + Math.abs(node.getY() - eNode.getY()) ) * 10);
    },

    //计算F值
    countF: function (node){
        node.setF(node.getG() + node.getH());
    }
});
