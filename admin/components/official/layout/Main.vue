<template>
  <div class="main">
    <Scrollbar max-height="calc(100vh - 60px - 40px)">
      <slot></slot>
    </Scrollbar>
  </div>
</template>
<style lang="less" scoped>
.main {
  width: calc(100vw - 40px - 20px - 200px);
  min-width: calc(1200px - 40px - 20px - 200px);
  height: calc(100vh - 60px - 40px);
  position: absolute;
  top: 80px;
  left: 240px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
