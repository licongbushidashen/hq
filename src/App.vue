<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>

.jdcx label{
  font-family: 宋体;
      color: #606266 !important;
      margin-right: 18px;
    min-width: 100px;
    display: inline-block;
}
.avatar-uploader{
        margin-left: 137px;
    position: relative;
    top: -39px;
    width: 180px;
}
.bt{
  color: red;
  margin-right: 2px;
    vertical-align: middle;
}
label{
  font-weight: 100 !important;
}
.el-dialog__body{
  text-align: center;
}
.wy_disable input{
  cursor: grab !important;
background-color:#FFFFFF !important ;
    color: #606266 !important;
}
.wy_disable:hover .el-input__suffix{
     transform: rotate(180deg);
}
.el-input__suffix{
      line-height: 40px !important;
}
.el-select-dropdown__item{
  padding-left: 20px !important;
}
.color-select-layer{
      margin-left: 105px !important;
}
</style>
