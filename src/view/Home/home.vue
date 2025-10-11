<template>
    <div class="carousel-container">
        <a-carousel autoplay>
            <div v-for="(item, index) in images" :key="index" class="carousel-slide">
                <img :src="item.src" :alt="item.alt" />
            </div>
        </a-carousel>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const images = ref([
    { src: 'http://127.0.0.1:1123/dana-files/1.gif', alt: 'Slide 1' },
    { src: 'http://127.0.0.1:1123/dana-files/2.jpg', alt: 'Slide 2' },
    { src: 'http://127.0.0.1:1123/dana-files/3.jpg', alt: 'Slide 3' },
]);
</script>

<style scoped>
.carousel-container {
    width: 100%;
    /* max-width: 800px; */
    /* 最大宽度可自定义 */
    margin: 0 auto;
    /* 居中 */
}

.carousel-slide {
    display: flex;
    justify-content: center;
    /* 中心对齐图片 */
    align-items: center;
    /* 中心对齐图片 */
    height: 500px;
    /* 高度可以自定义 */
}

.carousel-slide img {
    max-width: 100%;
    /* 自适应宽度 */
    height: auto;
    /* 自适应高度 */
}
</style>