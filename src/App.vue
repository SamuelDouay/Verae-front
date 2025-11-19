<script setup lang="ts">
</script>

<template>
  <header>

    <Button>TEST</Button>

<Checkbox binary />
  </header>

  <FloatLabel variant="on">
    <InputText id="on_label"  autocomplete="off" />
    <label for="on_label">On Label</label>
</FloatLabel>

<Form v-slot="$form" class="flex flex-col gap-4 w-full sm:w-60">
    <div class="flex flex-col gap-1">
        <InputText name="username" type="text" placeholder="Username" fluid />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error.message }}</Message>
    </div>
    <div class="flex flex-col gap-1">
        <Password name="password" placeholder="Password" :feedback="false" toggleMask fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
            <ul class="my-0 px-4 flex flex-col gap-1">
                <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
            </ul>
        </Message>
    </div>
    <Button type="submit" severity="secondary" label="Submit" />
</Form>

<Card style="width: 25rem; overflow: hidden">
    <template #header>
        <img alt="user header" src="@/assets/logo.svg" />
    </template>
    <template #title>Advanced Card</template>
    <template #subtitle>Card subtitle</template>
    <template #content>
        <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
            quas!
        </p>
    </template>
    <template #footer>
        <div class="flex gap-4 mt-1">
            <Button label="Cancel" severity="secondary" variant="outlined" class="w-full" />
            <Button label="Save" class="w-full" />
        </div>
    </template>
</Card>
</template>

<style scoped></style>
