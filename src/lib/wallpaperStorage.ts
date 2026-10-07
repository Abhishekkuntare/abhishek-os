const DB_NAME = 'AbhishekOS_Wallpapers_v1';
const STORE_NAME = 'wallpapers';
const MEDIA_KEY = 'custom';
export const LOCK_SCREEN_WALLPAPER_KEY = 'lock-screen';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open wallpaper storage'));
  });
}

export async function saveCustomWallpaper(
  blob: Blob,
  key: string = MEDIA_KEY,
): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(blob, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Unable to save wallpaper'));
  });
  database.close();
}

export async function getCustomWallpaper(
  key: string = MEDIA_KEY,
): Promise<Blob | null> {
  const database = await openDatabase();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve((request.result as Blob | undefined) || null);
    request.onerror = () => reject(request.error || new Error('Unable to read wallpaper'));
  });
  database.close();
  return blob;
}
