<template>
    <div class='OnePublication background'>
        <Header v-if='approuvedConnexion' />
        <UserNav v-if='approuvedConnexion' />

        <v-card class="mx-auto mt-8" :key="publication.id" max-width="445">
            <v-img v-if = "publication.image_url !== ''" :src="publication.image_url" alt="Image de la publication" max-height="600px"></v-img>
            <v-divider horizontal></v-divider>
            <v-card-title class="my-4">{{publication.titre}}</v-card-title>
            <v-card-subtitle class="mx-auto">{{publication.description}}</v-card-subtitle>
            <div class="nom-date px-5 py-3">Publié par {{ publication.prenom }} {{ publication.nom }} | Le {{ formatDate(publication.creation_date) }}</div>
            <!-- v-if pour autoriser le propiétaire du post ou le modérateur pour l'effacer -->
            <button v-if="sessionUserId === publication.user_id || sessionUserLevel === 1" @click="deletePublication(publication.id)" id="effacer" class="mx-5 my-10" type="button">EFFACER </button>
        </v-card>
        <div class="messagestyle">{{message}}</div>
    </div>
</template>
<script>
import { connectedClient } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

import Header from '../components/Header.vue';
import UserNav from '../components/UserNav';

export default {
    name: 'OnePublication',
    components: {
        Header,
        UserNav
    },
    data(){
        return {
            approuvedConnexion: false,
            sessionUserId: 0,
            sessionUserLevel: 0,
            publication: [],
            message: ""
        }
    },
    created(){
        this.connectedUser()
    },
    mounted(){
        if(this.approuvedConnexion){ //Fonction pour décoder le token dans le localStorage et récupérer le id et access_level
            const token = JSON.parse(localStorage.groupomaniaUser).token
            let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);       
            this.sessionUserId = decodedToken.userId                                               
            this.sessionUserLevel = decodedToken.access_level                                      
            this.getOnePublication();
        }
    },
    methods: {
        connectedUser(){ // fonction de vérification de la session utilisateur (Item dans le localStorage)
            if(localStorage.groupomaniaUser == undefined){
                this.approuvedConnexion = false
                console.log('Utilisateur non connecté !')
                this.$router.push({ name: 'Home' })
            } else {
                this.approuvedConnexion = true
                console.log('Utilisateur connecté !')
            }
        },
        getOnePublication(){ //Requête pour récupérer la publication basée sur les paramêtres de l'url
            const publicationId = this.$route.params.id
            connectedClient.get(`/publications/${publicationId}`)
            .then(res => {
                if(res.data.publication[0] === undefined){
                    this.publication = 0
                } else {
                    //On rempli la variable publication avec la réponse
                    this.publication = res.data.publication[0]
                }
            })
        },
        deletePublication(id){ //Fonction pour effacer une publication                  
            const publicationId = id;
            if(window.confirm("ATTENTION : La suppression de la publication est définitive ! Voulez-vous continuer ?")){
                //Si validé, on passe la requête vers l'API pour effacer la publication
                connectedClient.delete(`/publications/${publicationId}`)
                .then((res) => {
                    if(res.status === 200) {
                    this.message = res.data.message
                    setTimeout(()=> { location.href = '/'}, 2000)          
                    }
                })
            }
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
     .background{
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      min-height: 100%;
    }

    .nom-date{
        font-size: .8rem;
        color: rgba(0, 0, 0, 0.781);
    }

    .messagestyle {
      text-align: center;
      margin: auto;
      color: rgb(3, 102, 0);
      font-size: 1.2rem;
      font-weight: bold;
    }

    #effacer {
        padding: 6px 12px;
        font-size: 1rem;
        color: white;
        background-color: #d1515a;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #effacer:hover{
        transform: scale(1.1);
    }
</style>