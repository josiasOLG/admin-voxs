import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public set(key: string, value: string): void {
    if (this.isClient()) {
      localStorage.setItem(key, value);
    }
  }

  public get(key: string): string | null {
    if (this.isClient()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  public remove(key: string): void {
    if (this.isClient()) {
      localStorage.removeItem(key);
    }
  }

  public clear(): void {
    if (this.isClient()) {
      localStorage.clear();
    }
  }

  public exists(key: string): boolean {
    return this.get(key) !== null;
  }

  public setObject(key: string, value: any): void {
    this.set(key, JSON.stringify(value));
  }

  public getObject<T>(key: string): T | null {
    const value = this.get(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
