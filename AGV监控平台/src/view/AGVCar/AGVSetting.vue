<template>
    <div class="common-layout">
      <el-container>
        <el-header style="background-color: var(--el-color-primary-light-7); margin-bottom: 5px; box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);">
            <div style="height: 100%;">
          <el-row style="height: 100%; align-items: center;">
            <el-col :span="2">
                <div @click="GoMainPage" class="back-icon">
                    <el-icon size="large" ><ArrowLeftBold /></el-icon>
                </div>
            </el-col>
            <el-col :span="18" style="font-size: 36px;color: #3d3d3d;">
              设置界面
            </el-col>
            <el-col :span="4">
                <el-button  size="large" @click=" selectflie.click()">导入配置</el-button>
                <el-button  size="large" @click="ExportJson">导出配置</el-button>
                <input ref="selectflie" type="file" id="avatar" name="avatar" required @change="ImportJson" v-show="false">

            </el-col>
          </el-row>
        </div>
        </el-header>
        <el-main>
            <div>
                <ElRow>
                    <ElCol :span="11" >
                        <div style="padding: 10px; background:#f7fbfe; border-radius: 5px;">
                            <ElCollapse accordion >
                                <ElCollapseItem >
                                    <template #title>
                                        <div class="card-title">
                                            小车列表
                                            <ElTag type="success" v-show="carlist.length>0">{{ carlist.length }}</ElTag>
                                        </div>
                                    </template>
                                    <ElCard>
                                        <template #default>
                                            <ElTable
                                            max-height="60vh"
                                            width="100%"
                                            :data="carlist"
                                            @row-dblclick="(row)=>EditTable(0,row)"
                                            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                                            >
                                                <ElTableColumn type="index" label="序号" width="70px"></ElTableColumn>
                                                <ElTableColumn property="ip" label="ip" ></ElTableColumn>
                                                <ElTableColumn property="waitpos" label="停靠点" ></ElTableColumn>
                                                <ElTableColumn align="right" width="72">
                                                    <template #header>
                                                        <ElButton type="primary" size="small" @click="AddBtn(0)">新增</ElButton>
                                                    </template>
                                                    <template #default="carRow">
                                                        <ElButton type="danger" size="small" @click="DelBtn(0,carRow.$index)">删除</ElButton>
                                                    </template>
                                                </ElTableColumn>
                                            </ElTable>
                                        </template>
                                    </ElCard>
                                </ElCollapseItem>
                                <ElCollapseItem title="工位列表">
                                    <template #title>
                                        <div class="card-title">
                                            工位列表
                                            <ElTag type="success" v-show="railposlist.length>0">{{ railposlist.length }}</ElTag>
                                        </div>
                                    </template>
                                    <ElCard>
                                        <template #default>
                                            <ElTable
                                            max-height="60vh"
                                            width="100%"
                                            :data="railposlist"
                                            @row-dblclick="(row)=>EditTable(1,row)"
                                            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                                            >
                                                <ElTableColumn property="id" label="工位号" width="100" sortable ></ElTableColumn>
                                                <ElTableColumn property="idPhysical" label="物理号" width="100" sortable></ElTableColumn>
                                                <ElTableColumn label="属性">
                                                    <template #default="railRow">

                                                        <el-tag type="primary" v-if="railRow.row.transfer" >换乘</el-tag>
                                                        <el-tag type="primary" v-if="railRow.row.actdir===1" >左</el-tag>
                                                        <el-tag type="primary" v-if="railRow.row.actdir===2" >右</el-tag>
                                                        <el-tag type="primary" v-if="railRow.row.load" >上料</el-tag>
                                                        <el-tag type="primary" v-if="railRow.row.unload" >下料</el-tag>
                                                    </template>
                                                </ElTableColumn>
                                                <ElTableColumn align="right" width="72">
                                                    <template #header>
                                                        <ElButton type="primary" size="small" @click="AddBtn(1)">新增</ElButton>
                                                    </template>
                                                    <template #default="railRow">
                                                        <ElButton type="danger" size="small" @click="DelBtn(1,railRow.$index)">删除</ElButton>
                                                    </template>
                                                </ElTableColumn>
                                            </ElTable>
                                        </template>
                                    </ElCard>
                                </ElCollapseItem>
                                <ElCollapseItem >
                                    <template #title>
                                        <div class="card-title">
                                            充电点
                                            <ElTag type="success" v-show="chargelist.size>0">{{ chargelist.size }}</ElTag>
                                        </div>
                                    </template>
                                    <ElCard>
                                        <template #default>
                                            <ElTable
                                            max-height="60vh"
                                            width="100%"
                                            :data="Array.from(chargelist)"
                                            @row-dblclick="(row)=>EditTable(1,row)"
                                            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                                            >
                                                <ElTableColumn tpye="row" label="充电点号">
                                                    <template #default="chargeRow">
                                                        {{ parseInt(chargeRow.row) }}
                                                    </template>
                                                </ElTableColumn>
                                                <ElTableColumn align="right" width="72">
                                                    <template #header>
                                                        <ElButton type="primary" size="small" @click="dlgCharge=true">新增</ElButton>
                                                    </template>
                                                    <template #default="chargeRow">
                                                        <ElButton type="danger" size="small" @click="DelBtn(4,chargeRow.row)">删除</ElButton>
                                                    </template>
                                                </ElTableColumn>
                                            </ElTable>
                                        </template>
                                    </ElCard>
                                </ElCollapseItem>
                            </ElCollapse>
                        </div>
                    </ElCol>
                    <ElCol :span="1"></ElCol>
                    <ElCol :span="11">
                        <div style="padding:10px;background:#f7fbfe; border-radius: 5px;">
                            <ElCollapse accordion>
                                <ElCollapseItem >
                                    <template #title>
                                        <div class="card-title">
                                            物理路径
                                            <ElTag type="success" v-show="pathlist.length>0">{{ pathlist.length }}</ElTag>
                                        </div>
                                    </template>
                                    <ElCard>
                                        <template #default>
                                            <ElTable
                                            max-height="60vh"
                                            width="100%"
                                            :data="pathlist"
                                            @row-dblclick="(row)=>EditTable(2,row)"
                                            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                                            >
                                                <ElTableColumn property="ori" label="起点" sortable ></ElTableColumn>
                                                <ElTableColumn property="tar" label="终点" sortable ></ElTableColumn>
                                                <ElTableColumn property="num" label="小车数量" ></ElTableColumn>
                                                <ElTableColumn align="right" width="72">
                                                    <template #header>
                                                        <ElButton type="primary" size="small" @click="AddBtn(2)">新增</ElButton>
                                                    </template>
                                                    <template #default="carRow">
                                                        <ElButton type="danger" size="small" @click="DelBtn(2,carRow.$index)">删除</ElButton>
                                                    </template>
                                                </ElTableColumn>
                                            </ElTable>
                                        </template>
                                    </ElCard>
                                </ElCollapseItem>
                                <ElCollapseItem >
                                    <template #title>
                                        <div class="card-title">
                                            逻辑路径
                                            <ElTag type="success" v-show="edgelist.length>0">{{ edgelist.length }}</ElTag>
                                        </div>
                                       
                                    </template>
                                    <ElCard>
                                        <template #default>
                                            <ElTable
                                             max-height="60vh"
                                            width="100%"
                                            :data="edgelist"
                                            @row-dblclick="(row)=>EditTable(3,row)"
                                            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                                            >
                                                <ElTableColumn property="ori" label="起点" sortable ></ElTableColumn>
                                                <ElTableColumn property="tar" label="终点" sortable ></ElTableColumn>
                                                <ElTableColumn property="edge.time" label="权重" ></ElTableColumn>
                                                <ElTableColumn  label="允许小车" >
                                                    <template #default="edgeRow">
                                                        <el-tag v-for="(item,index) in edgeRow.row.edge.carsid" :key="index">
                                                        {{ item+1 }}
                                                        </el-tag>
                                                    </template>
                                                </ElTableColumn>
                                                <ElTableColumn align="right" width="72">
                                                    <template #header>
                                                        <ElButton type="primary" size="small" @click="AddBtn(3)">新增</ElButton>
                                                    </template>
                                                    <template #default="carRow">
                                                        <ElButton type="danger" size="small" @click="DelBtn(3,carRow.$index)">删除</ElButton>
                                                    </template>
                                                </ElTableColumn>
                                            </ElTable>
                                        </template>
                                    </ElCard>
                                </ElCollapseItem>
                            </ElCollapse>
                        </div>
                    </ElCol>
                </ElRow>
            </div>
            <ElDialog v-model="dlgCar" :title="editCarTitle" style="width: fit-content;"
                @open="carref.clearValidate()"
            >
            <div style="box-shadow:var(--el-box-shadow-lighter); padding:30px;margin: 10px;">
              <ElForm :model="car"  ref="carref" :rules="carrules">
                <ElFormItem prop="ip" label="ip" >
                    <ElInput v-model="car.ip"></ElInput>
                </ElFormItem>
                <ElFormItem prop="waitpos" label="停靠点">
                    <ElInput v-model="car.waitpos" type="number" style="width: 100px;"></ElInput>
                </ElFormItem>
              </ElForm>
            </div>
            <div style="padding: 20px;">
              <ElButton type="primary" @click="DlgComfirm(0)">确定</ElButton>
            </div>
            </ElDialog>
            <ElDialog v-model="dlgRailpos" :title="editRailposTitle" style="width: fit-content;"
                 @open="railposref.clearValidate()"
            >
                <div style="box-shadow:var(--el-box-shadow-lighter); padding:30px ;margin: 10px;max-width: 60vb;">
                    <ElForm :model="railpos" :inline="true" ref="railposref" :rules="railposrules" >
                        <ElFormItem label="工位点号" prop="id" >
                            <ElInput v-model.number="railpos.id" type="number" style="width: 80px;"></ElInput>
                        </ElFormItem>
                        <ElFormItem label="物理点号" prop="idPhysical">
                            <ElInput v-model.number="railpos.idPhysical" type="number" style="width: 80px;"></ElInput>
                        </ElFormItem>
                        <br/>
                        <ElFormItem label="ip" prop="ip" >
                            <ElInput v-model="railpos.ip"  style="width: 150px;"></ElInput>
                        </ElFormItem>
                        <ElFormItem label="端口" prop="port">
                            <ElInput v-model.number="railpos.port" style="width: 80px;"></ElInput>
                        </ElFormItem>
                        <br/>
                        <ElFormItem label="方向：" prop="actdir">
                            <el-radio-group v-model="railpos.actdir">
                                <el-radio :value="0">无</el-radio>
                                <el-radio :value="1">左</el-radio>
                                <el-radio :value="2">右</el-radio>
                            </el-radio-group>
                        </ElFormItem>
                        <br/>
                        <ElFormItem prop="transfer">
                            <el-checkbox v-model="railpos.transfer" label="允许换乘" ></el-checkbox>
                        </ElFormItem>
                        <ElFormItem prop="load">
                            <el-checkbox v-model="railpos.load" label="允许上料"></el-checkbox>
                        </ElFormItem>
                        <ElFormItem prop="transfer">
                            <el-checkbox v-model="railpos.unload" label="允许下料"></el-checkbox>
                        </ElFormItem>
                    </ElForm>
                </div>
                <div style="padding: 20px;">
                <ElButton type="primary" @click="DlgComfirm(1)">确定</ElButton>
                </div>
            </ElDialog>
            <ElDialog v-model="dlgPath" :title="editPathTitle" style="width: fit-content;"
                @open="pathref.clearValidate(); msgRepeat=null">
                <div style="box-shadow:var(--el-box-shadow-lighter); padding:20px ;margin: 10px;">
                    <ElForm :model="path" :inline="true" ref="pathref" :rules="pathrules">
                        <ElFormItem prop="ori" label="起点">
                            <ElSelect v-model="path.ori" style="width: 80px;">
                                <ElOption v-for="(item) in idphSet"
                                :key="item"
                                :label="item"
                                :value="item"
                                ></ElOption>
                            </ElSelect>
                        </ElFormItem>
                        <ElFormItem prop="tar" label="终点">
                            <ElSelect v-model="path.tar" style="width: 80px;">
                                <ElOption v-for="(item) in idphSet"
                                :key="item"
                                :label="item"
                                :value="item"
                                ></ElOption>
                            </ElSelect>
                        </ElFormItem>
                        <br/>
                        <ElFormItem prop="num" label="允许小车数量">
                            <ElInput v-model="path.num" type="number" style="width: 100px;" min="1"></ElInput>
                        </ElFormItem>
                    </ElForm>
                    <ElCheckbox v-model="createBackPath" v-show="dlgPathType===0">同时添加反向路径</ElCheckbox>
                </div>
                <div style="padding: 20px;">
                    <ElText type="danger" v-show="msgRepeat">{{ msgRepeat }}<br/></ElText>
                    <ElButton type="primary" @click="DlgComfirm(2)">确定</ElButton>
                </div>
            </ElDialog>
            <ElDialog v-model="dlgEdge" :title="editEdgeTitle" style="width: fit-content;"
                @open="edgeref.clearValidate(); msgRepeat=null">
                <div style="box-shadow:var(--el-box-shadow-lighter); padding:20px ;margin: 10px;">
                    <ElForm :model="edges" :inline="true" ref="edgeref" :rules="edgerules">
                        <ElFormItem prop="ori" label="起点">
                            <ElSelect v-model="edges.ori" style="width: 80px;">
                                <ElOption v-for="(item) in idSet"
                                :key="item"
                                :label="item"
                                :value="item"
                                ></ElOption>
                            </ElSelect>
                        </ElFormItem>
                        <ElFormItem prop="tar" label="终点">
                            <ElSelect v-model="edges.tar" style="width: 80px;">
                                <ElOption v-for="(setitem) in idSet"
                                :key="setitem"
                                :label="setitem"
                                :value="setitem"
                                ></ElOption>
                            </ElSelect>
                        </ElFormItem>
                        <ElFormItem prop="edge.time" label="权重">
                            <ElInput v-model="edges.edge.time" type="number" style="width: 80px;" min="1"></ElInput>
                        </ElFormItem>
                        <br/>
                        <ElFormItem prop="edge.carsid" label="允许小车">
                            <ElSelectV2 v-model="edges.edge.carsid"
                            :options="carOptions"
                            multiple
                            style="width: 250px;"
                            >
                            </ElSelectV2>
                        </ElFormItem>
                    </ElForm>
                    <ElCheckbox v-model="createBackEdge"  v-show="dlgEdgeType===0">同时添加反向路径</ElCheckbox>
                </div>
                <div style="padding: 20px;">
                    <ElText type="danger" v-show="msgRepeat">{{ msgRepeat }}<br/></ElText>
                    <ElButton type="primary" @click="DlgComfirm(3)">确定</ElButton>
                </div>
            </ElDialog>
            <ElDialog v-model="dlgCharge" title="新增充电点" style="width: fit-content;"
                @open="chargeref.clearValidate()">
            <div style="box-shadow:var(--el-box-shadow-lighter); padding:30px;margin: 10px;">
              <ElForm ref="chargeref" :model="charge" >
                <ElFormItem prop="pos" label="点号" :rules="[{ required: true, message: '未输入' }]" >
                    <ElInput v-model.number="charge.pos" type="number" style="width: 150px;"></ElInput>
                </ElFormItem>
              </ElForm>
            </div>
            
            <div style="padding: 20px;">
              <ElButton type="primary" @click="DlgComfirm(4)">确定</ElButton>
            </div>
            </ElDialog>
        </el-main>
      </el-container>
    </div>
  </template>
  
<script setup>
// 插件安装
import FileSaver from 'file-saver'
import {ArrowLeftBold, ArrowLeft} from '@element-plus/icons-vue'
import {ElButton, ElCheckbox, ElCollapse, ElCollapseItem,  ElFormItem, ElIcon, ElInput, ElMessageBox, ElOption, ElRadio, ElRadioGroup, ElSelect, ElSelectV2,  ElTable, ElTableColumn, ElTag, ElText } from 'element-plus';
import { ref,onMounted, computed} from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const selectflie=ref(null)
//小车数据
const carref=ref(null)
const car =ref({ip:'192.168.100.001',waitpos:0})
const carrules={
    ip:[{ required: true, message: '未输入', trigger: 'blur' }],
    waitpos:[{ required: true, message: '未输入', trigger: 'blur' }]
}
var carTmp={}
const carlist=ref([])
const dlgCar=ref(false);
const editCarTitle=ref("")
var dlgCarType=0;
//工位数据
const railposref=ref(null)
const railpos= ref({
        id:null,       //工位点号
        idPhysical:null,      //物理点号
        transfer:false, //允许换乘
        actdir:1, //动作方向0-无，1-左，2-右
        load:true,  //允许上料
        unload:true,//允许下料
        ip:"",      //ip
        port:null,    //端口
    })
const railposrules= {
    id:[{ required: true, message: '未输入', trigger: 'blur' },
        {validator:(rule,value,callback)=>{
            //判断工位号是否重复
            let bRepeat=false;
            railposlist.value.forEach((item)=>{
                if(item.id===value&&!(dlgRailposType!=0&&value===railposTmp.id))//跳过编辑
                    {
                        bRepeat=true;
                        return
                    }
            })
            if(bRepeat)
                callback(new Error('工位号已存在'))
            else
                callback()
        }}
    ],
    idPhysical:[{ required: true, message: '未输入', trigger: 'blur' }],
    transfer:[],
    actdir:[],
    load:[],
    unload:[],
    ip:[],
    port:[{type:'number',message:'请输入数字',trigger:'blur'}],
}
var railposTmp={}
const railposlist=ref([])
const dlgRailpos=ref(false)
const editRailposTitle=ref("")
var dlgRailposType=0;
const idSet=computed(()=>{
    let setarr=new Set()
    railposlist.value.forEach((item)=>{

        setarr.add(item.id)
    })
    return setarr
})
const idphSet=computed(()=>{
    let setarr=new Set()
    railposlist.value.forEach((item)=>{
        setarr.add(item.idPhysical)
    })
    
    return setarr
})
//充电点
const chargeref=ref(null)
const chargelist=ref(new Set())
const charge=ref({
    pos:null
})
const dlgCharge=ref(false);
//物理路径
const pathref=ref(null)
const path= ref({
    ori:null,  //起点 物理点
    tar:null,  //终点
    num:1,  //允许车辆数量
})
const pathrules={
    ori:[{ required: true, message: '未选择', trigger: 'blur' }],
    tar:[{ required: true, message: '未选择', trigger: 'blur' }],
    num:[{ required: true, message: '未输入', trigger: 'blur' }],
}
var pathTmp={}
const pathlist=ref([])
const dlgPath=ref(false)
const editPathTitle=ref("")
var dlgPathType=0;
const createBackPath=ref(false)
//逻辑路径 创建逻辑路径时需要检查相关的物理路径有没有创建
const edgeref=ref(null)
const edges= ref({
    ori:null,  //起点，工位点
    tar:null,  //终点
    edge:{
        carsid:[],  //允许车辆下标
        time:100,  //权重
    }
   
})
const edgerules={
    ori:[{ required: true, message: '未选择', trigger: 'blur' }],
    tar:[{ required: true, message: '未选择', trigger: 'blur' }],
    edge:{
        carsid:[{ validator:(rule,value,callback)=>{
        if(value.length<=0)
            callback(new Error('未选择'))
        else
            callback()
    },  trigger: 'blur' }],
        time:[{ required: true, message: '未输入', trigger: 'blur'}],
    }
}

var edgeTmp={}
const edgelist=ref([])
const dlgEdge=ref(false)
const editEdgeTitle=ref("")
var dlgEdgeType=0;
const carOptions=ref([])
const createBackEdge=ref(false)

const msgRepeat=ref(false)

onMounted(()=>{})
const GoMainPage=()=>{
    router.go(-1)
}
const AddBtn=(table)=>
{
    if(table===0)
    {//小车
        //打开编辑对话框
        dlgCarType=0
        car.value=JSON.parse(JSON.stringify(car.value))//深拷贝
        editCarTitle.value='添加小车'+(carlist.value.length+1).toString()
        dlgCar.value=true;
    }
    else if(table===1)
    {//工位
        dlgRailposType=0
        railpos.value=JSON.parse(JSON.stringify(railpos.value))//深拷贝
        editRailposTitle.value="新增工位点"
        dlgRailpos.value=true
    }
    else if(table===2)
    {//物理路径
        dlgPathType=0
        path.value=JSON.parse(JSON.stringify(path.value))//深拷贝
        editPathTitle.value="新增物理路径"
        dlgPath.value=true
    }
    else if(table===3)
    {//逻辑路径
        dlgEdgeType=0
        edges.value=JSON.parse(JSON.stringify(edges.value))//深拷贝
        editEdgeTitle.value="新增逻辑路径"
        dlgEdge.value=true
    }
    
}
const DelBtn=(table,index)=>
{
    if(table===0)
    {//小车
        carlist.value.splice(index,1);
        carOptions.value=Array.from(carlist.value.map((item,index)=>({
            value:index,
            label:index+1 })))
    }
    else if(table===1)
    {//工位
        railposlist.value.splice(index,1);
    }
    else if(table===2)
    {//物理路径
        pathlist.value.splice(index,1);
    }
    else if(table===3)
    {//逻辑路径
        edgelist.value.splice(index,1);
    }
    else if(table===4)
    {
        chargelist.value.delete(index)
    }
    
}
const DlgComfirm=async (table)=>{
    if(table===0)
    {//小车
        carref.value.validate((valid)=>{
            if(!valid)
            return;
            if(dlgCarType===0)
            {
                carlist.value.push(car.value)
                carOptions.value=Array.from(carlist.value.map((item,index)=>({
                value:index,
                label:index+1 })))
            }
            else
            {
                carTmp.ip=car.value.ip
                carTmp.waitpos=car.value.waitpos
            }
            dlgCar.value=false;
        })
    }
    else if(table===1)
    {//工位
        railposref.value.validate((valid)=>{
            if(!valid)
                return;
            if(dlgRailposType===0)
                railposlist.value.push(railpos.value)
            else
            {
                railposTmp.id=railpos.value.id;
                railposTmp.idPhysical=railpos.value.idPhysical;
                railposTmp.transfer=railpos.value.transfer;
                railposTmp.actdir=railpos.value.actdir; 
                railposTmp.load=railpos.value.load; 
                railposTmp.unload=railpos.value.unload;
                railposTmp.ip=railpos.value.ip;    
                railposTmp.port=railpos.value.port;   
            }
            dlgRailpos.value=false;
        })
    }
    else if(table===2)
    {//物理路径
        pathref.value.validate((valid)=>{
            if(!valid)
                return
            if(!CheckRepeat(true,dlgPathType,createBackPath.value))
                return
            else if(dlgPathType===0)
            {
                pathlist.value.push(path.value)
                if(createBackPath.value)
                {//添加反向路径
                    let revpath=JSON.parse(JSON.stringify(path.value))
                    revpath.ori=path.value.tar
                    revpath.tar=path.value.ori
                    pathlist.value.push(revpath)
                    
                }
            }
            else
            {
                pathTmp.ori=path.value.ori
                pathTmp.tar=path.value.tar
                pathTmp.num=path.value.num
            }
            dlgPath.value=false;
        })
    }
    else if(table===3)
    {//逻辑路径
        edgeref.value.validate((valid)=>{
            if(!valid)
                return
            if(!CheckRepeat(false,dlgEdgeType,createBackEdge.value))
                return
            else if(dlgEdgeType===0)
            {
                edgelist.value.push(edges.value)
                if(createBackEdge.value)
                {//添加反向路径
                    let revedge=JSON.parse(JSON.stringify(edges.value))
                    revedge.ori=edges.value.tar
                    revedge.tar=edges.value.ori
                    edgelist.value.push(revedge)
                }
            }
            else
            {
                edgeTmp.ori=edges.value.ori
                edgeTmp.tar=edges.value.tar
                edgeTmp.edge=edges.value.edge
            }
            dlgEdge.value=false;
        })
        
    }
    else if(table==4)
    {
        chargeref.value.validate((valid)=>{
            if(!valid)
                return
            chargelist.value.add(charge.value.pos)
            dlgCharge.value=false
        })

       
    }
}
const EditTable=(table,row)=>{
    console.log(table,row)
    if(table===0)
    {//小车
        editCarTitle.value='编辑小车'
        dlgCarType=1
        carTmp=row
        car.value=JSON.parse(JSON.stringify(row))//深拷贝
        dlgCar.value=true
    }
    else if(table===1)
    {//工位
        editRailposTitle.value="编辑工位点"
        dlgRailposType=1
        railposTmp=row
        railpos.value=JSON.parse(JSON.stringify(row))
        dlgRailpos.value=true
    }
    else if(table===2)
    {//物理路径
        editPathTitle.value="编辑物理路径"
        dlgPathType=1
        pathTmp=row
        path.value=JSON.parse(JSON.stringify(row))
        dlgPath.value=true
    }
    else if(table===3)
    {//逻辑路径
        editEdgeTitle.value="编辑逻辑路径"
        dlgEdgeType=1
        edgeTmp=row
        edges.value=JSON.parse(JSON.stringify(row))
        dlgEdge.value=true
    }
}
//导出json
const ExportJson=()=>{
    if (!ExportJsonRule()) return;
    const dataconfig = {
            cars: carlist.value || [], // 小车
            points: railposlist.value || [], // 工位
            phy_graph: [], // 物理路径
            edges: edgelist.value || [], // 逻辑路径
            charge: Array.from(chargelist.value) || [] // 充电点
        };

        const  pathmap=new Map()
        pathlist.value.forEach((item) => {
            if (!pathmap.has(item.ori)) {
                pathmap.set(item.ori, new Map());
            }
            pathmap.get(item.ori).set(item.tar, item.num);
        });

        pathmap.forEach((item,ori)=>{
            const objTarlist = [];
            item.forEach((num,tar)=>{
                objTarlist.push({ _map_key_: tar, maxnum: num });
            })
            dataconfig.phy_graph.push({ _map_key_: ori, _mapval_: objTarlist });
        })
        console.log(JSON.stringify(dataconfig))
        const data = JSON.stringify(dataconfig)
        const blob = new Blob([data], { type: 'application/json' })
        FileSaver.saveAs(blob, 'dataconfig.json')
}
//导出校验
// 导出校验
const ExportJsonRule=()=>{
    //经过校验才可以导出成功
    let haveOri=false
    let haveTar=false
    let haveCar=true
    let legalOriTar=true
    if(pathlist.value.length>0)
    {
        pathlist.value.forEach((pathitem)=>{
            railposlist.value.forEach((item)=>{
                if(item.idPhysical===pathitem.ori)
                        haveOri=true
                if(item.idPhysical===pathitem.tar)
                    haveTar=true
            })
            if(!haveOri||!haveTar)
                return;
           if(pathitem.ori===pathitem.tar)
            {
                legalOriTar=false
                return
            }
        })
        if(!haveOri)
        {
            ElMessageBox.alert("起点物理点不存在！","导出失败")
            return false
        }
        if(!haveTar)
        {
            ElMessageBox.alert("终点物理点不存在！","导出失败")
            return false
        }
        if(!legalOriTar)
        {
            ElMessageBox.alert("物理路径起点和终点一样！","导出失败")
            return false
        }
    }
    if(edgelist.value.length>0)
    {
        haveOri=false
        haveTar=false
        legalOriTar=true
        edgelist.value.forEach((edgeitem)=>{
            railposlist.value.forEach((item)=>{
                if(item.id===edgeitem.ori)
                    haveOri=true
                if(item.id===edgeitem.tar)
                    haveTar=true
            })
            if(!haveOri||!haveTar)
                return;
            if(edgeitem.ori===edgeitem.tar)
            {
                legalOriTar=false
                return
            }
            if(edgeitem.edge.carsid.length>0)
            {
                edgeitem.edge.carsid.forEach((caritem)=>{
                    if(caritem>=carlist.value.length)
                    {
                        haveCar=false;
                        return;
                    }
                })
            }
            if(!haveCar)
                return false
        })
        if(!haveOri)
        {
            ElMessageBox.alert("起点工位点不存在！","导出失败")
            return false
        }
            
        if(!haveTar)
        {
            ElMessageBox.alert("终点工位点不存在！","导出失败")
            return false
        }
        if(!haveCar)
        {
            ElMessageBox.alert("小车不存在！","导出失败")
            return false
        }
        if(!legalOriTar)
        {
            ElMessageBox.alert("逻辑路径起点和终点一样！","导出失败")
            return false
        }
    }
    return true
}
const CheckRepeat=(isPath, type,addRev)=>
{
    let bFlag=true;
    if(isPath)
    {
        pathlist.value.forEach((item)=>{
            if(item.ori===path.value.ori&&item.tar===path.value.tar)
            {
                if(type===0||!(pathTmp.ori===path.value.ori&&pathTmp.tar===path.value.tar))
                {//新增或编辑不同条件
                    msgRepeat.value="添加失败! 已存在相同起终点路径"
                    bFlag=false
                    return
                }
            }
            if(addRev)
            {
                if(item.ori===path.value.tar&&item.tar===path.value.ori)
                {
                    msgRepeat.value="添加反向路径失败！已存在相同起终点路径"
                    bFlag=false
                    return
                }
            }
        })
    }
    else{
        edgelist.value.forEach((item)=>{
            if(item.ori===edges.value.ori&&item.tar===edges.value.tar)
            {
                if(type===0||!(edgeTmp.ori===edges.value.ori&&edgeTmp.tar===edges.value.tar))
                {//新增或编辑不同条件
                    msgRepeat.value="添加失败! 已存在相同起终点路径"
                    bFlag=false
                    return
                }
            }
            if(addRev)
            {
                if(item.ori===edges.value.tar&&item.tar===edges.value.ori)
                {
                    msgRepeat.value="添加反向路径失败！已存在相同起终点路径"
                    bFlag=false
                    return
                }
            }
        })
    }
    return bFlag
}
const ImportJson=(event)=>{  
    const files = event.target.files
      if (files.length > 0) {
        const reader=new FileReader();
        reader.onload=(e)=>{
            let content = e.target.result;
            let jsondata= new Object()
            try {
                jsondata =JSON.parse(content)
            } catch (err) {
                ElMessageBox.alert("json数据解析异常","导入失败")
                return false
            }
            //将导入数据渲染到当前界面
            console.log(jsondata)
            getDatafromfile(jsondata)
        }
        reader.readAsText(files[0]);
      }
}
const getDatafromfile=(data)=>{
    if (!data)
        return;
    const { cars, points, edges, charge, phy_graph } = data;
    if (cars !== undefined) carlist.value = cars || [];
    if (points !== undefined) railposlist.value = points || [];
    if (edges !== undefined) edgelist.value = edges || [];
    if (charge !== undefined) chargelist.value = new Set(charge || []);

    if (phy_graph && Array.isArray(phy_graph))
    {
        pathlist.value=[]
        data.phy_graph.forEach((item)=>{
            item._mapval_.forEach((tar)=>{
                pathlist.value.push({ori:item._map_key_, tar:tar._map_key_,num:tar.maxnum})
            })
        })
    }
    console.log(chargelist.value)
}

</script>
<style >
    .table-row{
       width: 100%;
    }

    body{
        background-color: var(--el-color-primary-light-8);
    }
    .main-col{
        padding: 10px;
        background-color:var(--el-color-primary-light-9);
    }
    .card-title{
        padding-left: 10px;
        font-size: 20px;
        color: #3d3d3d;
    }
    .back-icon{
        color:gray;
    }
    .back-icon:hover{
        color:black;
    }
</style>