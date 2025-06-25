import api from './api'
import type { Album, Photo } from '../types'

export const photoService = {
  async getAllAlbums(): Promise<Album[]> {
    return await api.get('/albums')
  },
  
  async getAlbumById(id: number): Promise<Album> {
    return await api.get(`/albums/${id}`)
  },
  
  async getAlbumPhotos(albumId: number): Promise<Photo[]> {
    return await api.get(`/albums/${albumId}/photos`)
  },
  
  async getAllPhotos(): Promise<Photo[]> {
    return await api.get('/photos')
  },
  
  async getPhotoById(id: number): Promise<Photo> {
    return await api.get(`/photos/${id}`)
  }
}