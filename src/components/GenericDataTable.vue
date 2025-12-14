<template>
  <div class="generic-data-table">
    <DataTable
      :value="data"
      :loading="loading"
      :paginator="paginator"
      :rows="rowsPerPage"
      :total-records="totalRecords"
      @page="onPageChange"
    >
      <template #header>
        <div class="table-header">
          <h2>{{ title }}</h2>
          <div v-if="showSearch" class="search-container">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="searchTerm" placeholder="Rechercher..." />
            </IconField>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox" />
          <p>Aucune donnée disponible</p>
        </div>
      </template>

      <template #loading>
        <div class="loading-state">
          <ProgressSpinner />
          <p>Chargement...</p>
        </div>
      </template>

      <Column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="column.sortable"
      >
        <template #body="slotProps" v-if="column.format">
          {{ formatValue(slotProps.data[column.field], column.format) }}
        </template>
      </Column>

      <template #footer v-if="showFooter">
        <div class="table-footer">
          <span>Total: {{ totalRecords }} éléments</span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, onMounted, watch } from 'vue'
import { ColumnConfig } from '@/types/table'
import type { DataTablePageEvent } from 'primevue/datatable'

type FormatType =
  | 'date'
  | 'boolean'
  | 'capitalize'
  | 'truncate'
  | 'percentage'
  | ((value: unknown) => string)

interface Props<T> {
  title: string
  columns: ColumnConfig<T>[]
  fetchFunction: () => Promise<T[]>
  paginator?: boolean
  rowsPerPage?: number
  showSearch?: boolean
  showFooter?: boolean
  initialSortField?: keyof T
  initialSortOrder?: 1 | -1
}

const props = withDefaults(defineProps<Props<T>>(), {
  paginator: false,
  rowsPerPage: 10,
  showSearch: false,
  showFooter: false,
  initialSortOrder: 1,
})

const data = ref<T[]>([])
const loading = ref(false)
const error = ref<string>('')
const searchTerm = ref('')
const currentPage = ref(1)
const totalRecords = ref(0)

const formatValue = (value: unknown, format?: FormatType): string => {
  if (value === null || value === undefined) return ''

  if (typeof format === 'function') {
    return format(value)
  }

  switch (format) {
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }
      // Vérifier que value est string ou number avant de créer une Date
      if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value).toLocaleDateString()
      }
      return String(value)
    case 'boolean':
      return value ? 'Oui' : 'Non'
    case 'capitalize':
      return String(value).charAt(0).toUpperCase() + String(value).slice(1)
    case 'truncate':
      return String(value).length > 50 ? String(value).substring(0, 50) + '...' : String(value)
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value)
    default:
      return String(value)
  }
}

const onPageChange = (event: DataTablePageEvent) => {
  currentPage.value = event.page + 1
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    const result = await props.fetchFunction()
    data.value = result
    totalRecords.value = result.length
  } catch (err: unknown) {
    error.value = 'Erreur de chargement des données.'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

watch(
  () => props.fetchFunction,
  () => {
    loadData()
  },
)

defineExpose({
  refresh: loadData,
})
</script>

<style scoped>
.generic-data-table {
  margin-bottom: 2rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.search-container {
  width: 300px;
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-color-secondary);
}

.empty-state i,
.loading-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid var(--surface-border);
}
</style>
