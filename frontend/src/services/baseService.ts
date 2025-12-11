import type { http as _http } from '~/api/httpWrapper';

type ParamMap = Record<string, string>;

export class BaseService<TEntity, TQuery extends Record<string, any>, TResponse> {
  constructor(
    private http: typeof _http,
    private resource: string,
    private paramMap: ParamMap = {}
  ) {}

  create(payload: Partial<TEntity>) {
    return this.http.post(this.resource, { json: payload }).json<TEntity>();
  }

  index(query: TQuery): Promise<TResponse> {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value == null) continue;

      const mapped = this.paramMap[key] ?? key;
      params.set(mapped, String(value));
    }

    return this.http.get(`${this.resource}?${params.toString()}`).json<TResponse>();
  }

  show(id: number | string) {
    return this.http.get(`${this.resource}/${id}`).json<TEntity>();
  }

  update(id: number | string, payload: Partial<TEntity>) {
    return this.http.put(`${this.resource}/${id}`, { json: payload }).json<TEntity>();
  }

  destroy(id: number | string) {
    return this.http
      .delete(`${this.resource}/${id}`)
      .json<EntityResponse<typeof this.resource, TEntity>>();
  }
}
