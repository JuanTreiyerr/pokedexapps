<template>
  <main class="container mx-auto flex flex-col">
    <h1 class="title">Pokedex</h1>
    <form @submit.prevent="addPokemon" class="form">
      <h2 class="subtitle">Agregar nuevo pokemon</h2>
      <input type="number" v-model="newPokemon.id" placeholder="ID" class="input" />
      <input type="text" v-model="newPokemon.name" placeholder="Name" class="input" />
      <button type="submit" class="submit-button">Agregar</button>
    </form>
    <ul class="pokemon-list">
      <li class="list-header">
        <span class="text-lg text-white font-extrabold w-1/3">ID</span>
        <span class="text-lg text-white font-extrabold w-1/3 text-center">Name</span>
        <span class="text-lg text-white font-extrabold w-1/3 text-right">DELETE</span>
      </li>
      <li v-for="pokemon in pokemons" :key="pokemon.id" class="list-item">
        <span class="text-lg text-red-600 font-bold w-1/3">{{ pokemon.id }}</span>
        <span class="text-lg text-red-600 font-bold w-1/3 text-center">{{ pokemon.name }}</span>
        <button @click.prevent="deletePokemon(pokemon.id)" class="delete-button">
          X
        </button>
      </li>
    </ul>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      pokemons: [],
      newPokemon: {
        id: null,
        name: ''
      }
    }
  },
  mounted () {
    this.getPokemons()
  },
  methods: {
    async getPokemons () {
      try {
        const response = await axios.get('http://localhost:4321/api/pokemon')
        this.pokemons = response.data
      } catch (error) {
        console.error('Error fetching pokemons:', error)
      }
    },
    async addPokemon () {
      try {
        await axios.post('http://localhost:4321/api/pokemon', this.newPokemon)
        this.getPokemons()
        this.newPokemon.id = null
        this.newPokemon.name = ''
      } catch (error) {
        console.error('Error adding pokemon:', error)
      }
    },
    async deletePokemon (id) {
      try {
        await axios.delete(`http://localhost:4321/api/pokemon/${id}`)
        this.getPokemons()
      } catch (error) {
        console.error('Error deleting pokemon:', error)
      }
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 5rem;
  color: #c53030;
  font-weight: 800;
}

.subtitle {
  font-size: 2rem;
  color: #c53030;
  font-weight: 700;
}

.form {
  margin-top: 2rem;
}

.input {
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
}

.submit-button {
  width: 100%;
  padding: 0.5rem;
  background-color: #c53030;
  color: white;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

.pokemon-list {
  margin-top: 4rem;
  border: 4px solid #c53030;
}

.list-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #cbd5e0;
  padding: 2rem;
  background-color: #c53030;
}

.list-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #cbd5e0;
  padding: 2rem;
}

.delete-button {
  font-weight: bold;
  cursor: pointer;
}
</style>
