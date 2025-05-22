import { api } from './api'

export interface ContactInfo {
  email: string
  phone: string
}

export const contactServices = {
  getContactInfo: async () => {
    const response = await api.get('/contact')
    return response.data
  },

  updateContactInfo: async (contactData: Partial<ContactInfo>) => {
    const response = await api.put('/api/contact', contactData)
    return response.data
  }
}