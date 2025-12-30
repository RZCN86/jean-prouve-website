import { Scholar, Publication, Exhibition } from '@/types';

// Content update types
export interface ContentUpdate {
  id: string;
  type: 'scholar' | 'publication' | 'exhibition';
  action: 'add' | 'update' | 'delete';
  timestamp: string;
  data: any;
  author?: string;
  description?: string;
}

export interface ContentVersion {
  version: string;
  timestamp: string;
  changes: ContentUpdate[];
  description: string;
}

// Content update utilities
export class ContentUpdateManager {
  private updates: ContentUpdate[] = [];
  private versions: ContentVersion[] = [];

  // Add a new scholar
  addScholar(scholar: Scholar, author?: string): ContentUpdate {
    const update: ContentUpdate = {
      id: `scholar-add-${Date.now()}`,
      type: 'scholar',
      action: 'add',
      timestamp: new Date().toISOString(),
      data: scholar,
      author,
      description: `Added new scholar: ${scholar.name}`
    };

    this.updates.push(update);
    return update;
  }

  // Update existing scholar
  updateScholar(scholarId: string, updates: Partial<Scholar>, author?: string): ContentUpdate {
    const update: ContentUpdate = {
      id: `scholar-update-${Date.now()}`,
      type: 'scholar',
      action: 'update',
      timestamp: new Date().toISOString(),
      data: { id: scholarId, ...updates },
      author,
      description: `Updated scholar: ${scholarId}`
    };

    this.updates.push(update);
    return update;
  }

  // Add publication to scholar
  addPublication(scholarId: string, publication: Publication, author?: string): ContentUpdate {
    const update: ContentUpdate = {
      id: `publication-add-${Date.now()}`,
      type: 'publication',
      action: 'add',
      timestamp: new Date().toISOString(),
      data: { scholarId, publication },
      author,
      description: `Added publication: ${publication.title}`
    };

    this.updates.push(update);
    return update;
  }

  // Add exhibition to scholar
  addExhibition(scholarId: string, exhibition: Exhibition, author?: string): ContentUpdate {
    const update: ContentUpdate = {
      id: `exhibition-add-${Date.now()}`,
      type: 'exhibition',
      action: 'add',
      timestamp: new Date().toISOString(),
      data: { scholarId, exhibition },
      author,
      description: `Added exhibition: ${exhibition.title}`
    };

    this.updates.push(update);
    return update;
  }

  // Create a new version
  createVersion(description: string): ContentVersion {
    const version: ContentVersion = {
      version: `v${this.versions.length + 1}.0.0`,
      timestamp: new Date().toISOString(),
      changes: [...this.updates],
      description
    };

    this.versions.push(version);
    this.updates = []; // Clear pending updates
    return version;
  }

  // Get all updates
  getUpdates(): ContentUpdate[] {
    return [...this.updates];
  }

  // Get all versions
  getVersions(): ContentVersion[] {
    return [...this.versions];
  }

  // Get updates by type
  getUpdatesByType(type: ContentUpdate['type']): ContentUpdate[] {
    return this.updates.filter(update => update.type === type);
  }

  // Get recent updates (last N days)
  getRecentUpdates(days: number = 30): ContentUpdate[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.updates.filter(update => 
      new Date(update.timestamp) >= cutoffDate
    );
  }
}

// Content validation utilities
export class ContentValidator {
  // Validate scholar data
  static validateScholar(scholar: Partial<Scholar>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!scholar.name || scholar.name.trim().length === 0) {
      errors.push('Scholar name is required');
    }

    if (!scholar.institution || scholar.institution.trim().length === 0) {
      errors.push('Institution is required');
    }

    if (!scholar.country || scholar.country.trim().length === 0) {
      errors.push('Country is required');
    }

    if (!scholar.region || scholar.region.trim().length === 0) {
      errors.push('Region is required');
    }

    if (!scholar.specialization || scholar.specialization.length === 0) {
      errors.push('At least one specialization is required');
    }

    if (!scholar.biography || scholar.biography.trim().length === 0) {
      errors.push('Biography is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate publication data
  static validatePublication(publication: Partial<Publication>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!publication.title || publication.title.trim().length === 0) {
      errors.push('Publication title is required');
    }

    if (!publication.type) {
      errors.push('Publication type is required');
    }

    if (!publication.year || publication.year < 1900 || publication.year > new Date().getFullYear() + 1) {
      errors.push('Valid publication year is required');
    }

    if (!publication.abstract || publication.abstract.trim().length === 0) {
      errors.push('Abstract is required');
    }

    if (!publication.keywords || publication.keywords.length === 0) {
      errors.push('At least one keyword is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate exhibition data
  static validateExhibition(exhibition: Partial<Exhibition>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!exhibition.title || exhibition.title.trim().length === 0) {
      errors.push('Exhibition title is required');
    }

    if (!exhibition.venue || exhibition.venue.trim().length === 0) {
      errors.push('Venue is required');
    }

    if (!exhibition.year || exhibition.year < 1900 || exhibition.year > new Date().getFullYear() + 1) {
      errors.push('Valid exhibition year is required');
    }

    if (!exhibition.description || exhibition.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!exhibition.role || exhibition.role.trim().length === 0) {
      errors.push('Role is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Content synchronization utilities
export class ContentSynchronizer {
  // Sync with external data sources
  static async syncWithExternalSource(sourceUrl: string): Promise<Scholar[]> {
    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${sourceUrl}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate and transform data
      const scholars: Scholar[] = [];
      for (const item of data) {
        const validation = ContentValidator.validateScholar(item);
        if (validation.isValid) {
          scholars.push(item as Scholar);
        } else {
          console.warn(`Invalid scholar data:`, validation.errors);
        }
      }
      
      return scholars;
    } catch (error) {
      console.error('Error syncing with external source:', error);
      throw error;
    }
  }

  // Generate content update report
  static generateUpdateReport(updates: ContentUpdate[]): string {
    const report = {
      totalUpdates: updates.length,
      byType: updates.reduce((acc, update) => {
        acc[update.type] = (acc[update.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byAction: updates.reduce((acc, update) => {
        acc[update.action] = (acc[update.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentUpdates: updates.filter(update => {
        const updateDate = new Date(update.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return updateDate >= weekAgo;
      }).length
    };

    return `Content Update Report:
- Total Updates: ${report.totalUpdates}
- By Type: ${Object.entries(report.byType).map(([type, count]) => `${type}: ${count}`).join(', ')}
- By Action: ${Object.entries(report.byAction).map(([action, count]) => `${action}: ${count}`).join(', ')}
- Recent Updates (last 7 days): ${report.recentUpdates}`;
  }
}

// Export singleton instance
export const contentUpdateManager = new ContentUpdateManager();