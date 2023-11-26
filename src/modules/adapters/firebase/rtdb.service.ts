import { Injectable } from '@nestjs/common';
import { Database } from 'firebase-admin/lib/database/database';
import { app } from './firebase';

@Injectable()
export class RtdbService {
  private db: Database;

  constructor() {
    this.db = app.database();
  }

  getRef(path: string) {
    return this.db.ref(path);
  }

  createRef(path: string) {
    return this.db.ref(path).push();
  }

  async create<T>(path: string, value: T, options?: { addId?: boolean }) {
    const newRef = this.db.ref(path).push();

    const id = newRef.key;
    const newValue = options?.addId ? { ...value, id } : value;

    await newRef.set(newValue);

    return newValue;
  }

  async findOne<T>(path: string, key: string, value: any) {
    const ref = this.db.ref(path);

    const data = await ref.orderByChild(key).startAt(value).once('value');

    return data.val() as T;
  }

  async updateOne(path: string, key: string, value: any, update: any) {
    const ref = this.db.ref(path);

    const data = await ref.orderByChild(key).startAt(value).once('value');
    const dataObj = data.val();

    if (!dataObj) return;

    const keyToUpdate = Object.keys(dataObj)[0];

    await ref.child(keyToUpdate).update(update);

    return update;
  }

  async updateByPathOrCreate(path: string, value: any) {
    const ref = this.db.ref(path);

    await ref.set(value);
  }

  async updateByPath(path: string, value: any) {
    const ref = this.db.ref(path);

    await ref.update(value);
  }
}
