<script lang="ts" setup>
import { ref } from 'vue';
// import { i18nextInit, i18nextPageTitle } from '@ktlib/i18n-utils';

// console.log(i18nextInit);

const foo = '王五';
const codition = ref(true);
const fruit = `请问你喜欢的水果是:${codition.value ? '苹果' : '梨'}`;

// const handleChangeLang = () => {
//   i18next.changeLanguage(i18next.language === 'zh-CN' ? 'en-US' : 'zh-CN');
// };
</script>

<template>
  <view :id="`张三`"></view>
  <view>{{ '李四' }}</view>
  <view>{{ '我叫' }}{{ foo }}</view>
  <view>
    {{ `请问你喜欢的水果是:${codition ? '苹果' : '梨'}` }}
  </view>
  <nut-button type="primary">改变语言</nut-button>
</template>

<style lang="scss" module>
.index {
}
</style>
