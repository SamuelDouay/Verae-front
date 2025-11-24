<template>
  <Card>
    <template #header>
      <h3>Welcome Back!</h3>
    </template>
    <template #content>
      <Form>
        <FloatLabel variant="on">
          <InputText id="email" />
          <label for="email">Email</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <Password id="password" :feedback="false" toggleMask />
          <label for="password">Password</label>
        </FloatLabel>
        <Button type="submit" label="Login" />
        <Button type="button" severity="secondary" @click="navigateToRegister" label="Register" />
      </Form>
    </template>
    <template #footer>
      <small>&copy; 2024 Verae Inc.</small>
    </template>
  </Card>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToRegister = () => {
  router.push('/register')
}
</script>

<style scoped></style>
