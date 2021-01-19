<template>
  <transition name="modal" v-if="isVisible()">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
            <slot name="close-button">
              <button class="modal-default-close" @click="close">
                X
              </button>
            </slot>
          </div>
          <slot name="content"></slot>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  data: () => {
    return { showModal: true };
  },
  props: ["show"],
  methods: {
    isVisible() {
      return this.showModal && this.show;
    },
    close() {
      this.showModal = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 300px;
  margin: 0px auto;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.modal-default-close {
  width: 44px;
  height: 44px;
}
</style>
