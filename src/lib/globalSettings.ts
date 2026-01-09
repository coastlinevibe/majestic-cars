// Global settings management using Supabase
import { supabase } from './supabase';

export type WidgetType = 'chatbot' | 'whatsapp';

export interface GlobalSettings {
  id: string;
  widget_type: WidgetType;
  whatsapp_number: string;
  updated_at: string;
}

const SETTINGS_ID = 'global_settings'; // Single row for global settings

export const globalSettingsService = {
  // Get global settings from Supabase
  async getSettings(): Promise<GlobalSettings | null> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .single();
      
      if (error) {
        console.error('Error fetching settings:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  },

  // Update widget type
  async setWidgetType(type: WidgetType): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: SETTINGS_ID,
          widget_type: type,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating widget type:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving widget type:', error);
      return false;
    }
  },

  // Update WhatsApp number
  async setWhatsAppNumber(number: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: SETTINGS_ID,
          whatsapp_number: number,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating WhatsApp number:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving WhatsApp number:', error);
      return false;
    }
  },

  // Initialize settings if they don't exist
  async initializeSettings(): Promise<void> {
    try {
      const existing = await this.getSettings();
      
      if (!existing) {
        await supabase
          .from('site_settings')
          .insert({
            id: SETTINGS_ID,
            widget_type: 'chatbot',
            whatsapp_number: '0608579146',
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
    }
  }
};
