<template>
    <div class="background d-flex flex-column">
        <div class="mb-3">
            <h1 class="text-center mt-10 color-principal">Activité récente</h1>
        </div>
        <!--On crée une boucle avec Vue pour afficher les publications une par une -->
        <v-card class="mx-auto mt-4 mb-4" v-for = "publication in publications" :key="publication.id" width="445">
            <v-img v-if = "publication.image_url !== ''" :src="publication.image_url" alt="Image de la publication" max-height="600px"></v-img>
            <v-divider horizontal></v-divider>
            <!--Router link pour envoyer vers la publication en cliquant sur le titre -->
            <router-link :to="{ name: 'OnePublication', params: { id: publication.id}}" class="text-decoration-none black--text">
                <v-card-title class="text-h6 font-weight-black">{{publication.titre}}</v-card-title>
            </router-link>
            <v-card-subtitle class='text-body-1'>{{publication.description}}</v-card-subtitle>
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
            publications: [], //Variable vide pour recevoir la réponse du backend
        }
    },
    mounted(){ //On appelle les publications quand le composant est affiché avec la authentification de l'utilisateur
        this.getAllPublications()
    },
    methods: {
        getAllPublications(){ //Fonction pour appeler toutes les publications dans la base des données
            connectedClient.get('/publications')
            .then(res => {
                //On rempli la variable publications avec la réponse
                this.publications = res.data.publications
            })
        },
        formatDate(date){ //Fonction pour convertir le timestamp de la base de données au format français
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
      min-height: 100%;
    }

    .nom-date{
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.781);
    }
</style>