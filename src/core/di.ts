export type Factory<T> = () => T;

export class Container {
  private readonly factories = new Map<unknown, Factory<unknown>>();
  private readonly singletonTokens = new Set<unknown>();
  private readonly singletons = new Map<unknown, unknown>();

  register<T>(token: unknown, factory: Factory<T>): void {
    this.factories.set(token, factory as Factory<unknown>);
    this.singletonTokens.delete(token);
    this.singletons.delete(token);
  }

  registerSingleton<T>(token: unknown, factory: Factory<T>): void {
    this.factories.set(token, factory as Factory<unknown>);
    this.singletonTokens.add(token);
    this.singletons.delete(token);
  }

  resolve<T>(token: unknown): T {
    if (this.singletonTokens.has(token) && this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }
    const factory = this.factories.get(token);
    if (!factory) throw new Error(`No dependency registered for token: ${String(token)}`);
    const instance = factory() as T;
    if (this.singletonTokens.has(token)) this.singletons.set(token, instance);
    return instance;
  }
}
