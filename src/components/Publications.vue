<template>
    <div class="background d-flex flex-column">
        <div>
            <h1 class="text-center mt-10 color-principal">Activité récente</h1>
        </div>
        <v-card class="mx-auto mt-8" v-for = "publication in publications" :key="publication.id" width="445">
            <v-img v-if = "publication.image_url !== ''" :src="publication.image_url" alt="Image de la publication" max-height="600px"></v-img>
            <v-divider horizontal></v-divider>
            <router-link :to="{ name: 'OnePublication', params: { id: publication.id}}" class="text-decoration-none black--text">
                <v-card-title class="text-h6 font-weight-black">{{publication.titre}}</v-card-title>
            </router-link>
            <v-card-subtitle class='body-1'>{{publication.description}}</v-card-subtitle>
            <div class="nom-date px-5 py-3">Publié par {{ publication.prenom }} {{ publication.nom }} | Le {{ formatDate(publication.creation_date) }}</div>
        </v-card>
    </div>
</template>
<script>
import { connectedClient } from '../services/auth.js';

export default {
    name: 'Publications',
    data() {
        return {
            publications: [],
        }
    },
    mounted(){
        this.getAllPublications()
    },
    methods: {
        getAllPublications(){
            connectedClient.get('/publications')
            .then(res => {
                console.log(res)
                this.publications = res.data.publications
            })
        },
        formatDate(date){
            const event = new Date(date);
            const options ={ year: 'numeric', month:'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
            return event.toLocaleDateString('fr-FR', options)
        }
    }
}
</script>
<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Signika:wght@300;700&display=swap');
    div {
        font-family: 'Signika', sans-serif;
    }

    .color-principal {
        color: #122441;
    }
   .background{
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      min-height: 100vh;
    }

    .nom-date{
        font-size: .6rem;
        color: rgba(0, 0, 0, 0.781);
    }
</style>