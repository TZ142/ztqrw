<template>
   <div class="common-layout">
    <el-container>
      <el-header style="background-color: var(--el-color-primary-light-7); margin-bottom: 5px; box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);">
        <div style="height: 100%;">
          <el-row style="height: 100%; align-items: center;">
            <el-col :span="3"><div /></el-col>
            <el-col :span="18"><div />
              <span style="font-size: 36px;color: #3d3d3d;">
                <ElButton 
                circle
                :type="isConnected?'success':'warning'" 
                :icon="isConnected?Check:Warning" 
                @click="ConnectServer"></ElButton>
                AGV小车控制界面
              </span>
            </el-col>
            <el-col :span="3"><div />
              <el-button size="large" :icon="Setting" circle @click="dlgGlobalSet=true" />
              <el-button v-show="gSets.setting" size="large" round @click="ToSetting" >配置</el-button>
            </el-col>
          </el-row>
        </div>
      </el-header>
      <el-main style="padding-top: 0px;">
        <div id="main">
         
          <ElRow>
            <ElCol :span="9">
              <div class="main-col">
                <ElCard style=" background:#f7fbfe;">
                  <template #header>
                    <div style="font-size: 25px; text-align: left;">
                      小车状态
                      <ElButton size="large" type="primary" plain  @click="dlgCmds=true">添加指令</ElButton>
                    </div>
                  </template>
                  <template #default>
                    <div class="msg-card-body">
                      <ElTable
                      max-height="77vh"
                      width="100%"
                      :data="carlist"
                      :span-method="carSpan"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      >
                        <ElTableColumn label="序号" width="55px">
                          <template #default="carRow" >
                            <ElIcon :color="carRow.row.connect?'#13ce66':'#ff4949'">
                              <component :is="carRow.row.connect?CircleCheck:Warning">
                              </component>
                            </ElIcon>
                            {{(carRow.$index)/2+1}}
                          </template>
                        </ElTableColumn>
                        <ElTableColumn property="ip" label="ip">
                          <template #default="carRow">
                            <div v-show="(carRow.$index)%2===0">{{carRow.row.ip}}</div>
                            <div v-show="(carRow.$index)%2===1">
                              <ElCollapse v-model="expand" >
                                <ElCollapseItem >
                                  <template #title>
                                    <div style="background-color:var(--el-color-warning-light-9)">
                                      {{ carRow.row.ctrlinfo }}
                                    </div>
                                  </template>
                                  <ElDivider style="margin: 5px; " border-style="dotted"></ElDivider>
                                  <div v-for="(item,index) in carRow.row.cmds " :key="index" style="padding-bottom: 5px;"
                                   @mouseover="carcmdhover=index,carrowhover=carRow.$index"
                                   @mouseleave="carcmdhover=0,carrowhover=0"
                                   >
                                    <div style="padding:10px;width: 100%;" :class="{selectcmd:SelectMetod(carRow.$index,index)}">
                                      <el-button style="width: 10%; margin: 0px;" type="primary" :icon="Delete" v-show="SelectMetod(carRow.$index,index)" @click="ClearCarCmds((carRow.$index)/2,index)" />
                                      {{ item }} 
                                    </div>
                                    <ElDivider style="margin: 0px;"></ElDivider>
                                  </div>
                                </ElCollapseItem>
                              </ElCollapse>
                             
                            </div>
                          </template>
                        </ElTableColumn>
                        <ElTableColumn label="路径">
                          <template #default="carRow">
                            <div v-show="carRow.row.curedge">
                              {{ carRow.row.curedge._1st_ }}->{{ carRow.row.curedge._2nd_ }}
                            </div>
                          </template>
                        </ElTableColumn>
                        <ElTableColumn property="freetime" label="空闲(秒)"></ElTableColumn>
                        <ElTableColumn width="150" label="操作" fixed="right">
                            <template #default="carRow" >
                              <ElButton type="primary" plain @click="ClearWarns(carRow.$index)" size="small">清除报警</ElButton>
                              <ElSwitch 
                                v-model="carRow.row.stop" 
                                inline-prompt
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                active-text="启动" 
                                inactive-text="暂停" 
                                :loading="changeLoading"
                                @change="(state)=>changeCarState(carRow.$index,state)"
                                :before-change="stopChange" />
                            </template>
                        </ElTableColumn>
                      </ElTable>
                    </div>
                  </template>
                </ElCard>
              </div>
            </ElCol>
            <ElCol :span="8" style="">
              <div class="main-col">
                <ElCard style=" background:#f7fbfe;">
                  <template #header>
                    <div style="font-size: 25px;text-align: left;">
                      工位状态
                    </div>
                  </template>
                  <template #default>
                    <div  class="msg-card-body">
                      <ElTable
                      max-height="77vh"
                      width="100%"
                      :data="poslist"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      >
                        <ElTableColumn label="连接" width="55px">
                          <template #default="posRow">
                            <ElIcon :color="posRow.row.connect?'#13ce66':'#ff4949'">
                              <component :is="posRow.row.connect?CircleCheck:Warning">
                              </component>
                            </ElIcon>
                          </template>
                        </ElTableColumn>
                        <ElTableColumn property="id" label="工位号"></ElTableColumn>
                        <ElTableColumn property="idPhysical" label="物理号">
                        </ElTableColumn>
                        <ElTableColumn align="right" width="160" label="状态">
                            <template #default="posRow" >
                              <ElTag :type="posRow.row.readyload?'success':'warning'" size="small" round effect="plain">上料准备</ElTag>
                              <ElTag :type="posRow.row.readyunld?'success':'warning'" size="small" round effect="plain">下料准备</ElTag>
                              <ElTag :type="posRow.row.beltload?'success':'warning'" size="small" round effect="plain">皮带上料</ElTag>
                              <ElTag :type="posRow.row.beltunld?'success':'warning'" size="small" round effect="plain">皮带下料</ElTag>
                            </template>
                        </ElTableColumn>
                      </ElTable>
                    </div>
                  </template>
                </ElCard>
              </div>
            </ElCol>
            <ElCol :span="7">
              <div class="main-col">
                <ElCard style=" background:#f7fbfe;">
                  <template #header>
                    <div style="font-size: 25px; text-align: left;">
                      待分配任务
                    </div>
                  </template>
                  <template #default>
                    <div  class="msg-card-body">
                      <ElTable
                      max-height="77vh"
                      width="100%"
                      :data="requestlist"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                      >
                        <ElTableColumn property="id" label="任务号" width="70px"></ElTableColumn>
                        <ElTableColumn property="info"></ElTableColumn>
                        <ElTableColumn width="160" label="操作" fixed="right">
                            <template #default="reqRow" >
                              <ElButton type="primary" plain @click="ClearReqs(reqRow.$index)" size="small">删除</ElButton>
                            </template>
                        </ElTableColumn>
                      </ElTable>
                    </div>
                  </template>
                </ElCard>
              </div>
            </ElCol>
          </ElRow>
          <ElDialog v-model="dlgCmds" title="AGV小车指令" style="width: fit-content;">
            <div style="box-shadow:var(--el-box-shadow-lighter); padding:30px 0px 10px 30px;margin: 10px;">
              <ElForm inline >
                <ElFormItem label="起点">
                  <ElSelect v-model="carCmd.ori" placeholder="选择" style="width: 100px;">
                    <ElOption v-for="(item, index) in poslist" :key="index" :label="item.id" :value="item.id"></ElOption>
                  </ElSelect>
                </ElFormItem>
                <ElFormItem label="动作">
                  <ElSelect v-model="carCmd.oriact" placeholder="选择" style="width: 100px;">
                    <ElOption v-for="(item) in moveType" :key="item.value" :label="item.label" :value="item.value"></ElOption>
                  </ElSelect>
                </ElFormItem>
              </ElForm>
              <ElIcon size="20" style="margin-right: 20px;">
                <Bottom/>
              </ElIcon>
              <ElForm inline>
                <ElFormItem label="终点">
                  <ElSelect v-model="carCmd.tar" placeholder="选择" style="width: 100px;">
                    <ElOption v-for="(item, index) in poslist" :key="index" :label="item.id" :value="item.id"></ElOption>
                  </ElSelect>
                </ElFormItem>
                <ElFormItem label="动作">
                  <ElSelect v-model="carCmd.taract" placeholder="选择" style="width: 100px;">
                    <ElOption v-for="(item) in moveType" :key="item.value" :label="item.label" :value="item.value"></ElOption>
                  </ElSelect>
                </ElFormItem>
              </ElForm>
            </div>
            <div style="padding: 20px;">
              <ElButton type="primary" @click="addCmd">添加</ElButton>
              <ElButton type="primary" @click="dlgCmds=false">取消</ElButton>
            </div>
          </ElDialog>
          <ElDialog v-model="dlgGlobalSet" title="全局设置">
            <div style="box-shadow:var(--el-box-shadow-lighter); padding:30px 0px 10px 30px;margin: 10px;">
              <ElForm inline :model="gSets">
                <ElFormItem prop="ip" label="ip">
                 <ElInput v-model="gSets.ip"></ElInput>
                </ElFormItem>
                <ElFormItem prop="port" label="端口">
                  <ElInput v-model.number="gSets.port" type="number" style="width: 100px;"></ElInput>
                </ElFormItem>
                <br/>
                <ElFormItem prop="timeout" label="超时(毫秒)">
                  <ElInput v-model.number="gSets.timeout" type="number" style="width: 120px;"></ElInput>
                </ElFormItem>
                <ElFormItem prop="setting" label="配置界面">
                  <el-switch v-model="gSets.setting" />
                </ElFormItem>
              </ElForm>
            </div>
            <div style="padding: 20px;">
              <ElButton type="primary" @click="ComfirmSet">设置</ElButton>
              <ElButton type="primary" @click="dlgGlobalSet=false">取消</ElButton>
            </div>
          </ElDialog>
        </div>
      </el-main>
    </el-container>
  </div>

</template>

<script setup>
import { ref,onMounted, toRaw, vShow, onUnmounted} from 'vue'
import {Delete,Check,Warning,Bottom, Setting} from '@element-plus/icons-vue'
import {ElButton, ElCard, ElCol, ElRow, ElSwitch,ElMessage, ElCollapse, ElCollapseItem, ElIcon, ElTag, ElDivider, ElScrollbar, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElTable, ElTableColumn, ElInput } from 'element-plus';
import {AgvGet,AgvPost,Refreshhttp} from "../../http/api/AgvApi"
import {config,Refresh} from "../../http/http"
import { useRouter } from 'vue-router';
const router = useRouter();
//全局设置参数
const dlgGlobalSet=ref(false)
const gSets=ref({
  ip:"127.0.0.1",
  port:8080,
  timeout:10000,
  setting:false
})
const expand=ref(['expand']);//小车任务折叠面板默认展开
const timer=ref(null);//定时器标志
const carcmdhover=ref(0)
const carrowhover=ref(0)
//小车
const carlist=ref([])
const car=ref({
  curedge:{ //当前在哪一条边
    _1st_:null,
    _2nd_:null
  },
  freetime:0,//空闲时间
  connect:false,  //连接状态
  ip:"",          //IP地址
  stop:false,    //小车启动状态
  ctrlinfo:"",  //警告信息
  cmds:[],      //小车任务
})
const carSpan=({row,col,rowIndex,columnIndex})=>{ //小车列表合并函数
  
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return [2,1]
    } 
    else {
      return [0,0]
    }
  }else if(columnIndex===1)
  {
    if (rowIndex%2 === 1) {
      return [1,4]
    }
  }else
  {
    if (rowIndex%2 === 1) {
      return [0,0]
    }

  }
}
const carRunState=ref(true) //小车启动状态
const isConnected=ref(false)   //连接服务器状态
const changeLoading=ref(false) //开关消息请求中
//创建小车指令对话框
const dlgCmds=ref(false)
const carCmd=ref({  //任务
  ori:null,
  tar:null,
  oriact:0,
  taract:0
})
const moveType=ref(
  [{
    value:0,
    label:"上料"
  },{
    value:1,
    label:"移动"
  },{
    value:2,
    label:"下料"
  }]
)
//工位
const poslist=ref([])
const pos=ref({
  id:null,
  idPhysical:null,
  readyload:false,
  readyunld:false,
  beltload:false,
  beltunld:false,
  connect:false,
})
//任务
const requestlist=ref([])
const request=ref({
  id:null,
  info:""
})
//刷新页面
onMounted(()=>{
  history.pushState(null, null, document.URL);
  let str=localStorage.getItem("gSets")
  if(str)
    gSets.value=JSON.parse(str)
  ComfirmSet()
})
onUnmounted(()=>{
  StopTimer()
})
const StartTimer=()=>{
  timer.value=setInterval(()=>{
    ConnectServer()
  },1000)
}
const StopTimer=()=>{
  clearInterval(timer.value)
}
const ToSetting=()=>{
  router.push('/setting')
}
//连接服务器，获取配置数据
const ConnectServer=()=>{
  AgvGet(6).then((data)=>{
      //console.log("getJson:",data)
      if(data!=undefined)
      {
        isConnected.value=true
        carlist.value=[]
        data.cars.forEach(element => {
          carlist.value.push(element)
          carlist.value.push(element)
        });
        poslist.value=data.pos
        requestlist.value=data.request
        if(!timer.value)
        {
          ElMessage.success("刷新成功")
          StartTimer()
        }
      }
      else{
        isConnected.value=false
        ElMessage.error("刷新失败")
        StopTimer()
      }
  })
}
//清除报警
const ClearWarns=(index)=>{
  if(!stopChange())
    return
  const obj={car:index/2}
    AgvPost(5,obj).then((data)=>{
    if(data==undefined||data.eid!==0)
      ElMessage.error('请求失败！')
    else
      ElMessage.success('请求成功！')
  })
}
//小车启动/停止
const changeCarState=(index,bState)=>
{
  console.log(bState)
  changeLoading.value=true
  //向服务器请求
  const obj={car:index/2, stop:bState}
    AgvPost(3,obj).then((data)=>{
      console.log(data)
    if(data==undefined||data.eid!==0)
    {
      ElMessage.error('请求失败！')
      carRunState.value=!bState
    }
    changeLoading.value=false;
  })
}
const stopChange=()=>{
  if(!isConnected.value)
    {
      ElMessage.error('处于未连接状态，无法发送请求！')
      return false
    }
    
  return true
}
//添加指令
const addCmd=()=>{
  if(!stopChange())
    return
  AgvPost(4,toRaw(carCmd.value)).then((data)=>{

    if(data!==undefined&&data.eid===0)
      {
        ElMessage.success("添加成功")
        ConnectServer()
      }
      else
      {
        ElMessage.error("添加失败")
      }
  })
}
//清除未分配任务
const ClearReqs=(index)=>{
  if(!stopChange())
    return
  let obj={
    id:requestlist.value[index].id
  }
  AgvPost(2,obj).then((data)=>{

    if(data!==undefined&&data.eid===0)
      {
        ElMessage.success("清除成功")
      }
      else
      {
        ElMessage.error("清除失败")
      }
  })
}
const SelectMetod=(row,index)=>{
  return row === carrowhover.value && index >= carcmdhover.value && index>0;
}
const ClearCarCmds=(row,index)=>{
  if(!stopChange())
    return
  let obj={
    car:row,
    cmdid:index
  }
  AgvPost(1,obj).then((data)=>{
    console.log(carlist.value.at(row).cmds[index]);
    if(data!==undefined&&data.eid===0)
      {
        ElMessage.success("清除成功")
      }
      else
      {
        ElMessage.error("清除失败")
      }
  })
}

const ComfirmSet=()=>{
  if(gSets.value.ip.includes("http://",0))
    config.baseURL =gSets.value.ip+':'+ gSets.value.port.toString()
  else
  config.baseURL ="http://"+ gSets.value.ip+':'+ gSets.value.port.toString()
  config.timeout =  gSets.value.timeout
  localStorage.setItem("gSets",JSON.stringify( gSets.value))
  Refreshhttp()
  ConnectServer()
}

</script>

<style>
.selectcmd{
  background-color: #eee;
}
.msg-card-body{
  height: 78vh;
  overflow-y: auto;
}
.display-hide{
  display: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
}
.el-collapse-item__header {
    line-height: 30px;
    height: auto;
    padding: 10px 0;
    }
body{
  background-color: var(--el-color-primary-light-8);
}
.main-col{
  padding: 10px;
  background-color:var(--el-color-primary-light-9);
}

</style>

