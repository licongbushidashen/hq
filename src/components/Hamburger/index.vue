<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path d="M880 800c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H144c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h736zM576 587c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H144c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h432z m320.657-205.062c5.899-4.6 14.403-0.498 14.403 6.9v246.178c0 7.4-8.603 11.495-14.403 6.896L740.372 518.826c-4.496-3.5-4.496-10.297 0-13.796zM576 373c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H144c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h432z m304-213c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H144c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h736z" p-id="5059" fill="#409eff" />   </svg>

  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 52px;
  height: 36px;
  padding: 0px 15px;
    position: absolute;
    bottom: 10px;
    right: 2px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
