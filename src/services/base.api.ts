import { apiService } from './api';

export class BaseService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  constructor(protected endpoint: string) {}

  async getAll(): Promise<T[]> {
    return apiService.http.get<T[]>(`/${this.endpoint}`);
  }

  async getById(id: string | number | undefined): Promise<T> {
    return apiService.http.get<T>(`/${this.endpoint}/${id}`);
  }

  async create(data: CreateDto): Promise<T> {
    return apiService.http.post<T>(`/${this.endpoint}`, data);
  }

  async update(id: string | number, data: UpdateDto): Promise<T> {
    return apiService.http.put<T>(`/${this.endpoint}/${id}`, data);
  }

  async delete(id: string | number): Promise<void> {
    return apiService.http.delete<void>(`/${this.endpoint}/${id}`);
  }

  async getCount(): Promise<number> {
    return apiService.http.get<number>(`/${this.endpoint}/count`);
  }

  // Méthode optionnelle pour les requêtes paginées
  async getPaginated(page: number, limit: number): Promise<{ data: T[]; total: number }> {
    return apiService.http.get<{ data: T[]; total: number }>(
      `/${this.endpoint}?page=${page}&limit=${limit}`
    );
  }
}
