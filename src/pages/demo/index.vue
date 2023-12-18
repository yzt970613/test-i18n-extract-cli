<script lang="ts" setup>
import { ref, reactive } from 'vue';
</script>
<template>
  <view class="mx-[32px]">
    <view>
      <navigator url="/pages/demo/i18n/index" class="mt-[20px]">
        <nut-button type="success" class="!mt-[20px]" :block="true">
          i18n
        </nut-button>
      </navigator>
    </view>
  </view>
</template>
<style lang="scss" module>
.index {
}
</style>
