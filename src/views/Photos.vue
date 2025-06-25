<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Photo Gallery</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Explore albums and discover amazing photography
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex items-center space-x-4">
        <!-- View Toggle -->
        <div class="flex rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            @click="viewMode = 'albums'"
            class="px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200"
            :class="viewMode === 'albums'
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            Albums
          </button>
          <button
            @click="viewMode = 'photos'"
            class="px-3 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200"
            :class="viewMode === 'photos'
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            All Photos
          </button>
        </div>
        
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="viewMode === 'albums' ? 'Search albums...' : 'Search photos...'"
            class="input w-64 pl-10"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading gallery..." />

    <!-- Albums View -->
    <div v-else-if="viewMode === 'albums'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="album in filteredAlbums"
          :key="album.id"
          @click="openAlbum(album)"
          class="card-hover p-0 overflow-hidden cursor-pointer group"
        >
          <!-- Album Cover -->
          <div class="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 relative overflow-hidden">
            <img
              v-if="albumCovers[album.id]"
              :src="albumCovers[album.id]"
              :alt="album.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <!-- Photo Count Badge -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
              {{ getAlbumPhotoCount(album.id) }} photos
            </div>
          </div>
          
          <!-- Album Info -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {{ album.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              By User {{ album.userId }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty Albums State -->
      <div v-if="filteredAlbums.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No albums found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'Try adjusting your search terms.' : 'No albums available at the moment.' }}
        </p>
      </div>
    </div>

    <!-- Photos View -->
    <div v-else-if="viewMode === 'photos'">
      <!-- Photos Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div
          v-for="photo in displayedPhotos"
          :key="photo.id"
          @click="openPhoto(photo)"
          class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-200"
        >
          <img
            :src="photo.thumbnailUrl"
            :alt="photo.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMorePhotos" class="text-center mt-8">
        <button
          @click="loadMorePhotos"
          :disabled="loadingMore"
          class="btn-secondary"
        >
          <span v-if="loadingMore">Loading...</span>
          <span v-else>Load More Photos</span>
        </button>
      </div>

      <!-- Empty Photos State -->
      <div v-if="filteredPhotos.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No photos found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'Try adjusting your search terms.' : 'No photos available at the moment.' }}
        </p>
      </div>
    </div>

    <!-- Album Detail Modal -->
    <div v-if="selectedAlbum" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeAlbum"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <!-- Album Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ selectedAlbum.title }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">By User {{ selectedAlbum.userId }}</p>
            </div>
            <button
              @click="closeAlbum"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Album Photos -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <LoadingSpinner v-if="loadingAlbumPhotos" size="sm" />
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="photo in albumPhotos"
                :key="photo.id"
                @click="openPhoto(photo)"
                class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  :src="photo.thumbnailUrl"
                  :alt="photo.title"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Lightbox Modal -->
    <div v-if="selectedPhoto" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-90 transition-opacity" @click="closePhoto"></div>
      
      <div class="relative max-w-5xl max-h-[90vh] mx-4">
        <!-- Close Button -->
        <button
          @click="closePhoto"
          class="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Photo -->
        <img
          :src="selectedPhoto.url"
          :alt="selectedPhoto.title"
          class="max-w-full max-h-full object-contain rounded-lg"
          @error="handleImageError"
        />
        
        <!-- Photo Info -->
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
          <h3 class="font-semibold text-lg">{{ selectedPhoto.title }}</h3>
          <p class="text-sm opacity-75">Photo #{{ selectedPhoto.id }} • Album {{ selectedPhoto.albumId }}</p>
        </div>
        
        <!-- Navigation Arrows -->
        <button
          v-if="canNavigatePhotos"
          @click="previousPhoto"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          v-if="canNavigatePhotos"
          @click="nextPhoto"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { photoService } from '../services/photoService'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import type { Album, Photo } from '../types'
import { useToast } from '../composables/useToast'

const { error } = useToast()

const albums = ref<Album[]>([])
const photos = ref<Photo[]>([])
const albumPhotos = ref<Photo[]>([])
const albumCovers = ref<Record<number, string>>({})

const loading = ref(true)
const loadingMore = ref(false)
const loadingAlbumPhotos = ref(false)

const searchQuery = ref('')
const viewMode = ref<'albums' | 'photos'>('albums')
const currentPhotoPage = ref(1)
const photosPerPage = 20

const selectedAlbum = ref<Album | null>(null)
const selectedPhoto = ref<Photo | null>(null)
const currentPhotoIndex = ref(0)

const filteredAlbums = computed(() => {
  if (!searchQuery.value) return albums.value
  
  const query = searchQuery.value.toLowerCase()
  return albums.value.filter(album =>
    album.title.toLowerCase().includes(query)
  )
})

const filteredPhotos = computed(() => {
  if (!searchQuery.value) return photos.value
  
  const query = searchQuery.value.toLowerCase()
  return photos.value.filter(photo =>
    photo.title.toLowerCase().includes(query)
  )
})

const displayedPhotos = computed(() => {
  return filteredPhotos.value.slice(0, currentPhotoPage.value * photosPerPage)
})

const hasMorePhotos = computed(() => {
  return displayedPhotos.value.length < filteredPhotos.value.length
})

const canNavigatePhotos = computed(() => {
  return selectedAlbum.value && albumPhotos.value.length > 1
})

const getAlbumPhotoCount = (albumId: number) => {
  return photos.value.filter(photo => photo.albumId === albumId).length
}

const loadGallery = async () => {
  try {
    loading.value = true
    const [albumsData, photosData] = await Promise.all([
      photoService.getAllAlbums(),
      photoService.getAllPhotos()
    ])
    
    albums.value = albumsData
    photos.value = photosData
    
    // Load album covers (first photo of each album)
    const covers: Record<number, string> = {}
    albumsData.forEach(album => {
      const firstPhoto = photosData.find(photo => photo.albumId === album.id)
      if (firstPhoto) {
        covers[album.id] = firstPhoto.thumbnailUrl
      }
    })
    albumCovers.value = covers
  } catch (err) {
    error('Error loading gallery', 'Please try again later')
    console.error('Error loading gallery:', err)
  } finally {
    loading.value = false
  }
}

const loadMorePhotos = () => {
  loadingMore.value = true
  currentPhotoPage.value++
  // Simulate loading delay
  setTimeout(() => {
    loadingMore.value = false
  }, 500)
}

const openAlbum = async (album: Album) => {
  selectedAlbum.value = album
  
  try {
    loadingAlbumPhotos.value = true
    albumPhotos.value = await photoService.getAlbumPhotos(album.id)
  } catch (err) {
    error('Error loading album photos', 'Please try again later')
    console.error('Error loading album photos:', err)
  } finally {
    loadingAlbumPhotos.value = false
  }
}

const closeAlbum = () => {
  selectedAlbum.value = null
  albumPhotos.value = []
}

const openPhoto = (photo: Photo) => {
  selectedPhoto.value = photo
  
  // Set current photo index for navigation
  if (selectedAlbum.value) {
    currentPhotoIndex.value = albumPhotos.value.findIndex(p => p.id === photo.id)
  } else {
    currentPhotoIndex.value = displayedPhotos.value.findIndex(p => p.id === photo.id)
  }
}

const closePhoto = () => {
  selectedPhoto.value = null
  currentPhotoIndex.value = 0
}

const previousPhoto = () => {
  if (!canNavigatePhotos.value) return
  
  const photos = selectedAlbum.value ? albumPhotos.value : displayedPhotos.value
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + photos.length) % photos.length
  selectedPhoto.value = photos[currentPhotoIndex.value]
}

const nextPhoto = () => {
  if (!canNavigatePhotos.value) return
  
  const photos = selectedAlbum.value ? albumPhotos.value : displayedPhotos.value
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.length
  selectedPhoto.value = photos[currentPhotoIndex.value]
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!selectedPhoto.value) return
  
  switch (event.key) {
    case 'Escape':
      closePhoto()
      break
    case 'ArrowLeft':
      previousPhoto()
      break
    case 'ArrowRight':
      nextPhoto()
      break
  }
}

onMounted(() => {
  loadGallery()
  document.addEventListener('keydown', handleKeydown)
})

// Cleanup event listener
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>