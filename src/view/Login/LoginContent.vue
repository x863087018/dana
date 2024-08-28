<template>

  <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
    autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" style="padding-top: 20px;">
    <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item label="验证码" name="verificationCode" :rules="[{ required: true, message: '请输入验证码' }]"
      :wrapper-col="{ span: 16 }">
      <div class="boxs"> <a-input v-model:value="formState.verificationCode" style="width:150px" />
        <div class="check-img" @click="getImg"><img style="width: 100%;height: 100%;" :src="imageBase64" /></div>
      </div>
    </a-form-item>



    <a-form-item name="remember" :wrapper-col="{ offset: 5, span: 16 }">
      <div class="boxs"><a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
        <div style="color:#007bff">忘记密码？</div>
      </div>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" @click="submit" :loading="submitLoading">登录</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { captchaGetImg, login } from '@/api/login';
import { loginReq } from '@/api/login/type';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { onMounted } from "vue";
import { useRouter } from 'vue-router';
const formRef = ref()
onMounted(() => {
  getImg()
})
const getImg = async () => {
  const { code, data } = await captchaGetImg()
  if (data?.imageBase64) {
    imageBase64.value = data.imageBase64
  }
  if (data?.id) {
    imgId.value = data.id
  }
}
const router = useRouter()
const submitLoading = ref<boolean>(false)
const submit = () => {
  formRef.value.validate().then(async () => {
    submitLoading.value = true
    const query: loginReq = {
      uid: formState.username,
      password: formState.password,
      answer: formState.verificationCode,
      id: imgId.value
    }
    const { code, data } = await login(query)
    submitLoading.value = false
    if (data === '验证码错误' || data === '账号或密码错误') {
      formState.verificationCode = ''
      getImg()
    }
    if (code === '0') {
      sessionStorage.setItem('isLogin', '1')
      sessionStorage.setItem('spaceToken', data?.token)
      message.success('登录成功')
      router.push('/')
    }
  }).catch((e: any) => {
    console.log(e)
  }).finally(() => {

  })
}
const imgId = ref<string>('')
const imageBase64 = ref<string>()
interface FormState {
  username: string;
  password: string;
  remember: boolean;
  verificationCode: string;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
  verificationCode: '',
});

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
<style scoped lang="scss">
.boxs {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.check-img {
  // float: right;
  border: 1px solid;
  height: 30px;
  width: 100px;
}
</style>