import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weatherData: null,
    isLoading: true,
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
  }),
  actions: {
    async getWeatherData(city) {
      try {
        this.isLoading = true

        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${
            import.meta.env.VITE_API
          }&q=${city}&days=3`
        )

        if (response.status === 200) {
          this.weatherData = response.data
        }
      } catch (error) {
        console.error(error)
        alert('Invalid input')
      } finally {
        this.isLoading = false
      }
    },

    async getLocationData() {
      if (navigator.geolocation) {
        this.isLoading = true

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const latitude = position.coords.latitude
              const longitude = position.coords.longitude
              const response = await axios.get(
                `https://api.weatherapi.com/v1/forecast.json?key=${
                  import.meta.env.VITE_API
                }&q=${latitude},${longitude}&days=3`
              )

              this.weatherData = response.data
            } catch (error) {
              console.error(error)
            } finally {
              this.isLoading = false
            }
          },
          (error) => {
            alert('Failed to get location: ' + error.message)
            this.isLoading = false
          }
        )
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },

    // Favorites

    addToFavorite(favorite) {
      this.favorites.push(favorite)
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    removeFavorite(favorite) {
      this.favorites = this.favorites.filter((item) => item !== favorite)
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    loadToFavoritesFromStorage() {
      const favoritesData = localStorage.getItem('favorites')
      if (favoritesData) {
        this.favorites = favoritesData
      }
    }
  }
})
