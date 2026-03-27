import { NotificationStore } from '../store/notificationStore.js';
import { describe, expect, it } from 'vitest';

describe('NotificationStore', () => {
  it('adds notifications and enforces maxVisible', () => {
    const store = new NotificationStore({ maxVisible: 2 });
    store.add({ title: 'First' });
    store.add({ title: 'Second' });
    store.add({ title: 'Third' });
    const state = store.getState();
    expect(state.notifications.length).toBe(2);
    expect(state.notifications[0].title).toBe('Second');
    expect(state.notifications[1].title).toBe('Third');
  });

  it('moves overflowed notifications to history', () => {
    const store = new NotificationStore({ maxVisible: 2 });
    store.add({ title: 'First' });
    store.add({ title: 'Second' });
    store.add({ title: 'Third' });

    const state = store.getState();
    expect(state.history.length).toBe(1);
    expect(state.history[0].title).toBe('First');
  });

  it('dismisses notifications and adds to history', () => {
    const store = new NotificationStore({ maxVisible: 2 });
    const n1 = store.add({ title: 'A' });
    store.dismiss(n1.id);
    const state = store.getState();
    expect(state.notifications.length).toBe(0);
    expect(state.history.length).toBe(1);
    expect(state.history[0].title).toBe('A');
  });

  it('clears all notifications and moves them to history', () => {
    const store = new NotificationStore({ maxVisible: 2 });
    store.add({ title: 'A' });
    store.add({ title: 'B' });
    store.clearAll();
    const state = store.getState();
    expect(state.notifications.length).toBe(0);
    expect(state.history.length).toBe(2);
  });

  it('restores notifications from history', () => {
    const store = new NotificationStore({ maxVisible: 2 });
    const n1 = store.add({ title: 'A' });
    store.dismiss(n1.id);
    store.restore(n1.id);
    const state = store.getState();
    expect(state.notifications.length).toBe(1);
    expect(state.notifications[0].title).toBe('A');
    expect(state.history.length).toBe(0);
  });

  it('updates notifications by id', () => {
    const store = new NotificationStore();
    const n1 = store.add({ title: 'A', message: 'Old' });
    store.update({ id: n1.id, message: 'New' });
    const state = store.getState();
    expect(state.notifications[0].message).toBe('New');
  });
});
