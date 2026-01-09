// Settings management for the application
export type WidgetType = 'chatbot' | 'whatsapp';

export interface AppSettings {
  widgetType: WidgetType;
  whatsappNumber: string;
}

const SETTINGS_KEY = 'app_settings';

const defaultSettings: AppSettings = {
  widgetType: 'chatbot',
  whatsappNumber: '27608579146',
};

export const settingsService = {
  // Get settings from localStorage
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  },

  // Save settings to localStorage
  saveSettings(settings: Partial<AppSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Get widget type
  getWidgetType(): WidgetType {
    return this.getSettings().widgetType;
  },

  // Set widget type
  setWidgetType(type: WidgetType): void {
    this.saveSettings({ widgetType: type });
  },

  // Get WhatsApp number
  getWhatsAppNumber(): string {
    return this.getSettings().whatsappNumber;
  },

  // Set WhatsApp number
  setWhatsAppNumber(number: string): void {
    this.saveSettings({ whatsappNumber: number });
  },
};
