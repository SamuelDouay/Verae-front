<template>
  <Card>
    <template #header>
      <h3>Create an Account</h3>
    </template>
    <template #content>
      <Form>
        <FloatLabel variant="on">
          <InputText id="name" />
          <label for="name">Name</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="surname" />
          <label for="rsuname">Surname</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="email" />
          <label for="email">Email</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <Password id="password" :feedback="false" toggleMask />
          <label for="password">Password</label>
        </FloatLabel>
        <Button type="submit" label="Register" />
        <Button type="button" severity="secondary" @click="navigateToLogin" label="Login" />
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

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped></style>
