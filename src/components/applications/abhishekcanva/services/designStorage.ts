import { DesignDocument, DesignPage, DesignElement } from '../types/design';

const STORAGE_KEY = 'abhishekcanva-designs';
const RECENT_DESIGNS_KEY = 'abhishekcanva-recent';
const MAX_RECENT_DESIGNS = 10;

export class DesignStorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'AbhishekCanvaDB';
  private readonly DB_VERSION = 1;
  private readonly DESIGNS_STORE = 'designs';
  private readonly ASSETS_STORE = 'assets';

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create designs store
        if (!db.objectStoreNames.contains(this.DESIGNS_STORE)) {
          const designsStore = db.createObjectStore(this.DESIGNS_STORE, { keyPath: 'id' });
          designsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          designsStore.createIndex('folderId', 'folderId', { unique: false });
          designsStore.createIndex('isFavorite', 'isFavorite', { unique: false });
        }

        // Create assets store
        if (!db.objectStoreNames.contains(this.ASSETS_STORE)) {
          const assetsStore = db.createObjectStore(this.ASSETS_STORE, { keyPath: 'id' });
          assetsStore.createIndex('type', 'type', { unique: false });
          assetsStore.createIndex('folderId', 'folderId', { unique: false });
        }
      };
    });
  }

  async saveDesign(design: DesignDocument): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.DESIGNS_STORE], 'readwrite');
      const store = transaction.objectStore(this.DESIGNS_STORE);
      const request = store.put(design);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.addToRecent(design.id);
        resolve();
      };
    });
  }

  async loadDesign(id: string): Promise<DesignDocument | null> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.DESIGNS_STORE], 'readonly');
      const store = transaction.objectStore(this.DESIGNS_STORE);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async loadAllDesigns(): Promise<DesignDocument[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.DESIGNS_STORE], 'readonly');
      const store = transaction.objectStore(this.DESIGNS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async deleteDesign(id: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.DESIGNS_STORE], 'readwrite');
      const store = transaction.objectStore(this.DESIGNS_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.removeFromRecent(id);
        resolve();
      };
    });
  }

  async duplicateDesign(id: string): Promise<DesignDocument> {
    const original = await this.loadDesign(id);
    if (!original) throw new Error('Design not found');

    const duplicate: DesignDocument = {
      ...original,
      id: this.generateId(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    // Deep copy pages and elements
    duplicate.pages = original.pages.map(page => ({
      ...page,
      id: this.generateId(),
      elements: page.elements.map(element => ({
        ...element,
        id: this.generateId()
      }))
    }));

    await this.saveDesign(duplicate);
    return duplicate;
  }

  private addToRecent(designId: string): void {
    const recent = this.getRecentDesigns();
    const updated = [designId, ...recent.filter(id => id !== designId)].slice(0, MAX_RECENT_DESIGNS);
    localStorage.setItem(RECENT_DESIGNS_KEY, JSON.stringify(updated));
  }

  private removeFromRecent(designId: string): void {
    const recent = this.getRecentDesigns();
    const updated = recent.filter(id => id !== designId);
    localStorage.setItem(RECENT_DESIGNS_KEY, JSON.stringify(updated));
  }

  getRecentDesigns(): string[] {
    try {
      return JSON.parse(localStorage.getItem(RECENT_DESIGNS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  async getRecentDesignDocuments(): Promise<DesignDocument[]> {
    const recentIds = this.getRecentDesigns();
    const allDesigns = await this.loadAllDesigns();
    const recentMap = new Map(recentIds.map((id, index) => [id, index]));
    
    return allDesigns
      .filter(design => recentIds.includes(design.id))
      .sort((a, b) => (recentMap.get(a.id) || 0) - (recentMap.get(b.id) || 0));
  }

  async searchDesigns(query: string): Promise<DesignDocument[]> {
    const allDesigns = await this.loadAllDesigns();
    const lowerQuery = query.toLowerCase();
    
    return allDesigns.filter(design =>
      design.name.toLowerCase().includes(lowerQuery) ||
      design.description?.toLowerCase().includes(lowerQuery) ||
      design.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getDesignsByFolder(folderId: string): Promise<DesignDocument[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.DESIGNS_STORE], 'readonly');
      const store = transaction.objectStore(this.DESIGNS_STORE);
      const index = store.index('folderId');
      const request = index.getAll(folderId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async getFavoriteDesigns(): Promise<DesignDocument[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.DESIGNS_STORE], 'readonly');
      const store = transaction.objectStore(this.DESIGNS_STORE);
      const index = store.index('isFavorite');
      const request = index.getAll(true);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  private generateId(): string {
    return `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async exportDesignAsJSON(design: DesignDocument): Promise<string> {
    return JSON.stringify(design, null, 2);
  }

  async importDesignFromJSON(json: string): Promise<DesignDocument> {
    const design = JSON.parse(json) as DesignDocument;
    
    // Validate format
    if (!design.id || !design.name || !design.pages) {
      throw new Error('Invalid design format');
    }

    // Generate new ID to avoid conflicts
    design.id = this.generateId();
    design.createdAt = new Date().toISOString();
    design.updatedAt = new Date().toISOString();

    await this.saveDesign(design);
    return design;
  }
}

export const designStorage = new DesignStorageService();