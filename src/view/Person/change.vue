<template>
    <a-card title="个人信息" style="max-width: 400px; margin: auto;">
        <a-form :form="form" @submit="handleSubmit">
            <a-form-item label="账号" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <a-input disabled v-model:value="form.uid" placeholder="请输入账号" />
            </a-form-item>
            <a-form-item label="姓名" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <a-input v-model:value="form.name" placeholder="请输入姓名" />
            </a-form-item>
            <a-form-item label="头像" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <a-avatar :size="64" :src="url + avatarUrl" alt="avatar" style="cursor: pointer; margin-bottom: 8px;" />

            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                <a-upload accept="image/*" :before-upload="beforeUpload" :show-upload-list="false" v-model="avatarFile">
                    <div>
                        <a-button type="primary">上传头像</a-button>
                    </div>
                </a-upload>
                <a-button style="margin-left: 10px;" type="primary" html-type="submit">保存</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import { uploadAvatar } from '@/api/upload'
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore()
const form = ref<{
    uid: string,
    name: string,
}>({
    name: '',
    uid: '',
});
const userInfo = reactive(JSON.parse(sessionStorage.getItem('user') || '{}'))
const url = import.meta.env.VITE_API_BASE_URL
onMounted(() => {
    console.log(userInfo,'个人信息')
    avatarUrl.value = userInfo.avatar
    form.value.uid = userInfo.uid
    form.value.name = userInfo.name
})
const avatarFile = ref<UploadFile | null>(null);
const avatarUrl = ref<string | null>(null);

// 处理头像上传
const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        // 显示错误信息
        return false;
    }
    avatarFile.value = file;
    console.log(avatarFile.value)
    avatarUrl.value = URL.createObjectURL(file); // 生成临时URL

    console.log(avatarUrl.value)
    return false; // 返回false以防止自动上传
};

// 提交表单
const handleSubmit = async (e: Event) => {
    e.preventDefault();
    console.log('提交的个人信息:', form.value);
    console.log('上传的头像文件:', avatarFile.value);
    const data = await uploadAvatar(avatarFile.value,form.value.name)
    console.log(data)
    if (data?.code === '0') {
        message.success('更新成功')
        sessionStorage.setItem('user', JSON.stringify(data?.data))
        userStore.setUserInfo(data?.data)
    }
    // 在这里可以处理表单提交逻辑，比如发送请求到后端
};
</script>

<style scoped>
.avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
}
</style>